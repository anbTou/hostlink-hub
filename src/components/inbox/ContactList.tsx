
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExtendedContact } from "@/hooks/useContacts";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactListHeader } from "@/components/contacts/ContactListHeader";
import { ContactItem } from "@/components/contacts/ContactItem";
import { EmptyContactsState } from "@/components/contacts/EmptyContactsState";

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
    onDeleteContact?.(contactId);
    setExpandedContactId(null);
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      <ContactListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddContact={onAddContact ? () => setShowAddForm(true) : undefined}
        totalContacts={contacts?.length || 0}
        filteredCount={filteredContacts.length}
      />
      
      <div className="flex-1 overflow-y-auto">
        {!contacts || contacts.length === 0 || filteredContacts.length === 0 ? (
          <EmptyContactsState
            hasContacts={!!(contacts && contacts.length > 0)}
            hasSearchQuery={!!searchQuery}
            searchQuery={searchQuery}
            onAddContact={onAddContact ? () => setShowAddForm(true) : undefined}
          />
        ) : (
          <ul>
            {filteredContacts.map(contact => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isSelected={selectedContactId === contact.id}
                isExpanded={expandedContactId === contact.id}
                onSelect={onSelectContact}
                onToggleExpanded={toggleContactDetails}
                onEdit={onUpdateContact ? setEditingContact : undefined}
                onDelete={onDeleteContact ? handleDeleteContact : undefined}
              />
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
