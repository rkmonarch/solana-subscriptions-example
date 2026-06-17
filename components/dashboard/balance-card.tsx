"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink, Loader2, TriangleAlert, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUsdcBalance } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";

/** Minimum devnet SOL needed to pay rent for SubscriptionAuthority + SubscriptionDelegation PDAs. */
const MIN_SOL = 0.005; // 5,000,000 lamports — comfortable buffer above the ~3M actually needed

export function BalanceCard() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { balance: usdcBalance, loading: usdcLoading } = useUsdcBalance();
  const refreshKey = useAppStore((s) => s.refreshKey);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!publicKey) { setSolBalance(null); return; }
    let cancelled = false;
    connection.getBalance(publicKey, "confirmed").then((lamports) => {
      if (!cancelled) setSolBalance(lamports / 1e9);
    }).catch(() => {
      if (!cancelled) setSolBalance(null);
    });
    return () => { cancelled = true; };
  }, [connection, publicKey, refreshKey]);

  const solTooLow = publicKey && solBalance !== null && solBalance < MIN_SOL;

  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-4 p-5">
        {/* Balances row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">USDC (devnet)</p>
                  <p className="text-2xl font-semibold tabular-nums">
                    {!publicKey ? "—" : usdcLoading && usdcBalance === null
                      ? <Loader2 className="h-5 w-5 animate-spin" />
                      : `$${(usdcBalance ?? 0).toFixed(2)}`}
                  </p>
                </div>
                <div className="border-l border-border/60 pl-4">
                  <p className="text-xs text-muted-foreground">SOL (devnet)</p>
                  <p className={`text-xl font-semibold tabular-nums ${solTooLow ? "text-amber-400" : ""}`}>
                    {!publicKey ? "—" : solBalance === null
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : `◎${solBalance.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open("https://faucet.circle.com", "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get USDC
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open("https://faucet.solana.com", "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get SOL
            </Button>
          </div>
        </div>

        {/* SOL warning — subscribers need SOL to pay for on-chain account rent */}
        {solTooLow && (
          <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-sm text-amber-400">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              You need at least {MIN_SOL} SOL to subscribe (for on-chain account rent). Current
              balance: {solBalance!.toFixed(6)} SOL.{" "}
              <button
                className="underline underline-offset-2"
                onClick={() => window.open("https://faucet.solana.com", "_blank")}
              >
                Get devnet SOL →
              </button>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
