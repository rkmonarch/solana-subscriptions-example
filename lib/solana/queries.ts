/**
 * Read-only helpers for plan/authority/subscription state. All reads go through the single
 * shared Kit RPC client from `rpc.ts`.
 */
import {
  fetchMaybeSubscriptionAuthority,
  fetchMaybePlan,
  fetchSubscriptionsForUser,
  fetchDelegationsByDelegatee,
  findPlanPda,
  findSubscriptionAuthorityPda,
  type Delegation,
  type Plan,
  type SubscriptionAuthority,
  type SubscriptionDelegation,
} from "@solana/subscriptions";
import type { Address } from "@solana/kit";

import { getRpc } from "./rpc";

export interface PlanRecord {
  address: Address;
  data: Plan;
}

export interface SubscriptionRecord {
  address: Address;
  data: SubscriptionDelegation;
}

/** Fetches a merchant's live plan terms straight from chain (or `null` if it hasn't been created yet). */
export async function getPlan(
  owner: Address,
  planId: bigint,
): Promise<PlanRecord | null> {
  const [planPda] = await findPlanPda({ owner, planId });
  const account = await fetchMaybePlan(getRpc(), planPda);
  if (!account.exists) return null;
  return { address: account.address, data: account.data };
}

/** Fetches the user's SubscriptionAuthority for a given mint, the shared account every one of
 * their delegations (Spotify, Netflix, ...) hangs off of. `null` if never initialized. */
export async function getSubscriptionAuthority(
  user: Address,
  tokenMint: Address,
): Promise<SubscriptionAuthority | null> {
  const [authorityPda] = await findSubscriptionAuthorityPda({ user, tokenMint });
  const account = await fetchMaybeSubscriptionAuthority(getRpc(), authorityPda);
  return account.exists ? account.data : null;
}

/** All of a user's active/cancelled subscription delegations, across every merchant. */
export async function getUserSubscriptions(
  user: Address,
): Promise<SubscriptionRecord[]> {
  return fetchSubscriptionsForUser(getRpc(), user);
}

export type { Delegation };

/**
 * All delegations where `merchant` is the delegatee — i.e., every subscriber that has
 * granted this merchant permission to pull payments. Filters to subscription-kind only.
 */
export async function getMerchantSubscriptions(
  merchant: Address,
): Promise<Array<{ address: Address; data: SubscriptionDelegation; subscriber: Address }>> {
  const all: Delegation[] = await fetchDelegationsByDelegatee(getRpc(), merchant);
  return all
    .filter((d): d is Extract<Delegation, { kind: "subscription" }> => d.kind === "subscription")
    .map((d) => ({
      address: d.address,
      data: d.data,
      subscriber: d.data.header.delegator,
    }));
}
