"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { CheckCircle2, Loader2, PlayCircle, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cancelService, resumeService, USDC_DECIMALS, type ServiceSubscription } from "@/lib/solana";
import { useAppStore } from "@/lib/store";

interface SubscriptionItemProps {
  serviceSub: ServiceSubscription;
}

type Busy = "cancel" | "resume" | "pull" | null;

export function SubscriptionItem({ serviceSub }: SubscriptionItemProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [busy, setBusy] = useState<Busy>(null);
  // Optimistic cancel: hide this card the instant the on-chain tx confirms, before
  // the background re-fetch completes. Avoids the "still showing after cancel" lag.
  const [dismissed, setDismissed] = useState(false);
  const refresh = useAppStore((s) => s.refresh);
  const logActivity = useAppStore((s) => s.logActivity);

  const { service, data } = serviceSub;
  if (!data || dismissed) return null;

  const { terms, currentPeriodStartTs, expiresAtTs, amountPulledInPeriod } = data;

  // The Subscriptions program sets expiresAtTs to the end of the current billing period when
  // you cancel (not to 0 or to "now"). Any non-zero expiresAtTs = subscription is cancelled.
  // A perpetual active subscription always has expiresAtTs === 0n.
  const isCancelled = expiresAtTs !== 0n;

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const periodSeconds = terms.periodHours * 3600n;
  const periodEndTs = currentPeriodStartTs + periodSeconds;
  const nextBillingDate = new Date(Number(periodEndTs) * 1000);
  const amountUi = Number(terms.amount) / 10 ** USDC_DECIMALS;
  const pulledUi = Number(amountPulledInPeriod) / 10 ** USDC_DECIMALS;
  const currentPeriodPaid = amountPulledInPeriod >= terms.amount;
  const periodReset = periodEndTs <= nowSeconds;

  async function handleCancel() {
    setBusy("cancel");
    try {
      // Pass the actual planPda from the subscription so old planId=2 subscriptions
      // (where destinations were the ATA address, not wallet) can still be cancelled.
      const signature = await cancelService(connection, wallet, service, serviceSub.planPda);
      logActivity(`Cancelled ${service.name}`, signature);
      toast.success(`${service.name} cancelled. Your access ends at the billing period.`, {
        action: {
          label: "View tx",
          onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank"),
        },
      });
      // Dismiss immediately — don't wait for network re-fetch to hide the card.
      setDismissed(true);
      refresh(); // background re-fetch to sync plan card "isSubscribed" state
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cancel failed.");
    } finally {
      setBusy(null);
    }
  }

  async function handleResume() {
    setBusy("resume");
    try {
      const signature = await resumeService(connection, wallet, service, serviceSub.planPda);
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
    if (!wallet.publicKey) return;
    setBusy("pull");
    try {
      const response = await fetch("/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, subscriber: wallet.publicKey.toBase58() }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Payment collection failed.");
      logActivity(`${service.name} collected $${json.amount}`, json.signature);
      toast.success(`${service.name} collected $${json.amount} USDC.`);
      refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment collection failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: service name + status */}
        <div className="flex items-center gap-3">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{service.name}</p>
              <Badge
                variant={isCancelled ? "outline" : "default"}
                className={
                  isCancelled
                    ? "border-muted-foreground/30 text-muted-foreground"
                    : "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                }
              >
                {isCancelled ? (
                  "Cancels soon"
                ) : (
                  <>
                    <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                    Active
                  </>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              ${amountUi} / 30 days &middot; ${pulledUi.toFixed(2)} paid this period
              {isCancelled && (
                <span className="ml-2 text-amber-400">
                  · Access until {format(nextBillingDate, "MMM d")}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: billing info + action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isCancelled && (
            <span className="text-xs text-muted-foreground">
              {currentPeriodPaid && !periodReset
                ? `Renews ${format(nextBillingDate, "MMM d, yyyy")}`
                : periodReset
                  ? "New period — payment due"
                  : `$${pulledUi.toFixed(2)} paid`}
            </span>
          )}

          {/* Collect next payment — only relevant for active subscriptions */}
          {!isCancelled && (
            <Button
              size="sm"
              variant="secondary"
              disabled={busy !== null || (currentPeriodPaid && !periodReset)}
              onClick={handlePull}
              title={currentPeriodPaid && !periodReset ? "Already collected this period" : "Collect next month's payment (demo)"}
            >
              {busy === "pull" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              {currentPeriodPaid && !periodReset ? "Paid ✓" : "Collect next payment"}
            </Button>
          )}

          {/* Cancel / Resume */}
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
