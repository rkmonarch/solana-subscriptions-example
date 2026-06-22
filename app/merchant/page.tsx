"use client";

import Link from "next/link";
import { useState } from "react";

import { MerchantBalance } from "@/components/merchant/merchant-balance";
import { SubscriberList } from "@/components/merchant/subscriber-list";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SERVICES, getServiceOwner } from "@/lib/solana";

export default function MerchantPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        {/* Header */}
        <section className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold sm:text-3xl">Merchant Dashboard</h1>
            <Link
              href="/"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              ← Subscriber view
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            View subscribers and collect USDC payments from active subscriptions.
          </p>
        </section>

        {/* Merchant USDC balances */}
        <section className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((service) => {
            let merchantAddress: ReturnType<typeof getServiceOwner> | null = null;
            try {
              merchantAddress = getServiceOwner(service);
            } catch {
              return null;
            }
            return (
              <MerchantBalance
                key={service.id}
                merchantAddress={merchantAddress}
                label={service.name}
                color={service.color}
                refreshKey={refreshKey}
              />
            );
          })}
        </section>

        {/* Per-service subscriber lists */}
        <Tabs defaultValue="spotify">
          <TabsList className="mb-4">
            {SERVICES.map((service) => (
              <TabsTrigger key={service.id} value={service.id} className="gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                {service.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {SERVICES.map((service) => (
            <TabsContent key={service.id} value={service.id}>
              <SubscriberList
                service={service}
                refreshKey={refreshKey}
                onRefresh={refresh}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Merchant dashboard — server-signed payment collection via{" "}
        <code className="rounded bg-muted px-1 py-0.5">transferSubscription</code>
      </footer>
    </div>
  );
}
