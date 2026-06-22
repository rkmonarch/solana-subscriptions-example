/**
 * Client-side orchestration: combines the pure instruction builders with live on-chain reads and
 * the connected wallet to perform full subscribe/cancel/resume flows.
 */
import { address } from "@solana/kit";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import type { Connection } from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

import { getServiceOwner, getUsdcMint, type ServiceConfig } from "./constants";
import {
  buildCancelSubscriptionInstruction,
  buildInitSubscriptionAuthorityInstruction,
  buildResumeSubscriptionInstruction,
  buildSubscribeInstruction,
} from "./instructions";
import { fromLegacyInstruction, signAndSendInstructions } from "./legacy-bridge";
import { getPlan, getServiceSubscriptions, getSubscriptionAuthority } from "./queries";
import { deriveAta } from "./token";

function requireWallet(wallet: WalletContextState) {
  if (!wallet.publicKey) throw new Error("Connect a wallet first.");
  return address(wallet.publicKey.toBase58());
}

export interface SubscribeResult {
  /** Present only the first time a user ever subscribes on this mint. */
  initSignature?: string;
  /** "subscribed" = fresh subscription | "resumed" = was cancelled and re-activated. */
  subscribeSignature: string;
  mode: "subscribed" | "resumed";
}

function buildEnsureAtaInstruction(payer: PublicKey, owner: PublicKey, mint: PublicKey) {
  const ata = new PublicKey(deriveAta(address(owner.toBase58()), address(mint.toBase58())));
  return fromLegacyInstruction(
    createAssociatedTokenAccountIdempotentInstruction(
      payer, ata, owner, mint, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  );
}

/**
 * Subscribes the connected wallet to `service`, handling three cases:
 *
 *  A) First-time subscriber — init SubscriptionAuthority + subscribe.
 *  B) Previously cancelled — resume (resets expiresAtTs → 0) so the subscription is active
 *     and payment can be pulled. No new subscription account is created.
 *  C) Already active — throws "already subscribed" (caller should not reach this).
 *
 * The `transferSubscription` program instruction fails with custom error 506 when the
 * subscription is in a cancelled state (expiresAtTs ≠ 0). Resuming first fixes this.
 */
export async function subscribeToService(
  connection: Connection,
  wallet: WalletContextState,
  service: ServiceConfig,
): Promise<SubscribeResult> {
  const subscriber = requireWallet(wallet);
  const tokenMint = getUsdcMint();
  const merchant = getServiceOwner(service);
  const walletPubkey = wallet.publicKey!;
  const mintPubkey = new PublicKey(tokenMint);

  // Pre-flight: SOL balance check for rent
  const MIN_SOL_LAMPORTS = 5_000_000;
  const solBalance = await connection.getBalance(walletPubkey, "confirmed");
  if (solBalance < MIN_SOL_LAMPORTS) {
    throw new Error(
      `Insufficient devnet SOL. You need at least 0.005 SOL for account rent ` +
      `(current: ${(solBalance / 1e9).toFixed(6)} SOL). Get some at https://faucet.solana.com`,
    );
  }

  // Check if the user already has a subscription (possibly cancelled)
  const existingSubs = await getServiceSubscriptions(subscriber);
  const existing = existingSubs.find((s) => s.service.id === service.id);

  // Derive the planPda that corresponds to the CURRENT planId in our config.
  const { findPlanPda } = await import("@solana/subscriptions");
  const [currentPlanPda] = await findPlanPda({ owner: merchant, planId: service.planId });

  if (existing?.data) {
    const isCurrentPlan = existing.planPda === currentPlanPda;

    if (existing.data.expiresAtTs === 0n && isCurrentPlan) {
      // Active subscription on the current plan.
      throw new Error(`Already subscribed to ${service.name}.`);
    }

    if (existing.data.expiresAtTs !== 0n && isCurrentPlan) {
      // Cancelled subscription on the CURRENT plan — resume it.
      const ix = await buildResumeSubscriptionInstruction(
        subscriber, merchant, service.planId, existing.planPda,
      );
      const sig = await signAndSendInstructions(connection, wallet, [ix]);
      return { subscribeSignature: sig, mode: "resumed" };
    }

    // Old planId (e.g. planId=2 with wrong destinations / wrong terms).
    // Don't resume it — fall through and create a fresh subscription at the current planId.
    // The old subscription will remain on-chain until the user explicitly cancels it.
    console.info(
      `[subscribeToService] existing subscription is for an old planId ` +
      `(${existing.planPda.slice(0, 8)}… != current ${currentPlanPda.slice(0, 8)}…). ` +
      `Creating new subscription at current planId.`,
    );
  }

  // No existing subscription — do full init+subscribe flow
  let authority = await getSubscriptionAuthority(subscriber, tokenMint);
  let initSignature: string | undefined;

  if (!authority) {
    const ensureAtaIx = buildEnsureAtaInstruction(walletPubkey, walletPubkey, mintPubkey);
    const initIx = await buildInitSubscriptionAuthorityInstruction(subscriber, tokenMint);
    initSignature = await signAndSendInstructions(connection, wallet, [ensureAtaIx, initIx]);
    authority = await getSubscriptionAuthority(subscriber, tokenMint);
    if (!authority) {
      throw new Error(
        "Subscription authority did not appear on-chain after initialization. Try again.",
      );
    }
  }

  const plan = await getPlan(merchant, service.planId);
  if (!plan) {
    throw new Error(`${service.name} plan not found. Run \`npm run bootstrap\` first.`);
  }

  const subscribeIx = await buildSubscribeInstruction({
    subscriber, merchant, planId: service.planId, tokenMint, plan,
    authorityInitId: authority.initId,
  });
  const subscribeSignature = await signAndSendInstructions(connection, wallet, [subscribeIx]);
  return { initSignature, subscribeSignature, mode: "subscribed" };
}

/**
 * Cancel a subscription. `planPda` is the ACTUAL on-chain planPda stored in the
 * subscription's `header.delegatee` — using it directly avoids mismatches when the
 * service's planId has been bumped (old subscriptions at planId=2, current config planId=3).
 */
export async function cancelService(
  connection: Connection,
  wallet: WalletContextState,
  service: ServiceConfig,
  planPda?: string, // actual on-chain planPda from subscription.header.delegatee
): Promise<string> {
  const subscriber = requireWallet(wallet);
  const merchant = getServiceOwner(service);
  const ix = await buildCancelSubscriptionInstruction(
    subscriber,
    merchant,
    service.planId,
    planPda as import("@solana/kit").Address | undefined,
  );
  return signAndSendInstructions(connection, wallet, [ix]);
}

export async function resumeService(
  connection: Connection,
  wallet: WalletContextState,
  service: ServiceConfig,
  planPda?: string,
): Promise<string> {
  const subscriber = requireWallet(wallet);
  const merchant = getServiceOwner(service);
  const ix = await buildResumeSubscriptionInstruction(
    subscriber,
    merchant,
    service.planId,
    planPda as import("@solana/kit").Address | undefined,
  );
  return signAndSendInstructions(connection, wallet, [ix]);
}
