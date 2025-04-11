
import { useState } from "react";
import { User, Mail, Calendar, Clock, FileText, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Types for the contact information
export interface Contact {
  id: string;
  name: string;
  email: string;
  previousStays: {
    propertyName: string;
    date: string; // ISO date string
  }[];
  notes: string;
}

interface ContactListProps {
  contacts: Contact[];
  onSelectContact?: (contact: Contact) => void;
  selectedContactId?: string;
}

export function ContactList({
  contacts,
  onSelectContact,
  selectedContactId
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContactDetails = (contactId: string) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-medium mb-4">Contacts</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-9" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>No contacts found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        ) : (
          <ul>
            {filteredContacts.map(contact => (
              <li 
                key={contact.id} 
                className={`border-b border-border transition-colors ${
                  selectedContactId === contact.id ? "bg-accent" : "hover:bg-muted/50"
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => onSelectContact && onSelectContact(contact)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                          {contact.name.charAt(0)}
                        </div>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          <span>{contact.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleContactDetails(contact.id);
                      }}
                    >
                      {expandedContactId === contact.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  
                  {expandedContactId === contact.id && (
                    <div className="mt-3 pl-12 pr-2 pb-2">
                      {contact.previousStays.length > 0 ? (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Previous Stays</h4>
                          {contact.previousStays.map((stay, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm mb-1">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{format(new Date(stay.date), "MMM d, yyyy")}</span>
                              </Badge>
                              <span>{stay.propertyName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground mb-3">No previous stays</div>
                      )}
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
                        <Textarea 
                          className="min-h-[80px] text-sm"
                          value={contact.notes}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
