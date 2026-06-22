import { address, createSolanaRpc } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";
import { NextResponse, type NextRequest } from "next/server";

// Allow up to 90 s — includes send + polling with rate-limit backoff on public devnet RPC.
export const maxDuration = 90;

import { SERVICES, USDC_DECIMALS, getUsdcMint, RPC_URL } from "@/lib/solana/constants";
import { buildPullPaymentInstruction } from "@/lib/solana/instructions";
import { getPlan } from "@/lib/solana/queries";
import { sendInstructions } from "@/lib/solana/send";
import {
  getNetflixMerchantSigner,
  getSpotifyMerchantSigner,
} from "@/lib/solana/server-signers";

export const runtime = "nodejs";

/**
 * Finds the subscriber's active subscription PDA for a given merchant, trying the current
 * planId first and falling back to older planIds. This handles the migration case where a
 * subscriber may have a subscription under planId=2 (wrong destination format) that was
 * resumed, while the current config points to planId=3 (correct destination format).
 * We only pull against the CURRENT planId's plan (whose destinations are correct) but use
 * the actual subscription PDA regardless of which planId created it.
 *
 * Returns null if no active subscription is found for any known planId.
 */
async function findActiveSubscriptionPda(
  merchantAddress: string,
  subscriberAddress: string,
): Promise<string | null> {
  const { fetchSubscriptionsForUser, findSubscriptionDelegationPda, findPlanPda } =
    await import("@solana/subscriptions");
  const rpc = createSolanaRpc(RPC_URL);
  const sub = address(subscriberAddress);
  const merch = address(merchantAddress);

  // Primary: check current planId subscription
  for (const planId of [3n, 2n, 1n]) {
    try {
      const [planPda] = await findPlanPda({ owner: merch, planId });
      const [subPda] = await findSubscriptionDelegationPda({ planPda, subscriber: sub });
      const { fetchMaybeSubscriptionDelegation } = await import("@solana/subscriptions");
      const subAcc = await fetchMaybeSubscriptionDelegation(rpc, subPda);
      if (subAcc.exists && subAcc.data.expiresAtTs === 0n) {
        // Found active subscription
        console.log(`[/api/pull] found active subscription at planId=${planId}, pda=${subPda}`);
        return subPda;
      }
    } catch {
      // planId doesn't exist or RPC error — try next
    }
  }

  // Fallback: scan ALL delegations for this subscriber
  try {
    const allSubs = await fetchSubscriptionsForUser(rpc, sub);
    const active = allSubs.find(
      (s) => s.data.header.delegator === sub && s.data.expiresAtTs === 0n,
    );
    if (active) {
      console.log(`[/api/pull] found subscription via delegator scan: ${active.address}`);
      return active.address;
    }
  } catch {
    // scan failed
  }

  return null;
}

/**
 * POST /api/pull  { serviceId: "spotify" | "netflix", subscriber: string }
 *
 * The merchant (server-signed) pulls one period's payment from the subscriber's active
 * SubscriptionDelegation. Finds the subscription by scanning all known planIds so old
 * subscriptions (planId=2) still work even after the current config moved to planId=3.
 */
export async function POST(request: NextRequest) {
  let serviceId: string | undefined;
  let subscriber: string | undefined;
  try {
    const body = await request.json();
    serviceId = body?.serviceId;
    subscriber = body?.subscriber;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const service = SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown serviceId." }, { status: 400 });
  }
  if (typeof subscriber !== "string") {
    return NextResponse.json({ error: "Missing `subscriber`." }, { status: 400 });
  }
  try {
    new PublicKey(subscriber);
  } catch {
    return NextResponse.json({ error: "Invalid subscriber address." }, { status: 400 });
  }

  try {
    const merchant =
      service.id === "spotify"
        ? await getSpotifyMerchantSigner()
        : await getNetflixMerchantSigner();

    const tokenMint = getUsdcMint();

    // Always pull from the CURRENT plan (planId=3 — correct destination format).
    // But use the actual subscriptionPda wherever the subscription lives.
    const plan = await getPlan(merchant.kit.address, service.planId);
    if (!plan) {
      return NextResponse.json(
        { error: `${service.name} plan (v3) not found. Run \`npm run bootstrap\`.` },
        { status: 404 },
      );
    }

    const subscriptionPda = await findActiveSubscriptionPda(merchant.address, subscriber);
    if (!subscriptionPda) {
      return NextResponse.json(
        { error: `No active subscription found for this subscriber.` },
        { status: 404 },
      );
    }

    const { buildPullPaymentInstructionWithPda } = await import("@/lib/solana/instructions");
    const ix = await buildPullPaymentInstructionWithPda({
      merchantSigner: merchant.kit,
      subscriber: address(subscriber),
      subscriptionPda: address(subscriptionPda),
      planPda: plan.address,
      tokenMint,
      amount: plan.data.data.terms.amount,
    });

    const signature = await sendInstructions(merchant.kit, [ix]);

    return NextResponse.json({
      signature,
      amount: Number(plan.data.data.terms.amount) / 10 ** USDC_DECIMALS,
    });
  } catch (error) {
    console.error("[/api/pull]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pulling payment failed." },
      { status: 500 },
    );
  }
}
