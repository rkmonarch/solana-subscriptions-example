"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { CheckCircle2, Loader2, PlayCircle, XCircle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  const [dismissed, setDismissed] = useState(false);
  const refresh = useAppStore((s) => s.refresh);
  const logActivity = useAppStore((s) => s.logActivity);

  const { service, data } = serviceSub;
  if (!data || dismissed) return null;

  const { terms, currentPeriodStartTs, expiresAtTs, amountPulledInPeriod } = data;
  const isCancelled = expiresAtTs !== 0n;
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const periodEndTs = currentPeriodStartTs + terms.periodHours * 3600n;
  const nextBillingDate = new Date(Number(periodEndTs) * 1000);
  const amountUi = Number(terms.amount) / 10 ** USDC_DECIMALS;
  const pulledUi = Number(amountPulledInPeriod) / 10 ** USDC_DECIMALS;
  const currentPeriodPaid = amountPulledInPeriod >= terms.amount;
  const periodReset = periodEndTs <= nowSeconds;

  async function handleCancel() {
    setBusy("cancel");
    try {
      const sig = await cancelService(connection, wallet, service, serviceSub.planPda);
      logActivity(`Cancelled ${service.name}`, sig);
      toast.success(`${service.name} cancelled.`);
      setDismissed(true);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Cancel failed.");
    } finally { setBusy(null); }
  }

  async function handleResume() {
    setBusy("resume");
    try {
      const sig = await resumeService(connection, wallet, service, serviceSub.planPda);
      logActivity(`Resumed ${service.name}`, sig);
      toast.success(`Resumed ${service.name}.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resume failed.");
    } finally { setBusy(null); }
  }

  async function handlePull() {
    if (!wallet.publicKey) return;
    setBusy("pull");
    try {
      const res = await fetch("/api/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, subscriber: wallet.publicKey.toBase58() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Payment failed.");
      logActivity(`${service.name} collected $${json.amount}`, json.signature);
      toast.success(`${service.name} collected $${json.amount} USDC.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed.");
    } finally { setBusy(null); }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Left: identity + status */}
      <div className="flex items-center gap-3.5">
        {/* Service colour dot */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${service.color}18`, color: service.color }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: service.color }} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{service.name}</span>
            {isCancelled ? (
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                Cancels soon
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-2.5 w-2.5" /> Active
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            ${amountUi} / 30 days
            {" · "}
            <span className={pulledUi > 0 ? "text-emerald-600 font-medium" : ""}>
              ${pulledUi.toFixed(2)} paid this period
            </span>
            {isCancelled && (
              <span className="ml-2 text-amber-600">
                · Access until {format(nextBillingDate, "MMM d")}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex flex-wrap items-center gap-2">
        {!isCancelled && (
          <span className="text-xs text-muted-foreground">
            {currentPeriodPaid && !periodReset
              ? `Renews ${format(nextBillingDate, "MMM d, yyyy")}`
              : periodReset
                ? "New period — payment due"
                : `$${pulledUi.toFixed(2)} of $${amountUi} paid`}
          </span>
        )}

        {!isCancelled && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-border"
            disabled={busy !== null || (currentPeriodPaid && !periodReset)}
            onClick={handlePull}
          >
            {busy === "pull" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            {currentPeriodPaid && !periodReset ? "Paid ✓" : "Collect payment"}
          </Button>
        )}

        {isCancelled ? (
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 border-0"
            disabled={busy !== null}
            onClick={handleResume}
          >
            {busy === "resume" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
            Resume
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-border text-muted-foreground hover:text-destructive hover:border-red-200"
            disabled={busy !== null}
            onClick={handleCancel}
          >
            {busy === "cancel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
