"use client";

/**
 * Small client-side data hooks. No React Query here on purpose — the app's data needs are
 * simple enough that a `useEffect` + the shared `refreshKey` signal (bumped after every
 * transaction, see `lib/store.ts`) keeps things easy to follow.
 */
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { address } from "@solana/kit";
import { useCallback, useEffect, useState } from "react";

import {
  getPlan,
  getServiceOwner,
  getTokenBalance,
  getUsdcMint,
  getUserSubscriptions,
  type PlanRecord,
  type ServiceConfig,
  type SubscriptionRecord,
} from "@/lib/solana";
import { useAppStore } from "@/lib/store";

export function useUsdcBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const refreshKey = useAppStore((s) => s.refreshKey);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const mint = getUsdcMint();
        const value = await getTokenBalance(connection, address(publicKey.toBase58()), mint);
        if (!cancelled) setBalance(value);
      } catch {
        if (!cancelled) setBalance(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connection, publicKey, refreshKey]);

  return { balance, loading };
}

export function usePlan(service: ServiceConfig) {
  const refreshKey = useAppStore((s) => s.refreshKey);
  const [plan, setPlan] = useState<PlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const owner = getServiceOwner(service);
        const result = await getPlan(owner, service.planId);
        if (!cancelled) setPlan(result);
      } catch (err) {
        if (!cancelled) {
          setPlan(null);
          setError(err instanceof Error ? err.message : "Failed to load plan.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [service, refreshKey]);

  return { plan, loading, error };
}

export function useMySubscriptions() {
  const { publicKey } = useWallet();
  const refreshKey = useAppStore((s) => s.refreshKey);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!publicKey) {
      setSubscriptions([]);
      return;
    }
    setLoading(true);
    try {
      const subs = await getUserSubscriptions(address(publicKey.toBase58()));
      setSubscriptions(subs);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    refetch();
  }, [refetch, refreshKey]);

  return { subscriptions, loading, refetch };
}
