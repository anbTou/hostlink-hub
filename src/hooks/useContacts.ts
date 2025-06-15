
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
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts from localStorage on mount
  useEffect(() => {
    console.log('useContacts: Loading contacts from localStorage...');
    
    try {
      const savedContacts = localStorage.getItem('contacts');
      console.log('useContacts: Raw localStorage data:', savedContacts);
      
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        console.log('useContacts: Parsed contacts:', parsedContacts);
        setContacts(parsedContacts);
      } else {
        console.log('useContacts: No saved contacts found, initializing with sample data');
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
        console.log('useContacts: Sample data initialized and saved');
      }
    } catch (error) {
      console.error('useContacts: Error loading contacts:', error);
      // Clear corrupted data and start fresh
      localStorage.removeItem('contacts');
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    if (!isLoading && contacts.length > 0) {
      console.log('useContacts: Saving contacts to localStorage:', contacts);
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts, isLoading]);

  const addContact = (contactData: Omit<ExtendedContact, 'id' | 'createdAt'>) => {
    const newContact: ExtendedContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    console.log('useContacts: Adding new contact:', newContact);
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<ExtendedContact>) => {
    console.log('useContacts: Updating contact:', id, updates);
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id: string) => {
    console.log('useContacts: Deleting contact:', id);
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const findContactByEmail = (email: string) => {
    return contacts.find(contact => contact.email.toLowerCase() === email.toLowerCase());
  };

  const addStayToContact = (contactId: string, stay: { propertyName: string; date: string }) => {
    console.log('useContacts: Adding stay to contact:', contactId, stay);
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, previousStays: [...contact.previousStays, stay] }
        : contact
    ));
  };

  const resetToSampleData = () => {
    console.log('useContacts: Resetting to sample data');
    localStorage.removeItem('contacts');
    window.location.reload();
  };

  console.log('useContacts: Current state - contacts:', contacts.length, 'isLoading:', isLoading);

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    findContactByEmail,
    addStayToContact,
    resetToSampleData
  };
}
