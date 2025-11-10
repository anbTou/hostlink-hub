import { useState } from "react";
import { useSavedViews } from "@/hooks/useSavedViews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Trash2, Edit, PlusCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SavedViewsListProps {
  onSelectView: (filters: any) => void;
  onCreateView: () => void;
  activeViewId?: string;
  collapsed?: boolean;
}

export const SavedViewsList = ({ 
  onSelectView, 
  onCreateView, 
  activeViewId,
  collapsed = false 
}: SavedViewsListProps) => {
  const { savedViews, loading, deleteSavedView } = useSavedViews();

  if (loading) {
    return (
      <div className="space-y-2 px-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className={cn(
        "flex items-center justify-between px-3 py-2",
        collapsed && "justify-center"
      )}>
        {!collapsed && (
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saved Views
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onCreateView}
          title="Create saved view"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      {savedViews.length === 0 && !collapsed && (
        <p className="text-xs text-muted-foreground px-3 py-2">
          No saved views yet. Create one by applying filters and clicking the save button.
        </p>
      )}

      <div className="space-y-1">
        {savedViews.map((view) => {
          const Icon = (LucideIcons as any)[view.icon || 'Bookmark'];
          const isActive = activeViewId === view.id;
          
          // Calculate count based on filters (mock for now)
          const count = Math.floor(Math.random() * 20);

          return (
            <div
              key={view.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer group",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary",
                collapsed && "justify-center"
              )}
              onClick={() => onSelectView(view.filters)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm truncate">{view.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSavedView(view.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
