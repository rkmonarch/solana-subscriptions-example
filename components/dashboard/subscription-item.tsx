"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { Loader2, PlayCircle, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  USDC_DECIMALS,
  cancelService,
  findServiceByOwner,
  resumeService,
  type SubscriptionRecord,
} from "@/lib/solana";
import { useAppStore } from "@/lib/store";

interface SubscriptionItemProps {
  subscription: SubscriptionRecord;
}

type Busy = "cancel" | "resume" | "pull" | null;

export function SubscriptionItem({ subscription }: SubscriptionItemProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [busy, setBusy] = useState<Busy>(null);
  const refresh = useAppStore((s) => s.refresh);
  const logActivity = useAppStore((s) => s.logActivity);

  const { header, terms, currentPeriodStartTs, expiresAtTs, amountPulledInPeriod } =
    subscription.data;
  const service = findServiceByOwner(header.delegatee);

  // The decoded account doesn't expose an explicit "cancelled" flag, so we infer it from
  // `expiresAtTs`: an active/perpetual subscription's expiry is 0 (no expiry) or in the future.
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const isCancelled = expiresAtTs !== 0n && expiresAtTs <= nowSeconds;

  const periodDays = Number(terms.periodHours / 24n);
  const nextBillingDate = new Date(
    Number(currentPeriodStartTs + terms.periodHours * 3600n) * 1000,
  );
  const amountUi = Number(terms.amount) / 10 ** USDC_DECIMALS;
  const pulledUi = Number(amountPulledInPeriod) / 10 ** USDC_DECIMALS;

  async function handleCancel() {
    if (!service) return;
    setBusy("cancel");
    try {
      const signature = await cancelService(connection, wallet, service);
      logActivity(`Cancelled ${service.name}`, signature);
      toast.success(`Cancelled ${service.name}.`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cancel failed.");
    } finally {
      setBusy(null);
    }
  }

  async function handleResume() {
    if (!service) return;
    setBusy("resume");
    try {
      const signature = await resumeService(connection, wallet, service);
      logActivity(`Resumed ${service.name}`, signature);
      toast.success(`Resumed ${service.name}.`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Resume failed.");
    } finally {
      setBusy(null);
    }
  }

  async function handlePull() {
    if (!service || !wallet.publicKey) return;
    setBusy("pull");
    try {
      const response = await fetch("/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, subscriber: wallet.publicKey.toBase58() }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Simulated billing failed.");
      logActivity(`${service.name} pulled $${json.amount}`, json.signature);
      toast.success(`${service.name} pulled $${json.amount} USDC (simulated billing cycle).`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Simulated billing failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: service?.color ?? "#888" }}
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{service?.name ?? "Unknown merchant"}</p>
              <Badge variant={isCancelled ? "outline" : "default"}>
                {isCancelled ? "Cancelled" : "Active"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              ${amountUi} / {periodDays}d &middot; pulled ${pulledUi.toFixed(2)} this period
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Next billing ~ {format(nextBillingDate, "MMM d, yyyy")}
          </span>
          <Button size="sm" variant="secondary" disabled={busy !== null} onClick={handlePull}>
            {busy === "pull" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            Simulate billing
          </Button>
          {isCancelled ? (
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={handleResume}>
              {busy === "resume" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <PlayCircle className="h-3.5 w-3.5" />
              )}
              Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={handleCancel}>
              {busy === "cancel" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
