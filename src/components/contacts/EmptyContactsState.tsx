
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyContactsStateProps {
  hasContacts: boolean;
  hasSearchQuery: boolean;
  searchQuery?: string;
  onAddContact?: () => void;
}

export function EmptyContactsState({
  hasContacts,
  hasSearchQuery,
  searchQuery,
  onAddContact
}: EmptyContactsStateProps) {
  if (!hasContacts) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-20" />
        <p>No contacts loaded</p>
        <p className="text-sm">Check console for debugging information</p>
        {onAddContact && (
          <Button 
            className="mt-4" 
            onClick={onAddContact}
          >
            Add Your First Contact
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
      <User className="h-12 w-12 mb-4 opacity-20" />
      <p>No contacts found</p>
      {hasSearchQuery ? (
        <p className="text-sm">Try adjusting your search</p>
      ) : (
        <p className="text-sm">Click "Add Contact" to get started</p>
      )}
    </div>
  );
}
