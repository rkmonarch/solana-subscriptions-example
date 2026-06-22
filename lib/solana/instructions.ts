/**
 * Pure instruction builders on top of the official `@solana/subscriptions` overlay functions.
 * Each one returns a Kit `Instruction` — nothing here signs or sends anything.
 *
 * For browser-initiated instructions (init/subscribe/cancel/resume) the "actor" signer is a
 * `createNoopSigner`: we only need its `.address` to build correct account metas, since signing
 * actually happens later via the connected wallet (see `legacy-bridge.ts` + `actions.ts`).
 * `buildPullPaymentInstruction` is the one exception — it runs server-side with a *real* merchant
 * `KeyPairSigner`, since pulling a payment is the merchant's action, not the subscriber's.
 */
import {
  findPlanPda,
  findSubscriptionDelegationPda,
  getCancelSubscriptionOverlayInstructionAsync,
  getInitSubscriptionAuthorityOverlayInstructionAsync,
  getResumeSubscriptionOverlayInstructionAsync,
  getSubscribeOverlayInstructionAsync,
  getTransferSubscriptionOverlayInstructionAsync,
} from "@solana/subscriptions";
import {
  createNoopSigner,
  type Address,
  type Instruction,
  type TransactionSigner,
} from "@solana/kit";

import { TOKEN_PROGRAM_ADDRESS } from "./constants";
import type { PlanRecord } from "./queries";
import { deriveAta } from "./token";

/** One-time per (user, mint) setup. Must land before the user's first subscription on that mint. */
export async function buildInitSubscriptionAuthorityInstruction(
  subscriber: Address,
  tokenMint: Address,
): Promise<Instruction> {
  return getInitSubscriptionAuthorityOverlayInstructionAsync({
    owner: createNoopSigner(subscriber),
    tokenMint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
    userAta: deriveAta(subscriber, tokenMint),
  });
}

export async function buildSubscribeInstruction(params: {
  subscriber: Address;
  merchant: Address;
  planId: bigint;
  tokenMint: Address;
  plan: PlanRecord;
  authorityInitId: bigint;
}): Promise<Instruction> {
  const { subscriber, merchant, planId, tokenMint, plan, authorityInitId } = params;
  // `plan.data` is the on-chain `Plan` account; `plan.data.data` is its nested `PlanData` —
  // the program's own naming, not a typo.
  const terms = plan.data.data.terms;
  return getSubscribeOverlayInstructionAsync({
    merchant,
    planId,
    tokenMint,
    subscriber: createNoopSigner(subscriber),
    expectedAmount: terms.amount,
    expectedPeriodHours: terms.periodHours,
    expectedCreatedAt: terms.createdAt,
    expectedSubscriptionAuthorityInitId: authorityInitId,
  });
}

export async function buildCancelSubscriptionInstruction(
  subscriber: Address,
  merchant: Address,
  planId: bigint,
  explicitPlanPda?: Address, // use when cancelling old subscriptions whose planId differs from current config
): Promise<Instruction> {
  const planPda = explicitPlanPda ?? (await findPlanPda({ owner: merchant, planId }))[0];
  return getCancelSubscriptionOverlayInstructionAsync({
    planPda,
    subscriber: createNoopSigner(subscriber),
  });
}

export async function buildResumeSubscriptionInstruction(
  subscriber: Address,
  merchant: Address,
  planId: bigint,
  explicitPlanPda?: Address,
): Promise<Instruction> {
  const planPda = explicitPlanPda ?? (await findPlanPda({ owner: merchant, planId }))[0];
  return getResumeSubscriptionOverlayInstructionAsync({
    planPda,
    subscriber: createNoopSigner(subscriber),
  });
}

/** Server-side only: the merchant pulls one billing period's payment from the subscriber. */
export async function buildPullPaymentInstruction(params: {
  merchantSigner: TransactionSigner;
  subscriber: Address;
  planId: bigint;
  tokenMint: Address;
  amount: bigint;
}): Promise<Instruction> {
  const { merchantSigner, subscriber, planId, tokenMint, amount } = params;
  const [planPda] = await findPlanPda({ owner: merchantSigner.address, planId });
  const [subscriptionPda] = await findSubscriptionDelegationPda({ planPda, subscriber });
  return buildPullPaymentInstructionWithPda({
    merchantSigner, subscriber, subscriptionPda, planPda, tokenMint, amount,
  });
}

/**
 * Like buildPullPaymentInstruction but accepts explicit PDAs — used by the API route when
 * the subscription may exist under a different planId than the current service config, so we
 * pass the located subscriptionPda + the CURRENT plan's planPda (for correct destinations).
 */
export async function buildPullPaymentInstructionWithPda(params: {
  merchantSigner: TransactionSigner;
  subscriber: Address;
  subscriptionPda: Address;
  planPda: Address;
  tokenMint: Address;
  amount: bigint;
}): Promise<Instruction> {
  const { merchantSigner, subscriber, subscriptionPda, planPda, tokenMint, amount } = params;
  return getTransferSubscriptionOverlayInstructionAsync({
    amount,
    caller: merchantSigner,
    delegator: subscriber,
    planPda,
    receiverAta: deriveAta(merchantSigner.address, tokenMint),
    subscriptionPda,
    tokenMint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
}
