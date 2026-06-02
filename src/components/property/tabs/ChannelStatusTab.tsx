import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink } from "lucide-react";
import { Property, ChannelStatus } from "@/types/property";
import { relativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";

const statusConfig: Record<ChannelStatus, { label: string; className: string; icon: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700", icon: "✅" },
  paused: { label: "Paused", className: "bg-amber-50 text-amber-700", icon: "⏸" },
  "not-listed": { label: "Not listed", className: "bg-red-50 text-red-700", icon: "❌" },
};

export function ChannelStatusTab({ property }: { property: Property }) {
  return (
    <Card className="shadow-sm animate-fade-in">
      <CardContent className="p-2 sm:p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Listing ID</TableHead>
              <TableHead>Last Synced</TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {property.channels.map((c) => {
              const cfg = statusConfig[c.status];
              return (
                <TableRow key={c.channel}>
                  <TableCell className="font-medium">{c.channel}</TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", cfg.className)}>
                      <span aria-hidden>{cfg.icon}</span> {cfg.label}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{c.listingId ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.lastSynced ? relativeTime(c.lastSynced) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {c.url && c.status !== "not-listed" ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center text-primary hover:underline"
                        aria-label={`Open ${c.channel} listing`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
