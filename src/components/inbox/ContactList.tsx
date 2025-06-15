import { useState } from "react";
import { User, Mail, Calendar, Clock, FileText, ChevronDown, ChevronUp, Search, Plus, Edit, Trash2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ExtendedContact } from "@/hooks/useContacts";
import { ContactForm } from "@/components/contacts/ContactForm";

// Updated Contact interface to match ExtendedContact
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  previousStays: {
    propertyName: string;
    date: string;
  }[];
  notes: string;
  preferences?: string;
  tags?: string[];
  createdAt: string;
  lastContact?: string;
}

interface ContactListProps {
  contacts: ExtendedContact[];
  onSelectContact?: (contact: ExtendedContact) => void;
  selectedContactId?: string;
  onAddContact?: (contact: Omit<ExtendedContact, 'id' | 'createdAt'>) => void;
  onUpdateContact?: (id: string, updates: Partial<ExtendedContact>) => void;
  onDeleteContact?: (id: string) => void;
}

export function ContactList({
  contacts,
  onSelectContact,
  selectedContactId,
  onAddContact,
  onUpdateContact,
  onDeleteContact
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedContactId, setExpandedContactId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<ExtendedContact | null>(null);

  console.log('ContactList: Received contacts:', contacts?.length || 0, contacts);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchQuery))
  );

  console.log('ContactList: Filtered contacts:', filteredContacts.length);

  const toggleContactDetails = (contactId: string) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  const handleAddContact = (contactData: Omit<ExtendedContact, 'id' | 'createdAt'>) => {
    onAddContact?.(contactData);
    setShowAddForm(false);
  };

  const handleEditContact = (contactData: Omit<ExtendedContact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      onUpdateContact?.(editingContact.id, contactData);
      setEditingContact(null);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      onDeleteContact?.(contactId);
      setExpandedContactId(null);
    }
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Contacts</h2>
          {onAddContact && (
            <Button 
              size="sm" 
              onClick={() => setShowAddForm(true)}
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
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Debug: {contacts?.length || 0} total contacts, {filteredContacts.length} filtered
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {!contacts || contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>No contacts loaded</p>
            <p className="text-sm">Check console for debugging information</p>
            {onAddContact && (
              <Button 
                className="mt-4" 
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Contact
              </Button>
            )}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>No contacts found</p>
            {searchQuery ? (
              <p className="text-sm">Try adjusting your search</p>
            ) : (
              <p className="text-sm">Click "Add Contact" to get started</p>
            )}
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
                      {onUpdateContact && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContact(contact);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeleteContact && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
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
                          toggleContactDetails(contact.id);
                        }}
                      >
                        {expandedContactId === contact.id ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {expandedContactId === contact.id && (
                    <div className="mt-3 pl-12 pr-2 pb-2">
                      {contact.preferences && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Preferences</h4>
                          <p className="text-sm">{contact.preferences}</p>
                        </div>
                      )}
                      
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
                      
                      {contact.notes && (
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
                          <Textarea 
                            className="min-h-[80px] text-sm"
                            value={contact.notes}
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSave={handleAddContact}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm
              contact={editingContact}
              onSave={handleEditContact}
              onCancel={() => setEditingContact(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
