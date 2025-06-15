
import { MainLayout } from "@/components/layout/MainLayout";
import { ContactList } from "@/components/inbox/ContactList";
import { useContacts } from "@/hooks/useContacts";
import { useState } from "react";
import { ExtendedContact } from "@/hooks/useContacts";
import { Button } from "@/components/ui/button";

export default function Contacts() {
  const { contacts, isLoading, addContact, updateContact, deleteContact, resetToSampleData } = useContacts();
  const [selectedContactId, setSelectedContactId] = useState<string>();

  console.log('Contacts page: contacts loaded:', contacts.length, 'isLoading:', isLoading);

  const handleSelectContact = (contact: ExtendedContact) => {
    setSelectedContactId(contact.id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-pulse text-lg">Loading contacts...</div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground">
                Manage your guest contacts and communication history
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetToSampleData}
                className="text-xs"
              >
                Reset Data
              </Button>
              <div className="text-xs text-muted-foreground flex items-center">
                {contacts.length} contacts loaded
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg bg-card h-[calc(100vh-200px)]">
          <ContactList
            contacts={contacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
            onAddContact={addContact}
            onUpdateContact={updateContact}
            onDeleteContact={deleteContact}
          />
        </div>
      </div>
    </MainLayout>
  );
}
