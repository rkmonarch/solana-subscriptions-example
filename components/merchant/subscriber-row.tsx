"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { explorerTxUrl, USDC_DECIMALS, type ServiceConfig } from "@/lib/solana";
import type { SubscriptionDelegation } from "@solana/subscriptions";
import type { Address } from "@solana/kit";

interface SubscriberRowProps {
  address: Address;
  subscriber: Address;
  data: SubscriptionDelegation;
  service: ServiceConfig;
  onCollected: () => void;
}

export function SubscriberRow({ subscriber, data, service, onCollected }: SubscriberRowProps) {
  const [busy, setBusy] = useState(false);

  const { terms, currentPeriodStartTs, expiresAtTs, amountPulledInPeriod } = data;
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));

  const isCancelled = expiresAtTs !== 0n && expiresAtTs <= nowSeconds;
  const periodSeconds = terms.periodHours * 3600n;
  const periodEndTs = currentPeriodStartTs + periodSeconds;
  const periodEnded = periodEndTs <= nowSeconds;

  // Can collect if: not cancelled, full amount not yet pulled this period, or period has reset
  const alreadyCollectedThisPeriod = amountPulledInPeriod >= terms.amount && !periodEnded;
  const canCollect = !isCancelled && !alreadyCollectedThisPeriod;

  const amountOwed = terms.amount - amountPulledInPeriod;
  const amountOwedUi = Math.max(0, Number(amountOwed) / 10 ** USDC_DECIMALS);
  const totalUi = Number(terms.amount) / 10 ** USDC_DECIMALS;
  const pulledUi = Number(amountPulledInPeriod) / 10 ** USDC_DECIMALS;
  const nextPeriodDate = new Date(Number(periodEndTs) * 1000);

  async function collect() {
    setBusy(true);
    try {
      const res = await fetch("/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, subscriber }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Collection failed.");
      toast.success(`Collected $${json.amount} USDC from ${subscriber.slice(0, 6)}...`, {
        action: {
          label: "View tx",
          onClick: () => window.open(explorerTxUrl(json.signature), "_blank"),
        },
      });
      onCollected();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Collection failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <TableRow>
      {/* Subscriber address */}
      <TableCell className="font-mono text-xs">
        <a
          href={`https://solscan.io/account/${subscriber}?cluster=devnet`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          {subscriber.slice(0, 8)}...{subscriber.slice(-6)}
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </a>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={isCancelled ? "outline" : canCollect ? "default" : "secondary"}
          className={
            isCancelled
              ? "border-muted-foreground/40 text-muted-foreground"
              : canCollect
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                : ""
          }
        >
          {isCancelled ? "Cancelled" : canCollect ? "Collectable" : "Collected"}
        </Badge>
      </TableCell>

      {/* Period progress */}
      <TableCell className="text-sm tabular-nums">
        <span className="text-foreground">${pulledUi.toFixed(2)}</span>
        <span className="text-muted-foreground"> / ${totalUi.toFixed(2)}</span>
      </TableCell>

      {/* Next period */}
      <TableCell className="text-xs text-muted-foreground">
        {isCancelled ? "—" : format(nextPeriodDate, "MMM d, yyyy")}
        {!isCancelled && periodEnded && (
          <span className="ml-1 text-amber-400">(period reset)</span>
        )}
      </TableCell>

      {/* Collect button */}
      <TableCell className="text-right">
        <Button
          size="sm"
          disabled={!canCollect || busy}
          onClick={collect}
          style={
            canCollect
              ? { backgroundColor: service.color, color: "#fff", borderColor: service.color }
              : {}
          }
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          {canCollect ? `Collect $${amountOwedUi.toFixed(2)}` : "Collected"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
