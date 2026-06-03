import { KnowledgeBlock, KnowledgeCategory, CATEGORY_LABELS } from "@/types/knowledge";
import { cn } from "@/lib/utils";

const TAB_CATEGORIES: ("all" | KnowledgeCategory)[] = [
  "all",
  "general",
  "checkin",
  "cancellation",
  "extras",
  "country",
  "property-type",
];

interface Props {
  blocks: KnowledgeBlock[];
  active: "all" | KnowledgeCategory;
  onChange: (cat: "all" | KnowledgeCategory) => void;
}

export function CategoryTabs({ blocks, active, onChange }: Props) {
  const count = (cat: "all" | KnowledgeCategory) =>
    cat === "all" ? blocks.length : blocks.filter((b) => b.category === cat).length;

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border scrollbar-none">
      {TAB_CATEGORIES.map((cat) => {
        const label = cat === "all" ? "All" : CATEGORY_LABELS[cat];
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label} ({count(cat)})
          </button>
        );
      })}
    </div>
  );
}
