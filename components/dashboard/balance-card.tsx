"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink, Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useUsdcBalance } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";

const MIN_SOL = 0.005;

export function BalanceCard() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { balance: usdcBalance, loading: usdcLoading } = useUsdcBalance();
  const refreshKey = useAppStore((s) => s.refreshKey);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) { setSolBalance(null); return; }
    let cancelled = false;
    connection.getBalance(publicKey, "confirmed")
      .then((l) => { if (!cancelled) setSolBalance(l / 1e9); })
      .catch(() => { if (!cancelled) setSolBalance(null); });
    return () => { cancelled = true; };
  }, [connection, publicKey, refreshKey]);

  const solTooLow = publicKey && solBalance !== null && solBalance < MIN_SOL;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Balances */}
        <div className="flex items-center gap-6">
          {/* USDC */}
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              USDC Balance
            </p>
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {!publicKey ? (
                <span className="text-muted-foreground">—</span>
              ) : usdcLoading && usdcBalance === null ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                `$${(usdcBalance ?? 0).toFixed(2)}`
              )}
            </p>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-border" />

          {/* SOL */}
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              SOL Balance
            </p>
            <p className={`text-xl font-semibold tabular-nums ${solTooLow ? "text-amber-600" : "text-foreground"}`}>
              {!publicKey ? (
                <span className="text-muted-foreground">—</span>
              ) : solBalance === null ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                `◎ ${solBalance.toFixed(4)}`
              )}
            </p>
          </div>
        </div>

        {/* Faucet buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
            onClick={() => window.open("https://faucet.circle.com", "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Get USDC
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
            onClick={() => window.open("https://faucet.solana.com", "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Get SOL
          </Button>
        </div>
      </div>

      {/* SOL warning */}
      {solTooLow && (
        <div className="flex items-start gap-2.5 border-t border-amber-100 bg-amber-50 px-6 py-3 text-sm text-amber-700 rounded-b-2xl">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span>
            You need at least {MIN_SOL} SOL for subscription account rent.{" "}
            <button
              className="font-medium underline underline-offset-2"
              onClick={() => window.open("https://faucet.solana.com", "_blank")}
            >
              Get devnet SOL →
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
