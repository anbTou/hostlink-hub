
import { Archive, UserCheck, Flag, Tag, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BulkAction } from "@/types/inbox";

interface BulkActionBarProps {
  selectedCount: number;
  onAction: (action: BulkAction) => void;
  onClear: () => void;
}

export function BulkActionBar({ selectedCount, onAction, onClear }: BulkActionBarProps) {
  return (
    <div className="bg-primary/10 border-b border-border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedCount} conversation{selectedCount !== 1 ? 's' : ''} selected
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction({ type: 'archive' })}
              className="gap-2"
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction({ type: 'mark_read' })}
              className="gap-2"
            >
              <Eye className="h-3.5 w-3.5" />
              Mark Read
            </Button>
            
            <Select onValueChange={(value) => onAction({ type: 'priority', value })}>
              <SelectTrigger className="w-32 h-8">
                <Flag className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <Select onValueChange={(value) => onAction({ type: 'assign', value })}>
              <SelectTrigger className="w-32 h-8">
                <UserCheck className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="Assign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Smith</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="mike">Mike Wilson</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction({ type: 'delete' })}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
