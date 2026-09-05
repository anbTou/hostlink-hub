import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  icon: string;
  filled: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function SectionShell({ title, icon, filled, total, open, onToggle, children }: Props) {
  const complete = total > 0 && filled === total;
  return (
    <Card className="overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{icon}</span>
        <span className="font-medium text-sm flex-1">{title}</span>
        {total > 0 && (
          <span
            className={cn(
              "text-[11px] rounded-full px-2 py-0.5 font-medium",
              complete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            )}
          >
            {filled}/{total} required
          </span>
        )}
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t border-border/60">{children}</div>}
    </Card>
  );
}
