import { KnowledgeScope, SCOPE_CONFIG } from "@/types/knowledge";
import { cn } from "@/lib/utils";

interface ScopeBadgeProps {
  scope: KnowledgeScope;
  /** optional suffix shown after label, e.g. country name */
  detail?: string;
  className?: string;
}

export function ScopeBadge({ scope, detail, className }: ScopeBadgeProps) {
  const cfg = SCOPE_CONFIG[scope];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span aria-hidden>{cfg.icon}</span>
      {cfg.label}
      {detail ? `: ${detail}` : ""}
    </span>
  );
}
