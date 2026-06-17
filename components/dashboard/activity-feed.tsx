"use client";

import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { explorerTxUrl } from "@/lib/solana";
import { useAppStore } from "@/lib/store";

export function ActivityFeed() {
  const activity = useAppStore((s) => s.activity);
  const clearActivity = useAppStore((s) => s.clearActivity);

  if (activity.length === 0) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Recent activity</CardTitle>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={clearActivity}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-2 text-sm">
            <div className="min-w-0">
              <p className="truncate">{entry.label}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => {
                  navigator.clipboard.writeText(entry.signature);
                  toast.success("Signature copied.");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => window.open(explorerTxUrl(entry.signature), "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
