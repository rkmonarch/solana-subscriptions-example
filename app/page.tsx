"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { PlanCard } from "@/components/dashboard/plan-card";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { Navbar } from "@/components/navbar";
import { useServiceSubscriptions } from "@/lib/hooks";
import { SERVICES } from "@/lib/solana";

export default function DashboardPage() {
  const { publicKey } = useWallet();
  // Keyed by service.id, true if the user has an active (non-cancelled) subscription.
  const { serviceSubscriptions } = useServiceSubscriptions();

  // Active = subscription exists AND has not been cancelled.
  // expiresAtTs === 0n means perpetual/active; any non-zero value means the user cancelled
  // (the program sets it to the period-end timestamp, not 0, when cancelled).
  const isSubscribedMap = Object.fromEntries(
    serviceSubscriptions.map((ss) => [
      ss.service.id,
      // Only treat as "subscribed" when on the CURRENT planId. An active subscription on an
      // old planId (isCurrentPlan=false) still allows the user to subscribe to the new planId.
      ss.data !== null && ss.data.expiresAtTs === 0n && ss.isCurrentPlan,
    ]),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Subscribe to Spotify &amp; Netflix — on-chain
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            One USDC token account, two independent recurring delegations. This MVP runs against
            the real, official{" "}
            <a
              className="underline underline-offset-4 hover:text-foreground"
              href="https://github.com/solana-program/subscriptions"
              target="_blank"
              rel="noreferrer"
            >
              Solana Subscriptions Program
            </a>{" "}
            on devnet — no mocks.
          </p>
        </section>

        {!publicKey && (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            Connect a devnet wallet (top right). Get devnet USDC at{" "}
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              faucet.circle.com
            </a>{" "}
            then subscribe.
          </div>
        )}

        <BalanceCard />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Available plans</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <PlanCard
                key={service.id}
                service={service}
                isSubscribed={!!isSubscribedMap[service.id]}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">My subscriptions</h2>
          <SubscriptionList />
        </section>

        <ActivityFeed />
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Demo only — devnet &amp; test tokens. Not affiliated with Spotify or Netflix.
      </footer>
    </div>
  );
}
