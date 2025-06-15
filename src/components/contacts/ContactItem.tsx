
import { Mail, Phone, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExtendedContact } from "@/hooks/useContacts";
import { ContactDetails } from "./ContactDetails";

interface ContactItemProps {
  contact: ExtendedContact;
  isSelected?: boolean;
  isExpanded: boolean;
  onSelect?: (contact: ExtendedContact) => void;
  onToggleExpanded: (contactId: string) => void;
  onEdit?: (contact: ExtendedContact) => void;
  onDelete?: (contactId: string) => void;
}

export function ContactItem({
  contact,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpanded,
  onEdit,
  onDelete
}: ContactItemProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      onDelete?.(contact.id);
    }
  };

  return (
    <li className={`border-b border-border transition-colors ${
      isSelected ? "bg-accent" : "hover:bg-muted/50"
    }`}>
      <div 
        className="p-4 cursor-pointer"
        onClick={() => onSelect && onSelect(contact)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                {contact.name.charAt(0)}
              </div>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{contact.name}</h3>
                {contact.tags && contact.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Mail className="h-3.5 w-3.5 mr-1" />
                <span>{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(contact);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(contact.id);
              }}
            >
              {isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
        
        {isExpanded && <ContactDetails contact={contact} />}
      </div>
    </li>
  );
}
