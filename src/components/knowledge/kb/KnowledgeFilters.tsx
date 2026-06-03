import {
  KnowledgeCategory,
  KnowledgeScope,
  CATEGORY_LABELS,
  COUNTRIES,
  PROPERTY_TYPES,
} from "@/types/knowledge";
import { KB_PROPERTIES } from "@/data/mockKnowledge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export interface KbFilters {
  category: "all" | KnowledgeCategory;
  scope: "all" | KnowledgeScope;
  appliesTo: string; // "all" | country | type | property id
  search: string;
}

export const EMPTY_FILTERS: KbFilters = {
  category: "all",
  scope: "all",
  appliesTo: "all",
  search: "",
};

interface Props {
  filters: KbFilters;
  onChange: (next: KbFilters) => void;
}

export function KnowledgeFilters({ filters, onChange }: Props) {
  const set = (patch: Partial<KbFilters>) => onChange({ ...filters, ...patch });

  const appliesToLabel = (val: string) => {
    if (val === "all") return null;
    const prop = KB_PROPERTIES.find((p) => p.id === val);
    return prop ? prop.name : val;
  };

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.category !== "all")
    chips.push({
      key: "category",
      label: CATEGORY_LABELS[filters.category],
      clear: () => set({ category: "all" }),
    });
  if (filters.scope !== "all")
    chips.push({
      key: "scope",
      label: `Scope: ${filters.scope}`,
      clear: () => set({ scope: "all" }),
    });
  if (filters.appliesTo !== "all")
    chips.push({
      key: "appliesTo",
      label: `Applies to: ${appliesToLabel(filters.appliesTo)}`,
      clear: () => set({ appliesTo: "all" }),
    });
  if (filters.search.trim())
    chips.push({
      key: "search",
      label: `Search: "${filters.search}"`,
      clear: () => set({ search: "" }),
    });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.category}
            onValueChange={(v) => set({ category: v as KbFilters["category"] })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.scope}
            onValueChange={(v) => set({ scope: v as KbFilters["scope"] })}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value="company">Company-wide</SelectItem>
              <SelectItem value="country">Country-specific</SelectItem>
              <SelectItem value="property-type">Property Type-specific</SelectItem>
              <SelectItem value="property">Property-specific</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.appliesTo}
            onValueChange={(v) => set({ appliesTo: v })}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Applies to" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Property Types</SelectLabel>
                {PROPERTY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Properties</SelectLabel>
                {KB_PROPERTIES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative sm:ml-auto sm:w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs text-[#374151]"
            >
              {chip.label}
              <button onClick={chip.clear} aria-label={`Remove ${chip.label}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="ml-1 text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
