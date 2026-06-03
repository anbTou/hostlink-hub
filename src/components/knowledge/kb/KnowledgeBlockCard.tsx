import { useState } from "react";
import { KnowledgeBlock, STATUS_CONFIG } from "@/types/knowledge";
import { ScopeBadge } from "./ScopeBadge";
import {
  appliesToText,
  categoryLabel,
  getExceptions,
} from "@/lib/knowledgeUtils";
import { relativeTime, absoluteTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, FolderOpen, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { propertyName } from "@/data/mockKnowledge";

interface Props {
  block: KnowledgeBlock;
  allBlocks: KnowledgeBlock[];
  index?: number;
  onEdit: (block: KnowledgeBlock) => void;
  onDelete: (id: string) => void;
}

export function KnowledgeBlockCard({
  block,
  allBlocks,
  index = 0,
  onEdit,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[block.status];
  const exceptions = getExceptions(block, allBlocks);

  return (
    <div
      className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* actions */}
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          aria-label="Edit block"
          onClick={() => onEdit(block)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          aria-label="Delete block"
          onClick={() => onDelete(block.id)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* title + status */}
      <div className="flex items-start justify-between gap-3 pr-16">
        <h3 className="text-base font-semibold leading-snug text-foreground">
          {block.title}
        </h3>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: status.color }}>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
        {status.label}
      </div>

      {/* badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ScopeBadge
          scope={block.scopeType}
          detail={
            block.scopeType === "country" || block.scopeType === "property-type"
              ? block.scopeId
              : undefined
          }
        />
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#374151]">
          <FolderOpen className="h-3 w-3" />
          {categoryLabel(block)}
        </span>
      </div>

      {/* applies to */}
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Applies to:</span>{" "}
        {appliesToText(block)}
      </p>

      <div className="my-3 border-t border-border" />

      {/* content preview */}
      <p
        className={cn(
          "whitespace-pre-line text-sm text-foreground/90",
          !expanded && "line-clamp-3"
        )}
      >
        {block.content}
      </p>
      {block.content.length > 140 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {block.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {block.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] text-[#374151]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="my-3 border-t border-border" />

      {/* footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {exceptions.length > 0 ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                <Home className="h-3.5 w-3.5" />
                {exceptions.length} exception{exceptions.length > 1 ? "s" : ""}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
              <p className="mb-2 text-xs font-semibold text-foreground">
                Overridden for:
              </p>
              <ul className="space-y-1.5">
                {exceptions.map((ex) => (
                  <li key={ex.id} className="text-xs text-muted-foreground">
                    🏠 {propertyName(ex.scopeId)} —{" "}
                    <span className="text-foreground">{ex.title}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        ) : (
          <span />
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">Updated {relativeTime(block.updatedAt)}</span>
          </TooltipTrigger>
          <TooltipContent>{absoluteTime(block.updatedAt)}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
