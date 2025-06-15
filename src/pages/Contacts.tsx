
import { MainLayout } from "@/components/layout/MainLayout";
import { ContactList } from "@/components/inbox/ContactList";
import { useContacts } from "@/hooks/useContacts";
import { useState } from "react";
import { ExtendedContact } from "@/hooks/useContacts";

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useContacts();
  const [selectedContactId, setSelectedContactId] = useState<string>();

  const handleSelectContact = (contact: ExtendedContact) => {
    setSelectedContactId(contact.id);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your guest contacts and communication history
          </p>
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
