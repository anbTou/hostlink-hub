import { useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Property, propertyTypeIcon } from "@/types/property";

interface PropertySelectorProps {
  properties: Property[];
  selectedId: string | null; // null === "All Properties"
  onSelect: (id: string | null) => void;
}

export function PropertySelector({ properties, selectedId, onSelect }: PropertySelectorProps) {
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = properties.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  const showArrows = filtered.length > 6;

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

      <div className="flex items-center gap-2">
        {showArrows && (
          <button
            onClick={() => scroll("left")}
            className="shrink-0 h-8 w-8 grid place-items-center rounded-full border border-border bg-card hover:bg-muted"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1"
        >
          <Pill active={selectedId === null} onClick={() => onSelect(null)}>
            All Properties
          </Pill>

          {filtered.length === 0 && query && (
            <span className="text-sm text-muted-foreground px-2 whitespace-nowrap">
              No properties found matching "{query}"
            </span>
          )}

          {filtered.map((p) => (
            <Pill key={p.id} active={selectedId === p.id} onClick={() => onSelect(p.id)}>
              <span aria-hidden>{propertyTypeIcon[p.type]}</span>
              <span className="whitespace-nowrap">{p.name}</span>
              {p.isDefault && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-1 px-1.5 py-0 text-[10px]",
                    selectedId === p.id && "bg-primary-foreground/20 text-primary-foreground"
                  )}
                >
                  Default
                </Badge>
              )}
            </Pill>
          ))}
        </div>

        {showArrows && (
          <button
            onClick={() => scroll("right")}
            className="shrink-0 h-8 w-8 grid place-items-center rounded-full border border-border bg-card hover:bg-muted"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors shrink-0",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted text-foreground border-transparent hover:border-primary"
      )}
    >
      {children}
    </button>
  );
}
