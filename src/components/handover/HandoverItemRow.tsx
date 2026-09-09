import { AlertTriangle, MessageSquare, RotateCcw, StickyNote } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { HandoverItem } from "@/types/handover";
import { getAgentById } from "@/types/team";
import { mockProperties } from "@/data/mockProperties";
import { getConversationRef } from "@/data/mockHandover";

export const propertyName = (id?: string) =>
  id ? mockProperties.find((p) => p.id === id)?.name ?? "Property" : undefined;

interface Props {
  item: HandoverItem;
  readOnly?: boolean;
  onToggle: (id: string) => void;
  onOpen: (item: HandoverItem) => void;
}

export function HandoverItemRow({ item, readOnly, onToggle, onOpen }: Props) {
  const agent = getAgentById(item.assigned_to ?? "");
  const prop = propertyName(item.property_id);
  const convo = getConversationRef(item.conversation_id);
  const done = item.status === "completed";

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border bg-white px-3 py-2.5 transition-colors hover:border-orange-200 hover:bg-orange-50/40",
        done && "opacity-60",
        item.is_urgent && !done && "border-red-200 bg-red-50/40"
      )}
    >
      <Checkbox
        checked={done}
        disabled={readOnly}
        onCheckedChange={() => onToggle(item.id)}
        className="mt-0.5"
        aria-label={done ? "Reopen item" : "Mark as completed"}
      />

      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {item.is_urgent && !done && <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
          <span className={cn("text-sm font-medium", done && "line-through text-muted-foreground")}>
            {item.description}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
          {prop && <Badge variant="outline" className="h-5 font-normal">{prop}</Badge>}
          {convo && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {convo.guestName}
            </span>
          )}
          {item.notes && (
            <span className="inline-flex items-center gap-1">
              <StickyNote className="h-3 w-3" /> Notes
            </span>
          )}
          {item.carried_over_from_date && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <RotateCcw className="h-3 w-3" /> Carried over
            </span>
          )}
          {done && item.completed_at && (
            <span>Done {format(parseISO(item.completed_at), "HH:mm")}</span>
          )}
        </div>
      </button>

      {agent ? (
        <div
          className="h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
          style={{ backgroundColor: agent.avatarColor }}
          title={agent.name}
        >
          {agent.name.charAt(0)}
        </div>
      ) : (
        <div className="h-6 w-6 shrink-0 rounded-full border border-dashed border-muted-foreground/40" title="Unassigned" />
      )}
    </div>
  );
}
