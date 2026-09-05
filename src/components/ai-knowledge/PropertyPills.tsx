import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { propertyTypeIcon, PropertyType } from "@/types/property";

export interface PillItem {
  id: string;
  name: string;
  type: PropertyType;
  percent: number;
}

interface Props {
  items: PillItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function completionTone(percent: number) {
  if (percent >= 90) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (percent >= 50) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

export function PropertyPills({ items, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search properties..."
          className="pl-9 h-9 bg-card"
          aria-label="Search properties"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "shrink-0 flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
              selectedId === p.id
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-card hover:bg-muted"
            )}
          >
            <span>{propertyTypeIcon[p.type]}</span>
            <span className="whitespace-nowrap">{p.name}</span>
            <span
              className={cn(
                "text-[11px] rounded-full px-1.5 py-0.5 ring-1",
                completionTone(p.percent)
              )}
            >
              {p.percent}%
            </span>
          </button>
        ))}
        {!filtered.length && (
          <p className="text-sm text-muted-foreground py-2">No properties match that search.</p>
        )}
      </div>
    </div>
  );
}
