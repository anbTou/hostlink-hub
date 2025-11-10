import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterOptions } from "@/types/inbox";
import * as LucideIcons from "lucide-react";

interface SaveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onSave: (name: string, icon: string) => void;
}

const iconOptions = [
  'Bookmark', 'Star', 'Flag', 'Tag', 'Filter', 
  'Inbox', 'Mail', 'MessageSquare', 'Users', 'Home'
];

export const SaveViewDialog = ({ open, onOpenChange, filters, onSave }: SaveViewDialogProps) => {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Bookmark");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedIcon);
      setName("");
      setSelectedIcon("Bookmark");
      onOpenChange(false);
    }
  };

  const getActiveFiltersDescription = () => {
    const parts: string[] = [];
    
    if (filters.platforms.length > 0) {
      parts.push(`Channels: ${filters.platforms.join(', ')}`);
    }
    if (filters.priority.length > 0) {
      parts.push(`Priority: ${filters.priority.join(', ')}`);
    }
    if (filters.tags.length > 0) {
      parts.push(`Tags: ${filters.tags.join(', ')}`);
    }
    if (filters.isUnread !== undefined) {
      parts.push(filters.isUnread ? 'Unread only' : 'Read only');
    }
    if (filters.hasAttachments !== undefined) {
      parts.push(filters.hasAttachments ? 'With attachments' : 'No attachments');
    }
    if (filters.assignedTo) {
      parts.push(`Assigned to: ${filters.assignedTo}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save View</DialogTitle>
          <DialogDescription>
            Create a reusable view with your current filters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="view-name">View Name</Label>
            <Input
              id="view-name"
              placeholder="e.g., Airbnb + Urgent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="view-icon">Icon</Label>
            <Select value={selectedIcon} onValueChange={setSelectedIcon}>
              <SelectTrigger id="view-icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((iconName) => {
                  const Icon = (LucideIcons as any)[iconName];
                  return (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{iconName}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Active Filters</Label>
            <p className="text-sm bg-muted p-3 rounded-lg">
              {getActiveFiltersDescription()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
