"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CheckCircle2, Film, Loader2, Music2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlan } from "@/lib/hooks";
import { explorerTxUrl, subscribeToService, type ServiceConfig } from "@/lib/solana";
import { useAppStore } from "@/lib/store";

const ICONS: Record<ServiceConfig["id"], typeof Music2> = {
  spotify: Music2,
  netflix: Film,
};

/** Which phase of the subscribe-and-pay flow we're in, for the button label. */
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

    // ── Phase 1: create the on-chain SubscriptionDelegation (user signs) ──────
    setStep("subscribing");
    let subscribeSignature: string;
    try {
      const result = await subscribeToService(connection, wallet, service);
      subscribeSignature = result.subscribeSignature;
      if (result.initSignature) {
        logActivity("Initialized subscription authority", result.initSignature);
      }
      const label = result.mode === "resumed" ? `Resumed ${service.name}` : `Subscribed to ${service.name}`;
      logActivity(label, subscribeSignature);
    } catch (error) {
      const walletErr = error as { error?: { message?: string; logs?: string[] }; message?: string };
      const inner = walletErr?.error;
      const msg =
        inner?.message ??
        (inner?.logs ? inner.logs.find((l) => l.includes("Error")) : undefined) ??
        (error instanceof Error ? error.message : "Subscription failed.");
      toast.error(msg, { duration: 8000 });
      console.error("Subscribe error:", error);
      setStep(null);
      return;
    }

    // ── Phase 2: collect first month's payment immediately (server-signed) ────
    setStep("paying");
    // Give the RPC cluster ~1.5 s to propagate the new SubscriptionDelegation account to all
    // nodes before the server tries to read it for transferSubscription.
    await new Promise((r) => setTimeout(r, 1500));
    try {
      // Hard 50-second client timeout — the API route polls for tx confirmation (up to 60 s)
      // but we abort from the client side slightly earlier so the UI always unfreezes.
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
          `Subscribed to ${service.name} ✓ — but first payment failed: ${json.error ?? "unknown error"}. ` +
            `Use "Collect next payment" in your subscriptions to pay manually.`,
          { duration: 10000 },
        );
      } else {
        logActivity(`First payment $${json.amount} to ${service.name}`, json.signature);
        toast.success(`Subscribed to ${service.name} and $${json.amount} USDC charged for this month!`, {
          action: {
            label: "View payment",
            onClick: () => window.open(explorerTxUrl(json.signature), "_blank"),
          },
        });
      }
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      toast.warning(
        isTimeout
          ? `Subscribed to ${service.name} ✓ — payment is still processing. Check your balance in a moment.`
          : `Subscribed to ${service.name} ✓ — first payment failed. Use "Collect next payment" in your subscriptions.`,
        { duration: 10000 },
      );
    }

    setStep(null);
    refresh(); // immediate attempt
    // RPC cluster may take 1-3 s to propagate the new subscription account to all nodes.
    // Fire a second refresh so the subscription list appears even if the first miss it.
    setTimeout(() => refresh(), 2500);
  }

  const buttonLabel = () => {
    if (step === "subscribing") return "Creating subscription…";
    if (step === "paying")     return "Charging first month…";
    if (isSubscribed)          return "Already subscribed";
    return `Subscribe — $${service.priceUsdc} USDC charged today`;
  };

  return (
    <Card className="relative overflow-hidden border-border/60">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: service.color }} />
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${service.color}22`, color: service.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.tagline}</CardDescription>
          </div>
        </div>
        {isSubscribed && (
          <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Active
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tabular-nums">${service.priceUsdc}</span>
          <span className="text-sm text-muted-foreground">/ 30 days</span>
        </div>
        {/* Show the two-phase breakdown only when actively subscribing */}
        {submitting ? (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className={`flex items-center gap-1.5 ${step === "subscribing" ? "text-foreground" : ""}`}>
              {step === "subscribing" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              )}
              Step 1 — Sign subscription delegation
            </div>
            <div className={`flex items-center gap-1.5 ${step === "paying" ? "text-foreground" : ""}`}>
              {step === "paying" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-muted-foreground/40" />
              )}
              Step 2 — Charge ${service.priceUsdc} USDC for this month
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {isSubscribed
              ? "Renews every 30 days. Cancel anytime."
              : `$${service.priceUsdc} USDC charged immediately, then every 30 days.`}
          </p>
        )}
        {!planLoading && !plan && (
          <p className="text-xs text-amber-400">
            Plan not found — run <code>npm run bootstrap</code>.
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={submitting || planLoading || !plan || isSubscribed}
          onClick={handleSubscribe}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {buttonLabel()}
        </Button>
      </CardFooter>
    </Card>
  );
}
