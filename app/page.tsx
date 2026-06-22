"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowRight } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { PlanCard } from "@/components/dashboard/plan-card";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { Navbar } from "@/components/navbar";
import { useServiceSubscriptions } from "@/lib/hooks";
import { SERVICES } from "@/lib/solana";

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { serviceSubscriptions } = useServiceSubscriptions();

  const isSubscribedMap = Object.fromEntries(
    serviceSubscriptions.map((ss) => [
      ss.service.id,
      ss.data !== null && ss.data.expiresAtTs === 0n && ss.isCurrentPlan,
    ]),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6">

        {/* Hero */}
        <section className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Live on Solana devnet — real transactions
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            On-chain subscriptions
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Subscribe to Spotify and Netflix with{" "}
            <span className="font-medium text-foreground">Circle devnet USDC</span>.
            One token account, two independent recurring delegations — powered by the official{" "}
            <a
              href="https://github.com/solana-program/subscriptions"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-600 hover:underline"
            >
              Solana Subscriptions Program ↗
            </a>
            .
          </p>
        </section>

        {/* Connect prompt */}
        {!publicKey && (
          <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100">
              <ArrowRight className="h-4 w-4 text-violet-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-violet-900">Connect your devnet wallet to get started</p>
              <p className="text-violet-700">
                Then get USDC at{" "}
                <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  faucet.circle.com
                </a>{" "}
                and SOL at{" "}
                <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  faucet.solana.com
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Balance */}
        <BalanceCard />

        {/* Plans */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Available plans</h2>
            <span className="text-sm text-muted-foreground">Billed in USDC · Cancel anytime</span>
          </div>
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

        {/* My Subscriptions */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground">My subscriptions</h2>
          <SubscriptionList />
        </section>

        {/* Activity */}
        <ActivityFeed />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Demo only — devnet &amp; test tokens · Not affiliated with Spotify or Netflix
      </footer>
    </div>
  );
}
