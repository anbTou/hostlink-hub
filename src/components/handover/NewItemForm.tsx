import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HandoverCategory, NewHandoverItemInput } from "@/types/handover";
import { mockProperties } from "@/data/mockProperties";
import { teamMembers } from "@/types/team";

interface Props {
  category: HandoverCategory;
  onAdd: (input: NewHandoverItemInput) => void;
}

export function NewItemForm({ category, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [propertyId, setPropertyId] = useState<string>("none");
  const [assignee, setAssignee] = useState<string>("none");
  const [urgent, setUrgent] = useState(false);

  const reset = () => {
    setDescription("");
    setPropertyId("none");
    setAssignee("none");
    setUrgent(false);
  };

  const submit = () => {
    if (!description.trim()) return;
    onAdd({
      description,
      category,
      property_id: propertyId === "none" ? undefined : propertyId,
      assigned_to: assignee === "none" ? undefined : assignee,
      is_urgent: urgent,
    });
    reset();
  };

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" /> New item
      </Button>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-3 space-y-2">
      <Input
        autoFocus
        placeholder="What needs to be handed over?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") { reset(); setOpen(false); }
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Select value={propertyId} onValueChange={setPropertyId}>
          <SelectTrigger className="h-8 w-[170px] text-xs"><SelectValue placeholder="Property" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No property</SelectItem>
            {mockProperties.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="h-8 w-[170px] text-xs"><SelectValue placeholder="Assign to" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {teamMembers.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox checked={urgent} onCheckedChange={(v) => setUrgent(!!v)} /> Urgent
        </label>

        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
          <Button size="sm" disabled={!description.trim()} onClick={submit}>Add</Button>
        </div>
      </div>
    </div>
  );
}
