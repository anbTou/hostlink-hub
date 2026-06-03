import { KnowledgeBlock, CATEGORY_LABELS } from "@/types/knowledge";
import { propertyName } from "@/data/mockKnowledge";

export function appliesToText(block: KnowledgeBlock): string {
  switch (block.scopeType) {
    case "company":
      return "All properties";
    case "country":
      return `All properties in ${block.scopeId}`;
    case "property-type":
      return `All ${block.scopeId}s`;
    case "property":
      return propertyName(block.scopeId);
    default:
      return "All properties";
  }
}

export function categoryLabel(block: KnowledgeBlock): string {
  return CATEGORY_LABELS[block.category];
}

/** Blocks that override the given block (exceptions). */
export function getExceptions(
  block: KnowledgeBlock,
  all: KnowledgeBlock[]
): KnowledgeBlock[] {
  return all.filter((b) => b.overridesId === block.id);
}

const SCOPE_PRIORITY: Record<KnowledgeBlock["scopeType"], number> = {
  property: 0,
  "property-type": 1,
  country: 2,
  company: 3,
};

interface PropertyMeta {
  id: string;
  type: string;
  country: string;
}

/** Does a block apply to a given property (regardless of override)? */
export function blockAppliesToProperty(
  block: KnowledgeBlock,
  prop: PropertyMeta
): boolean {
  switch (block.scopeType) {
    case "company":
      return true;
    case "country":
      return block.scopeId === prop.country;
    case "property-type":
      return block.scopeId === prop.type;
    case "property":
      return block.scopeId === prop.id;
    default:
      return false;
  }
}

export interface CompiledEntry {
  block: KnowledgeBlock;
  overriddenBy?: KnowledgeBlock;
}

/**
 * Compile all blocks applying to a property, ordered most-specific first.
 * Within each category, a more specific block overrides less specific ones.
 */
export function compileForProperty(
  prop: PropertyMeta,
  all: KnowledgeBlock[]
): CompiledEntry[] {
  const applicable = all
    .filter((b) => b.status !== "archived")
    .filter((b) => blockAppliesToProperty(b, prop));

  // group by category to determine winner
  const byCategory = new Map<string, KnowledgeBlock[]>();
  for (const b of applicable) {
    const arr = byCategory.get(b.category) ?? [];
    arr.push(b);
    byCategory.set(b.category, arr);
  }

  const entries: CompiledEntry[] = applicable.map((block) => {
    const sameCat = byCategory.get(block.category)!;
    const moreSpecific = sameCat.find(
      (other) =>
        other.id !== block.id &&
        SCOPE_PRIORITY[other.scopeType] < SCOPE_PRIORITY[block.scopeType]
    );
    return { block, overriddenBy: moreSpecific };
  });

  return entries.sort(
    (a, b) =>
      SCOPE_PRIORITY[a.block.scopeType] - SCOPE_PRIORITY[b.block.scopeType]
  );
}
