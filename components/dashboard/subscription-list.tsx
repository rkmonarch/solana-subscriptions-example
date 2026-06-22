"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useServiceSubscriptions } from "@/lib/hooks";

import { SubscriptionItem } from "./subscription-item";

export function SubscriptionList() {
  const { publicKey } = useWallet();
  const { serviceSubscriptions, loading } = useServiceSubscriptions();

  if (!publicKey) {
    return (
      <Card className="border-dashed border-border/60 bg-transparent">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Connect a wallet to see your subscriptions.
        </CardContent>
      </Card>
    );
  }

  if (loading && serviceSubscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading subscriptions...
      </div>
    );
  }

  // Show only active (non-cancelled) subscriptions. Cancelled ones (expiresAtTs !== 0n) are
  // hidden immediately via the SubscriptionItem's optimistic `dismissed` state, and fully gone
  // after the background re-fetch completes.
  const active = serviceSubscriptions.filter(
    (s) => s.data !== null && s.data.expiresAtTs === 0n,
  );

  if (active.length === 0) {
    return (
      <Card className="border-dashed border-border/60 bg-transparent">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No subscriptions yet — subscribe to a service above to get started.
        </CardContent>
      </Card>
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
