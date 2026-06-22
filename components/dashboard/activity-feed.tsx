"use client";

import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { explorerTxUrl } from "@/lib/solana";
import { useAppStore } from "@/lib/store";

export function ActivityFeed() {
  const activity = useAppStore((s) => s.activity);
  const clearActivity = useAppStore((s) => s.clearActivity);

  if (activity.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Recent activity</h3>
        <button
          onClick={clearActivity}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-border">
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{entry.label}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => {
                  navigator.clipboard.writeText(entry.signature);
                  toast.success("Signature copied.");
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <a
                href={explorerTxUrl(entry.signature)}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
