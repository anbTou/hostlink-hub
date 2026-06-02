import { RefreshCw, Pencil, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataSource } from "@/types/property";
import { absoluteTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";

interface SyncIndicatorProps {
  source: DataSource;
  provider?: string;
  lastUpdated?: string;
  className?: string;
}

/** Small icon shown next to a section title indicating its data origin. */
export function SyncIndicator({ source, provider, lastUpdated, className }: SyncIndicatorProps) {
  const synced = source === "synced";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs",
            synced ? "text-muted-foreground" : "text-primary",
            className
          )}
          aria-label={synced ? "Synced data" : "Editable internal data"}
        >
          {synced ? <RefreshCw className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          {synced && <Lock className="h-3 w-3 opacity-60" />}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {synced
          ? `Synced from ${provider ?? "channel manager"} · Last updated: ${absoluteTime(lastUpdated)}`
          : "Internal Hostsy data · Editable"}
      </TooltipContent>
    </Tooltip>
  );
}

/** Section header with title + optional source indicator. */
export function SectionTitle({
  children,
  source,
  provider,
  lastUpdated,
  className,
}: {
  children: React.ReactNode;
  source?: DataSource;
  provider?: string;
  lastUpdated?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 mb-3", className)}>
      <h3 className="text-sm font-semibold text-foreground">{children}</h3>
      {source && <SyncIndicator source={source} provider={provider} lastUpdated={lastUpdated} />}
    </div>
  );
}
