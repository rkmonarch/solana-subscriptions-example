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
import { getPlan, getSubscriptionAuthority } from "./queries";
import { deriveAta } from "./token";

function requireWallet(wallet: WalletContextState) {
  if (!wallet.publicKey) throw new Error("Connect a wallet first.");
  return address(wallet.publicKey.toBase58());
}

export interface SubscribeResult {
  /** Present only the first time a user ever subscribes on this mint. */
  initSignature?: string;
  subscribeSignature: string;
}

/**
 * Returns an idempotent instruction that creates the USDC ATA for `owner` if it doesn't exist,
 * and does nothing if it already does. Including this before `initSubscriptionAuthority` ensures
 * the program can read the ATA data it validates (owner, mint match) regardless of whether the
 * user has already received any USDC.
 */
function buildEnsureAtaInstruction(
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
) {
  const ata = new PublicKey(deriveAta(address(owner.toBase58()), address(mint.toBase58())));
  const legacyIx = createAssociatedTokenAccountIdempotentInstruction(
    payer,   // fee payer / rent payer
    ata,     // associated token account address
    owner,   // ATA owner
    mint,    // token mint
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  return fromLegacyInstruction(legacyIx);
}

/**
 * Subscribes the connected wallet to `service`.
 *
 * Flow:
 *  1. Create USDC ATA for the user (idempotent — safe even if it already exists).
 *  2. Initialize the SubscriptionAuthority for (user, USDC) if this is the first subscription
 *     ever on this mint — one account shared across all services.
 *  3. Subscribe to the plan.
 *
 * Steps 1+2 are batched into one transaction when the authority doesn't exist yet.
 * Step 3 is always its own transaction (different nonce/blockhash after step 1+2 confirm).
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

  // Pre-flight: ensure the user has enough SOL for rent.
  // initSubscriptionAuthority creates a ~107-byte PDA (~0.0014 SOL rent) and subscribe creates a
  // ~155-byte PDA (~0.0018 SOL rent) — we require 0.005 SOL with a safety buffer.
  const MIN_SOL_LAMPORTS = 5_000_000; // 0.005 SOL
  const solBalance = await connection.getBalance(wallet.publicKey!, "confirmed");
  if (solBalance < MIN_SOL_LAMPORTS) {
    throw new Error(
      `Insufficient devnet SOL. You need at least 0.005 SOL to pay for account rent, ` +
      `but your wallet only has ${(solBalance / 1e9).toFixed(6)} SOL. ` +
      `Get devnet SOL at https://faucet.solana.com`,
    );
  }

  let authority = await getSubscriptionAuthority(subscriber, tokenMint);
  let initSignature: string | undefined;

  if (!authority) {
    // Bundle: ensure USDC ATA exists + initialize SubscriptionAuthority in one tx.
    const ensureAtaIx = buildEnsureAtaInstruction(walletPubkey, walletPubkey, mintPubkey);
    const initIx = await buildInitSubscriptionAuthorityInstruction(subscriber, tokenMint);
    initSignature = await signAndSendInstructions(connection, wallet, [ensureAtaIx, initIx]);

    // Re-fetch authority so we have the on-chain initId for the subscribe instruction.
    authority = await getSubscriptionAuthority(subscriber, tokenMint);
    if (!authority) {
      throw new Error("Subscription authority did not appear on-chain after initialization. Check your RPC and try again.");
    }
  }

  const plan = await getPlan(merchant, service.planId);
  if (!plan) {
    throw new Error(
      `${service.name} plan not found on-chain. Run \`npm run bootstrap\` first.`,
    );
  }

  const subscribeIx = await buildSubscribeInstruction({
    subscriber,
    merchant,
    planId: service.planId,
    tokenMint,
    plan,
    authorityInitId: authority.initId,
  });
  const subscribeSignature = await signAndSendInstructions(connection, wallet, [subscribeIx]);

  return { initSignature, subscribeSignature };
}

export async function cancelService(
  connection: Connection,
  wallet: WalletContextState,
  service: ServiceConfig,
): Promise<string> {
  const subscriber = requireWallet(wallet);
  const merchant = getServiceOwner(service);
  const ix = await buildCancelSubscriptionInstruction(subscriber, merchant, service.planId);
  return signAndSendInstructions(connection, wallet, [ix]);
}

export async function resumeService(
  connection: Connection,
  wallet: WalletContextState,
  service: ServiceConfig,
): Promise<string> {
  const subscriber = requireWallet(wallet);
  const merchant = getServiceOwner(service);
  const ix = await buildResumeSubscriptionInstruction(subscriber, merchant, service.planId);
  return signAndSendInstructions(connection, wallet, [ix]);
}
