"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { address, type Address } from "@solana/kit";
import { getTokenBalance, getUsdcMint, USDC_DECIMALS } from "@/lib/solana";

interface MerchantBalanceProps {
  merchantAddress: Address;
  label: string;
  color: string;
  refreshKey: number;
}

export function MerchantBalance({ merchantAddress, label, color, refreshKey }: MerchantBalanceProps) {
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTokenBalance(connection, merchantAddress, getUsdcMint())
      .then((b) => { if (!cancelled) setBalance(b); })
      .catch(() => { if (!cancelled) setBalance(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [connection, merchantAddress, refreshKey]);

  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}22`, color }}
        >
          <Wallet className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label} USDC collected</p>
          <p className="text-xl font-semibold tabular-nums">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `$${(balance ?? 0).toFixed(2)}`
            )}
          </p>
        </div>
        <p className="ml-auto font-mono text-xs text-muted-foreground">
          {merchantAddress.slice(0, 6)}...{merchantAddress.slice(-4)}
        </p>
      </CardContent>
    </Card>
  );
}
