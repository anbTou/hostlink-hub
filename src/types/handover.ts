export type HandoverCategory = "guest_issues" | "cleaning" | "maintenance" | "office";
export type HandoverStatus = "open" | "completed";

export type HandoverActivityAction =
  | "created"
  | "edited"
  | "assigned"
  | "unassigned"
  | "urgent_on"
  | "urgent_off"
  | "completed"
  | "reopened"
  | "notes"
  | "category"
  | "carried_over";

export interface HandoverActivity {
  id: string;
  action: HandoverActivityAction;
  user: string; // display name ("System" for automatic entries)
  timestamp: string; // ISO
  details?: string;
}

export interface HandoverItem {
  id: string;
  date: string; // YYYY-MM-DD the item belongs to
  description: string;
  category: HandoverCategory;
  property_id?: string;
  conversation_id?: string;
  assigned_to?: string; // team member id
  is_urgent: boolean;
  status: HandoverStatus;
  completed_at?: string;
  completed_by?: string; // team member id
  notes?: string;
  created_by: string; // team member id
  created_at: string;
  updated_by: string;
  updated_at: string;
  carried_over_from_date?: string;
  activity_log: HandoverActivity[];
}

export interface HandoverConversationRef {
  id: string;
  guestName: string;
  propertyName: string;
  propertyId?: string;
  timestamp: string;
  preview: string;
}

export interface NewHandoverItemInput {
  description: string;
  category: HandoverCategory;
  property_id?: string;
  conversation_id?: string;
  assigned_to?: string;
  is_urgent?: boolean;
  notes?: string;
}
