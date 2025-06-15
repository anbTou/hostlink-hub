
import { useState, useEffect } from 'react';
import { Contact } from '@/components/inbox/ContactList';

// Extended contact interface with phone and additional fields
export interface ExtendedContact extends Contact {
  phone?: string;
  preferences?: string;
  tags?: string[];
  createdAt: string;
  lastContact?: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<ExtendedContact[]>([]);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Initialize with some sample data
      const sampleContacts: ExtendedContact[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          previousStays: [
            { propertyName: 'Ocean View Villa', date: '2024-05-15' },
            { propertyName: 'Mountain Cabin', date: '2024-03-10' }
          ],
          notes: 'Prefers early check-in. Allergic to cats.',
          preferences: 'Ground floor rooms, quiet area',
          tags: ['VIP', 'Repeat Guest'],
          createdAt: '2024-01-15T10:00:00.000Z',
          lastContact: '2024-05-20T14:30:00.000Z'
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 987-6543',
          previousStays: [
            { propertyName: 'Downtown Loft', date: '2024-04-20' }
          ],
          notes: 'Business traveler. Often extends stays.',
          preferences: 'High-speed WiFi, workspace area',
          tags: ['Business'],
          createdAt: '2024-02-01T09:15:00.000Z',
          lastContact: '2024-04-25T11:00:00.000Z'
        },
        {
          id: '3',
          name: 'Emma Rodriguez',
          email: 'emma.rodriguez@email.com',
          phone: '+1 (555) 456-7890',
          previousStays: [],
          notes: 'First-time guest. Celebrating anniversary.',
          preferences: 'Romantic setting, champagne welcome',
          tags: ['New Guest', 'Special Occasion'],
          createdAt: '2024-06-01T16:20:00.000Z'
        }
      ];
      setContacts(sampleContacts);
      localStorage.setItem('contacts', JSON.stringify(sampleContacts));
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contactData: Omit<ExtendedContact, 'id' | 'createdAt'>) => {
    const newContact: ExtendedContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<ExtendedContact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const findContactByEmail = (email: string) => {
    return contacts.find(contact => contact.email.toLowerCase() === email.toLowerCase());
  };

  const addStayToContact = (contactId: string, stay: { propertyName: string; date: string }) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, previousStays: [...contact.previousStays, stay] }
        : contact
    ));
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    findContactByEmail,
    addStayToContact
  };
}
