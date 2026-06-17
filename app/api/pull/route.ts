import { address } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";
import { NextResponse, type NextRequest } from "next/server";

import { SERVICES, USDC_DECIMALS, getUsdcMint } from "@/lib/solana/constants";
import { buildPullPaymentInstruction } from "@/lib/solana/instructions";
import { getPlan } from "@/lib/solana/queries";
import { sendInstructions } from "@/lib/solana/send";
import {
  getNetflixMerchantSigner,
  getSpotifyMerchantSigner,
} from "@/lib/solana/server-signers";

export const runtime = "nodejs";

/**
 * POST /api/pull  { serviceId: "spotify" | "netflix", subscriber: string }
 *
 * Simulates a billing cycle: the merchant (server-signed) pulls one period's payment from the
 * subscriber's active SubscriptionDelegation. This is exactly what a real merchant's billing
 * cron would call on a timer — here it's exposed as a button so the recurring payment is
 * actually observable instead of waiting 30 days.
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
    const plan = await getPlan(merchant.kit.address, service.planId);
    if (!plan) {
      return NextResponse.json(
        { error: `${service.name} plan not found on-chain. Run \`npm run bootstrap\`.` },
        { status: 404 },
      );
    }

    const amount = plan.data.data.terms.amount;
    const ix = await buildPullPaymentInstruction({
      merchantSigner: merchant.kit,
      subscriber: address(subscriber),
      planId: service.planId,
      tokenMint,
      amount,
    });

    const signature = await sendInstructions(merchant.kit, [ix]);

    return NextResponse.json({
      signature,
      amount: Number(amount) / 10 ** USDC_DECIMALS,
    });
  } catch (error) {
    console.error("[/api/pull]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pulling payment failed." },
      { status: 500 },
    );
  }
}
