"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { CreditCard, Loader2 } from "lucide-react";

import { useServiceSubscriptions } from "@/lib/hooks";

import { SubscriptionItem } from "./subscription-item";

export function SubscriptionList() {
  const { publicKey } = useWallet();
  const { serviceSubscriptions, loading } = useServiceSubscriptions();

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">No wallet connected</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Connect your wallet to view subscriptions.</p>
        </div>
      </div>
    );
  }

  if (loading && serviceSubscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading subscriptions…
      </div>
    );
  }

  const active = serviceSubscriptions.filter(
    (s) => s.data !== null && s.data.expiresAtTs === 0n,
  );

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">No active subscriptions</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Subscribe to Spotify or Netflix above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {active.map((sub) => (
        <SubscriptionItem key={sub.subscriptionPda} serviceSub={sub} />
      ))}
    </div>
  );
}
