
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  totalStays: number;
  totalSpent: number;
  memberSince: string;
  preferredLanguage: string;
  vipStatus: 'none' | 'silver' | 'gold' | 'platinum';
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'villa' | 'studio';
}

export interface Booking {
  id: string;
  reservationCode: string;
  propertyId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: 'upcoming' | 'current' | 'past' | 'cancelled';
  platform: ConversationSource;
  totalAmount: number;
  currency: string;
}

export type InboxType = 'main' | 'private';

export interface ConversationThread {
  id: string;
  guest: Guest;
  messages: Message[];
  relatedBookings: Booking[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  assignedTo?: string;
  assignedToUser?: string; // User ID for private inbox assignment
  inboxType: InboxType;
  lastActivity: string;
  responseTime?: number;
  satisfactionScore?: number;
}

export interface AIInsight {
  type: 'sentiment' | 'urgency' | 'category' | 'language' | 'suggestion';
  value: string;
  confidence: number;
  details?: string;
}

export interface Message {
  id: string;
  threadId: string;
  text: string;
  sender: "user" | "contact" | "ai";
  timestamp: string;
  platform: ConversationSource;
  emailDetails?: EmailDetails;
  aiInsights?: AIInsight[];
  isRead: boolean;
  attachments?: Attachment[];
  translatedText?: string;
  originalLanguage?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: number;
}

export type ConversationSource = "email" | "booking" | "airbnb" | "whatsapp" | "vrbo" | "expedia";
export type ConversationStatus = "todo" | "followup" | "done" | "archived"; // @deprecated - Status system removed, kept for backward compatibility

export interface EmailDetails {
  to: string[];
  from: string;
  subject: string;
  cc?: string[];
  bcc?: string[];
}

export interface FilterOptions {
  status: ConversationStatus | "all";
  platforms: ConversationSource[];
  dateRange: {
    start?: string;
    end?: string;
  };
  priority: ('low' | 'medium' | 'high' | 'urgent')[];
  assignedTo?: string;
  teams: string[];
  properties: string[];
  slaHours?: number;
  tags: string[];
  hasAttachments?: boolean;
  isUnread?: boolean;
  inboxType?: InboxType;
}

export interface BulkAction {
  type: 'archive' | 'assign' | 'priority' | 'tag' | 'mark_read' | 'delete';
  value?: string;
}
