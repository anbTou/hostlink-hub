import { KnowledgeBlock } from "@/types/knowledge";
import { KB_PROPERTIES } from "@/data/mockKnowledge";
import { compileForProperty } from "@/lib/knowledgeUtils";
import { ScopeBadge } from "./ScopeBadge";
import { categoryLabel } from "@/lib/knowledgeUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  propertyId: string;
  onPropertyChange: (id: string) => void;
  allBlocks: KnowledgeBlock[];
}

export function InheritanceViewer({
  propertyId,
  onPropertyChange,
  allBlocks,
}: Props) {
  const prop = KB_PROPERTIES.find((p) => p.id === propertyId) ?? KB_PROPERTIES[0];
  const entries = compileForProperty(prop, allBlocks);

  const sourceText = (
    block: KnowledgeBlock,
    overriddenBy?: KnowledgeBlock
  ): string => {
    if (overriddenBy) return `Overridden by "${overriddenBy.title}"`;
    if (block.overridesId) {
      const parent = allBlocks.find((b) => b.id === block.overridesId);
      return parent
        ? `Overrides "${parent.title}" (${parent.scopeType})`
        : "Property-specific exception";
    }
    switch (block.scopeType) {
      case "company":
        return "Inherited from company policy (no exception)";
      case "country":
        return `Applies to all properties in ${block.scopeId}`;
      case "property-type":
        return `Applies to all ${block.scopeId}s`;
      case "property":
        return "Property-specific rule";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Property:</span>
        <Select value={prop.id} onValueChange={onPropertyChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KB_PROPERTIES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {entries.filter((e) => !e.overriddenBy).length} effective rules
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries.map(({ block, overriddenBy }, i) => (
          <div
            key={block.id}
            className={cn(
              "rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in",
              overriddenBy && "opacity-70"
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <h3
              className={cn(
                "text-base font-semibold",
                overriddenBy && "text-muted-foreground line-through"
              )}
            >
              {block.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ScopeBadge
                scope={block.scopeType}
                detail={
                  block.scopeType === "country" ||
                  block.scopeType === "property-type"
                    ? block.scopeId
                    : undefined
                }
              />
              <span className="rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs text-[#374151]">
                {categoryLabel(block)}
              </span>
              {overriddenBy && (
                <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#92400E]">
                  Overridden by {overriddenBy.title}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs italic text-muted-foreground">
              Source: {sourceText(block, overriddenBy)}
            </p>
            <p
              className={cn(
                "mt-3 line-clamp-3 whitespace-pre-line text-sm",
                overriddenBy ? "text-muted-foreground" : "text-foreground/90"
              )}
            >
              {block.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
