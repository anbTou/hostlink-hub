import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { AiBathroomRow, AiRoomRow } from "@/types/ai-knowledge";

interface Props {
  rooms: AiRoomRow[];
  bathrooms: AiBathroomRow[];
  editing: boolean;
  onRoomsChange: (rows: AiRoomRow[]) => void;
  onBathroomsChange: (rows: AiBathroomRow[]) => void;
}

export function RoomTables({
  rooms,
  bathrooms,
  editing,
  onRoomsChange,
  onBathroomsChange,
}: Props) {
  const bedCount = rooms.length;

  return (
    <div className="space-y-6 pt-3">
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bedrooms ({bedCount})
          </h4>
          {editing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onRoomsChange([
                  ...rooms,
                  { id: `room-${Date.now()}`, name: "", bed: "", ensuite: false, notes: "" },
                ])
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add bedroom
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {rooms.map((r) => (
            <div
              key={r.id}
              className="grid gap-2 md:grid-cols-[1fr_1fr_auto_1.5fr_auto] items-center rounded-lg border border-border bg-card p-2"
            >
              <Field editing={editing} value={r.name} placeholder="Room name"
                onChange={(v) => onRoomsChange(rooms.map((x) => (x.id === r.id ? { ...x, name: v } : x)))} />
              <Field editing={editing} value={r.bed} placeholder="Bed type"
                onChange={(v) => onRoomsChange(rooms.map((x) => (x.id === r.id ? { ...x, bed: v } : x)))} />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                En-suite
                <Switch
                  checked={r.ensuite}
                  disabled={!editing}
                  onCheckedChange={(v) =>
                    onRoomsChange(rooms.map((x) => (x.id === r.id ? { ...x, ensuite: v } : x)))
                  }
                  aria-label={`${r.name} en-suite`}
                />
              </div>
              <Field editing={editing} value={r.notes ?? ""} placeholder="Notes"
                onChange={(v) => onRoomsChange(rooms.map((x) => (x.id === r.id ? { ...x, notes: v } : x)))} />
              {editing && (
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => onRoomsChange(rooms.filter((x) => x.id !== r.id))}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
          {!rooms.length && (
            <p className="text-sm text-red-600">Required — add at least one bedroom.</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bathrooms ({bathrooms.length})
          </h4>
          {editing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onBathroomsChange([
                  ...bathrooms,
                  { id: `bath-${Date.now()}`, name: "", kind: "", notes: "" },
                ])
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add bathroom
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {bathrooms.map((b) => (
            <div
              key={b.id}
              className="grid gap-2 md:grid-cols-[1fr_1fr_1.5fr_auto] items-center rounded-lg border border-border bg-card p-2"
            >
              <Field editing={editing} value={b.name} placeholder="Bathroom name"
                onChange={(v) => onBathroomsChange(bathrooms.map((x) => (x.id === b.id ? { ...x, name: v } : x)))} />
              <Field editing={editing} value={b.kind} placeholder="Type"
                onChange={(v) => onBathroomsChange(bathrooms.map((x) => (x.id === b.id ? { ...x, kind: v } : x)))} />
              <Field editing={editing} value={b.notes ?? ""} placeholder="Notes"
                onChange={(v) => onBathroomsChange(bathrooms.map((x) => (x.id === b.id ? { ...x, notes: v } : x)))} />
              {editing && (
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => onBathroomsChange(bathrooms.filter((x) => x.id !== b.id))}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Totals for the chatbot: {bedCount} bedroom{bedCount === 1 ? "" : "s"} ·{" "}
        {bathrooms.length} bathroom{bathrooms.length === 1 ? "" : "s"} ·{" "}
        {rooms.filter((r) => r.ensuite).length} en-suite
      </p>
    </div>
  );
}

function Field({
  editing,
  value,
  placeholder,
  onChange,
}: {
  editing: boolean;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  if (!editing) {
    return <span className="text-sm px-1 truncate">{value || "—"}</span>;
  }
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-sm"
    />
  );
}
