"use client";

import { address } from "@solana/kit";
import { Download, Loader2, RefreshCw, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getMerchantSubscriptions,
  getServiceOwner,
  explorerTxUrl,
  type ServiceConfig,
} from "@/lib/solana";

import { SubscriberRow } from "./subscriber-row";

interface SubscriberListProps {
  service: ServiceConfig;
  refreshKey: number;
  onRefresh: () => void;
}

type Sub = Awaited<ReturnType<typeof getMerchantSubscriptions>>[number];

export function SubscriberList({ service, refreshKey, onRefresh }: SubscriberListProps) {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectingAll, setCollectingAll] = useState(false);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const merchant = getServiceOwner(service);
      const data = await getMerchantSubscriptions(merchant);
      setSubs(data);
    } catch (err) {
      console.error("Failed to load subscribers:", err);
      setSubs([]);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { fetchSubs(); }, [fetchSubs, refreshKey]);

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const collectableSubs = subs.filter((s) => {
    const { expiresAtTs, amountPulledInPeriod, terms, currentPeriodStartTs } = s.data;
    if (expiresAtTs !== 0n && expiresAtTs <= nowSeconds) return false;
    const periodEnded = currentPeriodStartTs + terms.periodHours * 3600n <= nowSeconds;
    return amountPulledInPeriod < terms.amount || periodEnded;
  });

  async function collectAll() {
    if (collectableSubs.length === 0) return;
    setCollectingAll(true);
    let succeeded = 0;
    for (const sub of collectableSubs) {
      try {
        const res = await fetch("/api/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceId: service.id, subscriber: sub.subscriber }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed");
        succeeded++;
        toast.success(`Collected $${json.amount} from ${sub.subscriber.slice(0, 6)}...`, {
          action: {
            label: "View",
            onClick: () => window.open(explorerTxUrl(json.signature), "_blank"),
          },
        });
      } catch (err) {
        toast.error(`Failed for ${sub.subscriber.slice(0, 6)}...: ${(err as Error).message}`);
      }
    }
    toast.success(`Collected from ${succeeded}/${collectableSubs.length} subscribers.`);
    setCollectingAll(false);
    onRefresh();
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          {service.name} subscribers
          {!loading && (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {subs.length}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            size="sm"
            disabled={collectableSubs.length === 0 || collectingAll}
            onClick={collectAll}
            style={{ backgroundColor: service.color, color: "#fff", border: "none" }}
          >
            {collectingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Collect all ({collectableSubs.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading subscribers...
          </div>
        ) : subs.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No subscribers yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collected / Total</TableHead>
                <TableHead>Next period</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((sub) => (
                <SubscriberRow
                  key={sub.address}
                  address={sub.address}
                  subscriber={sub.subscriber}
                  data={sub.data}
                  service={service}
                  onCollected={onRefresh}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
