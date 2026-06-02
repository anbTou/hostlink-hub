import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

/** A labelled read-only field. Synced fields get a subtle locked background. */
export function Field({
  label,
  value,
  synced = true,
  className,
}: {
  label: string;
  value: React.ReactNode;
  synced?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border px-3 py-2",
        synced ? "bg-muted/40" : "bg-card",
        className
      )}
    >
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="text-sm text-foreground">{value || "—"}</div>
    </div>
  );
}

export function EmptyState({
  message,
  onAdd,
}: {
  message: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="h-14 w-14 rounded-full bg-muted grid place-items-center mb-4">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onAdd && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onAdd}>
          Add manually
        </Button>
      )}
    </div>
  );
}
