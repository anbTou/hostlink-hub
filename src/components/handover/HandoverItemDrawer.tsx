import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HandoverCategory, HandoverItem } from "@/types/handover";
import { HANDOVER_CATEGORIES } from "./handoverMeta";
import { mockProperties } from "@/data/mockProperties";
import { teamMembers } from "@/types/team";
import { getConversationRef } from "@/data/mockHandover";

interface Props {
  item: HandoverItem | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (id: string, patch: Partial<HandoverItem>) => void;
  onDelete: (id: string) => void;
}

export function HandoverItemDrawer({ item, readOnly, onClose, onSave, onDelete }: Props) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HandoverCategory>("guest_issues");
  const [propertyId, setPropertyId] = useState("none");
  const [assignee, setAssignee] = useState("none");
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!item) return;
    setDescription(item.description);
    setCategory(item.category);
    setPropertyId(item.property_id ?? "none");
    setAssignee(item.assigned_to ?? "none");
    setUrgent(item.is_urgent);
    setNotes(item.notes ?? "");
  }, [item]);

  const convo = getConversationRef(item?.conversation_id);

  const save = () => {
    if (!item) return;
    onSave(item.id, {
      description,
      category,
      property_id: propertyId === "none" ? undefined : propertyId,
      assigned_to: assignee === "none" ? undefined : assignee,
      is_urgent: urgent,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Sheet open={!!item} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Handover item</SheetTitle>
        </SheetHeader>

        {item && (
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input value={description} disabled={readOnly} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select value={category} disabled={readOnly} onValueChange={(v) => setCategory(v as HandoverCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {HANDOVER_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.emoji} {c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Property</label>
                <Select value={propertyId} disabled={readOnly} onValueChange={setPropertyId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No property</SelectItem>
                    {mockProperties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Assigned to</label>
              <Select value={assignee} disabled={readOnly} onValueChange={setAssignee}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {teamMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={urgent} disabled={readOnly} onCheckedChange={(v) => setUrgent(!!v)} /> Mark as urgent
            </label>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Notes</label>
              <Textarea rows={4} value={notes} disabled={readOnly} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {convo && (
              <div className="rounded-xl border bg-muted/30 p-3 text-xs">
                <p className="font-medium">{convo.guestName} · {convo.propertyName}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2">{convo.preview}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Activity</p>
              <ul className="space-y-1.5">
                {item.activity_log.map((a) => (
                  <li key={a.id} className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{a.user}</span>{" "}
                    {a.details ?? a.action} · {format(parseISO(a.timestamp), "dd MMM HH:mm")}
                  </li>
                ))}
              </ul>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2 pt-2">
                <Button onClick={save}>Save changes</Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-destructive"
                  onClick={() => { onDelete(item.id); onClose(); }}
                  aria-label="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
