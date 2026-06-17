"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useMySubscriptions } from "@/lib/hooks";

import { SubscriptionItem } from "./subscription-item";

export function SubscriptionList() {
  const { publicKey } = useWallet();
  const { subscriptions, loading } = useMySubscriptions();

  if (!publicKey) {
    return (
      <Card className="border-dashed border-border/60 bg-transparent">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Connect a wallet to see your subscriptions.
        </CardContent>
      </Card>
    );
  }

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading subscriptions...
      </div>
    );
  }

  if (subscriptions.length === 0) {
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
      {subscriptions.map((sub) => (
        <SubscriptionItem key={sub.address} subscription={sub} />
      ))}
    </div>
  );
}
