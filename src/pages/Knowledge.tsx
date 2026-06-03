import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, Home, BookOpen, AlertTriangle } from "lucide-react";
import { KnowledgeBlock, KnowledgeScope, KnowledgeCategory } from "@/types/knowledge";
import { mockKnowledgeBlocks, KB_PROPERTIES } from "@/data/mockKnowledge";
import { KnowledgeBlockCard } from "@/components/knowledge/kb/KnowledgeBlockCard";
import { CategoryTabs } from "@/components/knowledge/kb/CategoryTabs";
import {
  KnowledgeFilters,
  KbFilters,
  EMPTY_FILTERS,
} from "@/components/knowledge/kb/KnowledgeFilters";
import { KnowledgeBlockForm } from "@/components/knowledge/kb/KnowledgeBlockForm";
import { InheritanceViewer } from "@/components/knowledge/kb/InheritanceViewer";
import { cn } from "@/lib/utils";
import { blockAppliesToProperty } from "@/lib/knowledgeUtils";
import { toast } from "@/hooks/use-toast";

const KnowledgePage = () => {
  const [blocks, setBlocks] = useState<KnowledgeBlock[]>(mockKnowledgeBlocks);
  const [filters, setFilters] = useState<KbFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<"all" | "property">("all");
  const [compiledProperty, setCompiledProperty] = useState(KB_PROPERTIES[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<KnowledgeBlock | null>(null);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return blocks.filter((b) => {
      if (filters.category !== "all" && b.category !== filters.category) return false;
      if (filters.scope !== "all" && b.scopeType !== filters.scope) return false;
      if (filters.appliesTo !== "all") {
        const prop = KB_PROPERTIES.find((p) => p.id === filters.appliesTo);
        if (prop) {
          if (!blockAppliesToProperty(b, prop)) return false;
        } else if (b.scopeId !== filters.appliesTo) {
          return false;
        }
      }
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const hay = `${b.title} ${b.content} ${b.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [blocks, filters]);

  // conflict detection: 2+ blocks at same scope+scopeId+category
  const conflicts = useMemo(() => {
    const map = new Map<string, number>();
    blocks
      .filter((b) => b.status === "active")
      .forEach((b) => {
        const key = `${b.scopeType}|${b.scopeId ?? ""}|${b.category}`;
        map.set(key, (map.get(key) ?? 0) + 1);
      });
    return Array.from(map.values()).filter((n) => n > 1).length;
  }, [blocks]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (block: KnowledgeBlock) => {
    setEditing(block);
    setDrawerOpen(true);
  };

  const handleSave = (block: KnowledgeBlock) => {
    setBlocks((prev) => {
      const exists = prev.some((b) => b.id === block.id);
      return exists ? prev.map((b) => (b.id === block.id ? block : b)) : [block, ...prev];
    });
    toast({ title: editing ? "Block updated" : "Block created", description: block.title });
  };

  const handleDelete = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    toast({ title: "Block deleted" });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.scope !== "all" ||
    filters.appliesTo !== "all" ||
    filters.search.trim() !== "";

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
            <p className="text-sm text-muted-foreground">
              Operational procedures and company policies
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Knowledge Block
          </Button>
        </div>

        {/* Conflict banner */}
        {conflicts > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2.5 text-sm text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            Conflict detected: {conflicts} category{conflicts > 1 ? "ies" : ""} with multiple
            blocks at the same scope level.
          </div>
        )}

        {/* Filters */}
        <KnowledgeFilters filters={filters} onChange={setFilters} />

        {/* View toggle + tabs */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {view === "all" ? (
            <CategoryTabs
              blocks={blocks}
              active={filters.category}
              onChange={(c) => setFilters({ ...filters, category: c as "all" | KnowledgeCategory })}
            />
          ) : (
            <div />
          )}
          <div className="flex shrink-0 rounded-lg border border-border p-0.5">
            <button
              onClick={() => setView("all")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                view === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" /> All Blocks
            </button>
            <button
              onClick={() => setView("property")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
                view === "property" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Home className="h-4 w-4" /> View by Property
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : view === "property" ? (
          <InheritanceViewer
            propertyId={compiledProperty}
            onPropertyChange={setCompiledProperty}
            allBlocks={blocks}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            search={filters.search}
            onClear={() => setFilters(EMPTY_FILTERS)}
            onCreate={openCreate}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((block, i) => (
              <KnowledgeBlockCard
                key={block.id}
                block={block}
                allBlocks={blocks}
                index={i}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <KnowledgeBlockForm
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        editing={editing}
        allBlocks={blocks}
        onSave={handleSave}
      />
    </MainLayout>
  );
};

function EmptyState({
  hasFilters,
  search,
  onClear,
  onCreate,
}: {
  hasFilters: boolean;
  search: string;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/30" />
      {hasFilters ? (
        <>
          <h3 className="text-lg font-medium text-foreground">
            {search.trim() ? `No results for "${search}"` : "No matching blocks"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Try different keywords or clear the filters.
          </p>
          <Button variant="outline" onClick={onClear}>
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-foreground">No knowledge blocks yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start by creating a company-wide procedure.
          </p>
          <Button onClick={onCreate}>
            <Plus className="mr-1.5 h-4 w-4" /> Create First Block
          </Button>
        </>
      )}
    </div>
  );
}

export default KnowledgePage;
