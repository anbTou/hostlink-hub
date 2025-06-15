
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContactListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddContact?: () => void;
  totalContacts: number;
  filteredCount: number;
}

export function ContactListHeader({
  searchQuery,
  onSearchChange,
  onAddContact,
  totalContacts,
  filteredCount
}: ContactListHeaderProps) {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Contacts</h2>
        {onAddContact && (
          <Button 
            size="sm" 
            onClick={onAddContact}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        )}
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search contacts..." 
          className="pl-9" 
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)} 
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Debug: {totalContacts} total contacts, {filteredCount} filtered
      </div>
    </div>
  );
}
