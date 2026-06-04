import { Inbox, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton rows for the conversation list column. */
export function ListSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for the center conversation view (thread + reply box). */
export function ConversationSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-hidden p-4">
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="ml-auto h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-12 w-2/3 rounded-2xl" />
        <Skeleton className="ml-auto h-20 w-3/4 rounded-2xl" />
      </div>
      <div className="border-t border-border p-4">
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
}

/** Skeleton for the guest context panel column. */
export function ContextSkeleton() {
  return (
    <div className="space-y-5 p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-border p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Empty state shown when no conversations match the current view. */
export function EmptyConversations({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No conversations in this view</p>
      <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
        Try a different tab or adjust your filters to see more conversations.
      </p>
      {onClear && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

/** Error state with a retry action. */
export function InboxErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground">Couldn't load conversations</p>
      <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
        Something went wrong while loading this inbox. Please try again.
      </p>
      <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}
