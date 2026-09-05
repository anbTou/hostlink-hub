import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AiAmenity, AMENITY_GROUPS } from "@/types/ai-knowledge";

interface Props {
  amenities: AiAmenity[];
  editing: boolean;
  onChange: (amenities: AiAmenity[]) => void;
}

export function AmenityGrid({ amenities, editing, onChange }: Props) {
  const [newLabel, setNewLabel] = useState("");
  const [newGroup, setNewGroup] = useState<string>(AMENITY_GROUPS[0]);

  const update = (id: string, patch: Partial<AiAmenity>) =>
    onChange(amenities.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const setDetails = (id: string, value: string) =>
    onChange(
      amenities.map((a) =>
        a.id === id
          ? { ...a, details: { ...a.details, value, source: "manual", updatedAt: new Date().toISOString() } }
          : a
      )
    );

  const addCustom = () => {
    if (!newLabel.trim()) return;
    onChange([
      ...amenities,
      {
        id: `custom-${Date.now()}`,
        group: newGroup,
        label: newLabel.trim(),
        available: true,
        details: { value: "", source: "manual" },
        custom: true,
      },
    ]);
    setNewLabel("");
  };

  const groups = Array.from(new Set([...AMENITY_GROUPS, ...amenities.map((a) => a.group)]));

  return (
    <div className="space-y-5 pt-3">
      {groups.map((group) => {
        const items = amenities.filter((a) => a.group === group);
        if (!items.length) return null;
        return (
          <div key={group} className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {items.map((a) => {
                const needsDetails = a.available && !a.details.value.trim();
                return (
                  <div
                    key={a.id}
                    className={cn(
                      "rounded-lg border p-2.5 space-y-2",
                      needsDetails ? "bg-red-50 border-red-200" : "bg-card border-border"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm flex-1 truncate">{a.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {a.available ? "Yes" : "No"}
                      </span>
                      <Switch
                        checked={a.available}
                        disabled={!editing}
                        onCheckedChange={(v) => update(a.id, { available: v })}
                        aria-label={`${a.label} available`}
                      />
                      {editing && a.custom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onChange(amenities.filter((x) => x.id !== a.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    {a.available &&
                      (editing ? (
                        <Input
                          value={a.details.value}
                          onChange={(e) => setDetails(a.id, e.target.value)}
                          placeholder="Required — details for the chatbot"
                          className="h-8 text-xs"
                        />
                      ) : (
                        <p className={cn("text-xs", needsDetails ? "text-red-600" : "text-muted-foreground")}>
                          {a.details.value || "Required — details for the chatbot"}
                        </p>
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {editing && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Custom amenity"
            className="h-9 max-w-[200px]"
          />
          <select
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-2 text-sm"
          >
            {AMENITY_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" onClick={addCustom}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}
