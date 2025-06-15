
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { ExtendedContact } from '@/hooks/useContacts';

interface ContactFormProps {
  contact?: ExtendedContact;
  onSave: (contact: Omit<ExtendedContact, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, onSave, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    notes: contact?.notes || '',
    preferences: contact?.preferences || '',
    tags: contact?.tags || [],
    previousStays: contact?.previousStays || [],
    lastContact: contact?.lastContact
  });

  const [newTag, setNewTag] = useState('');
  const [newStay, setNewStay] = useState({ propertyName: '', date: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addStay = () => {
    if (newStay.propertyName.trim() && newStay.date) {
      setFormData(prev => ({
        ...prev,
        previousStays: [...prev.previousStays, newStay]
      }));
      setNewStay({ propertyName: '', date: '' });
    }
  };

  const removeStay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousStays: prev.previousStays.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="preferences">Guest Preferences</Label>
        <Textarea
          id="preferences"
          value={formData.preferences}
          onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
          placeholder="Room preferences, special requests, etc."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional information about this contact"
          rows={3}
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Previous Stays</Label>
        <div className="space-y-2 mb-2">
          {formData.previousStays.map((stay, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <span className="flex-1">{stay.propertyName}</span>
              <span className="text-sm text-muted-foreground">{stay.date}</span>
              <X 
                className="h-4 w-4 cursor-pointer" 
                onClick={() => removeStay(index)}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={newStay.propertyName}
            onChange={(e) => setNewStay(prev => ({ ...prev, propertyName: e.target.value }))}
            placeholder="Property name"
          />
          <div className="flex gap-2">
            <Input
              type="date"
              value={newStay.date}
              onChange={(e) => setNewStay(prev => ({ ...prev, date: e.target.value }))}
            />
            <Button type="button" variant="outline" size="sm" onClick={addStay}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
}
