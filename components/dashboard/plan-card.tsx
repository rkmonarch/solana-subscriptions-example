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

interface PlanCardProps {
  service: ServiceConfig;
  isSubscribed: boolean;
}

export function PlanCard({ service, isSubscribed }: PlanCardProps) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { plan, loading: planLoading } = usePlan(service);
  const [submitting, setSubmitting] = useState(false);
  const refresh = useAppStore((s) => s.refresh);
  const logActivity = useAppStore((s) => s.logActivity);

  const Icon = ICONS[service.id];

  async function handleSubscribe() {
    if (!wallet.publicKey) {
      toast.error("Connect a wallet first.");
      return;
    }
    setSubmitting(true);
    try {
      const { subscribeSignature, initSignature } = await subscribeToService(
        connection,
        wallet,
        service,
      );
      if (initSignature) {
        logActivity("Initialized subscription authority", initSignature);
      }
      logActivity(`Subscribed to ${service.name}`, subscribeSignature);
      toast.success(`Subscribed to ${service.name}!`, {
        action: {
          label: "View tx",
          onClick: () => window.open(explorerTxUrl(subscribeSignature), "_blank"),
        },
      });
      refresh();
    } catch (error) {
      // WalletSendTransactionError wraps the raw RPC/wallet error in `.error`.
      // Dig for the most useful message available.
      const walletErr = error as { error?: { message?: string; logs?: string[] }; message?: string };
      const inner = walletErr?.error;
      const msg =
        inner?.message ??
        (inner?.logs ? inner.logs.find((l) => l.includes("Error")) : undefined) ??
        (error instanceof Error ? error.message : "Subscription failed.");
      toast.error(msg, { duration: 8000 });
      console.error("Subscribe error:", error);
    } finally {
      setSubmitting(false);
    }
  }

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
            <CheckCircle2 className="h-3 w-3" /> Subscribed
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tabular-nums">${service.priceUsdc}</span>
          <span className="text-sm text-muted-foreground">/ 30 days, billed in USDC</span>
        </div>
        {!planLoading && !plan && (
          <p className="mt-2 text-xs text-amber-400">
            Plan not found on-chain yet — run <code>npm run bootstrap</code>.
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
          {submitting
            ? "Subscribing..."
            : isSubscribed
              ? "Already subscribed"
              : "Subscribe with USDC"}
        </Button>
      </CardFooter>
    </Card>
  );
}
