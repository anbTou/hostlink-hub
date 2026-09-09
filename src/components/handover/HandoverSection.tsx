import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HandoverItem, NewHandoverItemInput } from "@/types/handover";
import { CategoryMeta } from "./handoverMeta";
import { HandoverItemRow } from "./HandoverItemRow";
import { NewItemForm } from "./NewItemForm";

interface Props {
  meta: CategoryMeta;
  items: HandoverItem[];
  expanded: boolean;
  readOnly?: boolean;
  onToggleExpanded: () => void;
  onToggleItem: (id: string) => void;
  onOpenItem: (item: HandoverItem) => void;
  onAdd: (input: NewHandoverItemInput) => void;
}

export function HandoverSection({
  meta,
  items,
  expanded,
  readOnly,
  onToggleExpanded,
  onToggleItem,
  onOpenItem,
  onAdd,
}: Props) {
  const open = items.filter((i) => i.status === "open");
  const done = items.filter((i) => i.status === "completed");

  return (
    <section className={cn("rounded-2xl border-l-4 bg-white shadow-soft", meta.border)}>
      <button
        type="button"
        onClick={onToggleExpanded}
        className="flex w-full items-center gap-2 px-4 py-3"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="text-base">{meta.emoji}</span>
        <span className="font-semibold text-sm">{meta.label}</span>
        <Badge variant="outline" className={cn("ml-2 h-5", meta.badge)}>
          {open.length} open
        </Badge>
        {done.length > 0 && (
          <span className="text-[11px] text-muted-foreground">{done.length} done</span>
        )}
      </button>

      {expanded && (
        <div className="space-y-2 px-4 pb-4">
          {open.map((item) => (
            <HandoverItemRow key={item.id} item={item} readOnly={readOnly} onToggle={onToggleItem} onOpen={onOpenItem} />
          ))}
          {open.length === 0 && (
            <p className="py-2 text-xs text-muted-foreground">Nothing pending here.</p>
          )}

          {done.length > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Completed
              </p>
              {done.map((item) => (
                <HandoverItemRow key={item.id} item={item} readOnly={readOnly} onToggle={onToggleItem} onOpen={onOpenItem} />
              ))}
            </div>
          )}

          {!readOnly && <NewItemForm category={meta.id} onAdd={onAdd} />}
        </div>
      )}
    </section>
  );
}
