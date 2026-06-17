"use client";

import dynamic from "next/dynamic";
import { Radio } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CLUSTER } from "@/lib/solana/constants";

/**
 * Dynamically imported with ssr:false so that WalletMultiButton never renders server-side.
 * The wallet button relies on browser-only APIs (window.solana, Wallet Standard registry) and
 * causes a hydration mismatch when SSR-rendered because next-themes also mutates the <html>
 * className client-side — together they can prevent React from re-attaching event handlers,
 * making the button appear unresponsive. ssr:false sidesteps both issues cleanly.
 */
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false },
);

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Subscriptions MVP</p>
            <p className="text-xs text-muted-foreground">Solana Subscriptions Program demo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden capitalize sm:inline-flex">
            {CLUSTER}
          </Badge>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
