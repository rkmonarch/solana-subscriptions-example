/**
 * Read-only helpers for plan/authority/subscription state. All reads go through the single
 * shared Kit RPC client from `rpc.ts`.
 */
import {
  fetchMaybeSubscriptionAuthority,
  fetchMaybePlan,
  fetchMaybeSubscriptionDelegation,
  fetchSubscriptionsForUser,
  findPlanPda,
  findSubscriptionAuthorityPda,
  findSubscriptionDelegationPda,
  type Delegation,
  type Plan,
  type SubscriptionAuthority,
  type SubscriptionDelegation,
} from "@solana/subscriptions";
import type { Address } from "@solana/kit";

import { getRpc } from "./rpc";
import { SERVICES, getServiceOwner, type ServiceConfig } from "./constants";

export interface PlanRecord {
  address: Address;
  data: Plan;
}

export interface SubscriptionRecord {
  address: Address;
  data: SubscriptionDelegation;
}

/** Per-service subscription snapshot: what plan the user is on, their delegation state. */
export interface ServiceSubscription {
  service: ServiceConfig;
  /** PDA address of the SubscriptionDelegation account. */
  subscriptionPda: Address;
  /** PDA address of the Plan account (may be from an old planId if subscription was migrated). */
  planPda: Address;
  /**
   * True when the subscription's planPda matches the service's current planId.
   * False for legacy subscriptions created under a previous planId (e.g. planId=2 when
   * current config is planId=3). A false value means the Subscribe button should be
   * enabled so the user can create a fresh subscription at the current planId.
   */
  isCurrentPlan: boolean;
  /** Live delegation data — null means not subscribed to any plan variant. */
  data: SubscriptionDelegation | null;
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

/** Fetches the user's SubscriptionAuthority for a given mint. `null` if never initialized. */
export async function getSubscriptionAuthority(
  user: Address,
  tokenMint: Address,
): Promise<SubscriptionAuthority | null> {
  const [authorityPda] = await findSubscriptionAuthorityPda({ user, tokenMint });
  const account = await fetchMaybeSubscriptionAuthority(getRpc(), authorityPda);
  return account.exists ? account.data : null;
}

/**
 * Fetches ALL SubscriptionDelegation accounts where `user` is the delegator (subscriber),
 * querying by the delegator field at DELEGATOR_OFFSET. This is the canonical SDK function
 * for "show me everything this wallet has subscribed to" — it works regardless of planId or
 * merchant address, useful for diagnostics and cross-checking subscription state.
 *
 * Note: returned records don't include service info (name/colour) — use `getServiceSubscriptions`
 * for a service-matched, UI-ready result.
 */
export async function getAllUserSubscriptions(
  user: Address,
): Promise<SubscriptionRecord[]> {
  return fetchSubscriptionsForUser(getRpc(), user);
}

/**
 * For each known service (Spotify, Netflix), derives the expected SubscriptionDelegation PDA
 * for `subscriber` and fetches it. Returns one entry per service — `data` is null when not
 * subscribed. Uses PDA derivation (not `header.delegatee`) because the program stores planPda
 * there, not the merchant's wallet address.
 *
 * Also cross-references against `fetchSubscriptionsForUser` so that any subscription whose
 * terms match a known plan (matched by amount) is caught even if the planId doesn't match
 * our current SERVICES config (e.g. if the user subscribed before a planId bump).
 */
export async function getServiceSubscriptions(
  subscriber: Address,
): Promise<ServiceSubscription[]> {
  // Fetch ALL on-chain subscriptions for this user — catches any planId variant.
  const allSubs = await fetchSubscriptionsForUser(getRpc(), subscriber).catch(() => [] as SubscriptionRecord[]);

  const results = await Promise.all(
    SERVICES.map(async (service): Promise<ServiceSubscription> => {
      const fallback: ServiceSubscription = {
        service,
        subscriptionPda: "11111111111111111111111111111111" as Address,
        planPda: "11111111111111111111111111111111" as Address,
        isCurrentPlan: true,
        data: null,
      };

      try {
        const merchant = getServiceOwner(service);
        const [planPda] = await findPlanPda({ owner: merchant, planId: service.planId });
        const [subscriptionPda] = await findSubscriptionDelegationPda({ planPda, subscriber });
        const account = await fetchMaybeSubscriptionDelegation(getRpc(), subscriptionPda);

        if (account.exists) {
          return { service, subscriptionPda, planPda, isCurrentPlan: true, data: account.data };
        }

        // PDA not found for current planId — scan allSubs by matching plan amount as fallback.
        const priceBase = BigInt(service.priceUsdc) * 10n ** 6n;
        const fallbackSub = allSubs.find((s) => s.data.terms.amount === priceBase);
        if (fallbackSub) {
          const actualPlanPda = fallbackSub.data.header.delegatee;
          // isCurrentPlan=false: this subscription belongs to an older planId. The Subscribe
          // button remains enabled so the user can create a fresh subscription at planId=3.
          return { service, subscriptionPda: fallbackSub.address, planPda: actualPlanPda, isCurrentPlan: false, data: fallbackSub.data };
        }

        return { service, subscriptionPda, planPda, isCurrentPlan: true, data: null };
      } catch {
        return fallback;
      }
    }),
  );

  return results;
}

export type { Delegation };

/**
 * All subscriptions to a specific plan, found by querying on-chain via the planPda as the
 * delegatee filter. The Subscriptions program stores `planPda` (not merchant wallet) in
 * `header.delegatee` of each SubscriptionDelegation account.
 */
export async function getMerchantSubscriptions(
  service: ServiceConfig,
): Promise<Array<{ address: Address; data: SubscriptionDelegation; subscriber: Address }>> {
  const rpc = getRpc();
  const merchant = getServiceOwner(service);
  const [planPda] = await findPlanPda({ owner: merchant, planId: service.planId });

  // The program stores planPda in header.delegatee — so we query by planPda, not merchant wallet.
  const { fetchDelegationsByDelegatee } = await import("@solana/subscriptions");
  const all: Delegation[] = await fetchDelegationsByDelegatee(rpc, planPda);
  return all
    .filter((d): d is Extract<Delegation, { kind: "subscription" }> => d.kind === "subscription")
    .map((d) => ({
      address: d.address,
      data: d.data,
      subscriber: d.data.header.delegator,
    }));
}
