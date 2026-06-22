"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Film, Loader2, Music2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/lib/hooks";
import { explorerTxUrl, subscribeToService, type ServiceConfig } from "@/lib/solana";
import { useAppStore } from "@/lib/store";

const ICONS: Record<ServiceConfig["id"], typeof Music2> = {
  spotify: Music2,
  netflix: Film,
};

type Step = "subscribing" | "paying" | null;

interface PlanCardProps {
  service: ServiceConfig;
  isSubscribed: boolean;
}

export function PlanCard({ service, isSubscribed }: PlanCardProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { plan, loading: planLoading } = usePlan(service);
  const [step, setStep] = useState<Step>(null);
  const refresh = useAppStore((s) => s.refresh);
  const logActivity = useAppStore((s) => s.logActivity);

  const Icon = ICONS[service.id];
  const submitting = step !== null;

  async function handleSubscribe() {
    if (!wallet.publicKey) {
      toast.error("Connect a wallet first.");
      return;
    }
    setStep("subscribing");
    let subscribeSignature: string;
    try {
      const result = await subscribeToService(connection, wallet, service);
      subscribeSignature = result.subscribeSignature;
      if (result.initSignature) logActivity("Initialized subscription authority", result.initSignature);
      const label = result.mode === "resumed" ? `Resumed ${service.name}` : `Subscribed to ${service.name}`;
      logActivity(label, subscribeSignature);
    } catch (error) {
      const walletErr = error as { error?: { message?: string }; message?: string };
      const msg = walletErr?.error?.message ?? (error instanceof Error ? error.message : "Subscription failed.");
      toast.error(msg, { duration: 8000 });
      setStep(null);
      return;
    }

    setStep("paying");
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50_000);
      let res: Response;
      try {
        res = await fetch("/api/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceId: service.id, subscriber: wallet.publicKey.toBase58() }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const json = await res.json();
      if (!res.ok) {
        toast.warning(
          `Subscribed ✓ — but first payment failed: ${json.error ?? "unknown error"}. Use "Collect next payment" to pay manually.`,
          { duration: 10000 },
        );
      } else {
        logActivity(`First payment $${json.amount} to ${service.name}`, json.signature);
        toast.success(`Subscribed to ${service.name}! $${json.amount} USDC charged.`, {
          action: { label: "View", onClick: () => window.open(explorerTxUrl(json.signature), "_blank") },
        });
      }
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      toast.warning(
        isTimeout
          ? `Subscribed ✓ — payment is still processing. Check your balance in a moment.`
          : `Subscribed ✓ — first payment failed. Use "Collect next payment" to pay manually.`,
        { duration: 10000 },
      );
    }

    setStep(null);
    refresh();
    setTimeout(() => refresh(), 2500);
  }

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Top colour stripe */}
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: service.color }} />

      <div className="p-6 pt-7">
        {/* Header row */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
              style={{ backgroundColor: `${service.color}18`, color: service.color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.tagline}</p>
            </div>
          </div>
          {isSubscribed && (
            <Badge className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none">
              <CheckCircle2 className="h-3 w-3" /> Active
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums text-foreground">${service.priceUsdc}</span>
          <span className="text-sm text-muted-foreground">/ 30 days</span>
        </div>
        <p className="mb-6 text-xs text-muted-foreground">
          {isSubscribed
            ? "Renews every 30 days. Cancel anytime."
            : submitting
              ? step === "subscribing"
                ? "Step 1 — Creating subscription on-chain…"
                : "Step 2 — Charging first month…"
              : `$${service.priceUsdc} USDC charged immediately, then every 30 days.`}
        </p>

        {/* Plan not found warning */}
        {!planLoading && !plan && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600">
            Plan not found — run <code className="font-mono">npm run bootstrap</code>
          </p>
        )}

        {/* Step indicators when subscribing */}
        {submitting && (
          <div className="mb-5 space-y-1.5">
            <div className={`flex items-center gap-2 text-xs ${step === "subscribing" ? "text-foreground" : "text-emerald-600"}`}>
              {step === "subscribing" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Sign subscription delegation
            </div>
            <div className={`flex items-center gap-2 text-xs ${step === "paying" ? "text-foreground" : "text-muted-foreground"}`}>
              {step === "paying" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                </span>
              )}
              Charge ${service.priceUsdc} USDC for this month
            </div>
          </div>
        )}

        {/* CTA button */}
        <button
          disabled={submitting || planLoading || !plan || isSubscribed}
          onClick={handleSubscribe}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: isSubscribed || !plan ? "var(--secondary)" : service.color,
            color: isSubscribed || !plan ? "var(--secondary-foreground)" : "#fff",
          }}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {!submitting && !isSubscribed && plan && <Zap className="h-4 w-4" />}
          {submitting
            ? step === "subscribing" ? "Creating subscription…" : "Charging first month…"
            : isSubscribed
              ? "Already subscribed"
              : `Subscribe — $${service.priceUsdc} USDC charged today`}
        </button>
      </div>
    </div>
  );
}
