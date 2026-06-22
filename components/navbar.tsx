"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CLUSTER } from "@/lib/solana/constants";

const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false },
);

export function Navbar() {
  const pathname = usePathname();
  const isMerchant = pathname === "/merchant";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Subscriptions MVP</p>
            <p className="text-xs text-muted-foreground">Solana devnet</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="hidden border-violet-200 bg-violet-50 text-violet-700 capitalize sm:inline-flex"
          >
            {CLUSTER}
          </Badge>

          <Link
            href={isMerchant ? "/" : "/merchant"}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Store className="h-3.5 w-3.5" />
            {isMerchant ? "Subscriber view" : "Merchant"}
          </Link>

          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
