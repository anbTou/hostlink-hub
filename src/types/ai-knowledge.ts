// Standardized, chatbot-ready knowledge layer compiled from Property Info
// and the scoped Knowledge Base.

export type FieldSource = "auto" | "manual";

export interface AiField {
  value: string;
  source: FieldSource;
  /** Human readable origin of an auto-filled value, e.g. "Property Info → Basic". */
  autoSourceRef?: string;
  /** Value produced by the last generation — used by "Reset to auto". */
  autoValue?: string;
  updatedAt?: string;
}

export const emptyField = (autoSourceRef?: string): AiField => ({
  value: "",
  source: "auto",
  autoSourceRef,
  autoValue: "",
});

export const autoField = (value: string, autoSourceRef?: string): AiField => ({
  value,
  source: "auto",
  autoSourceRef,
  autoValue: value,
});

export interface AiRoomRow {
  id: string;
  name: string;
  bed: string;
  ensuite: boolean;
  notes?: string;
}

export interface AiBathroomRow {
  id: string;
  name: string;
  kind: string; // Full / Shower only / WC
  notes?: string;
}

export interface AiAmenity {
  id: string;
  group: string;
  label: string;
  available: boolean;
  details: AiField;
  custom?: boolean;
}

export type FieldMap = Record<string, AiField>;

export interface AiPropertyCard {
  propertyId: string;
  propertyName: string;
  lastGeneratedAt: string;
  basic: FieldMap;
  rooms: AiRoomRow[];
  bathrooms: AiBathroomRow[];
  amenities: AiAmenity[];
  wifi: FieldMap;
  checkin: FieldMap;
  rules: FieldMap;
  description: FieldMap;
  guardrails: FieldMap;
}

export type SectionKey =
  | "basic"
  | "rooms"
  | "amenities"
  | "wifi"
  | "checkin"
  | "rules"
  | "description"
  | "guardrails";

export interface FieldDef {
  key: string;
  label: string;
  required?: boolean;
  type?: "text" | "textarea";
  placeholder?: string;
}

export interface SectionDef {
  key: SectionKey;
  title: string;
  icon: string;
  fields?: FieldDef[];
}

export const AMENITY_GROUPS = [
  "Outdoor & Leisure",
  "Climate & Comfort",
  "Appliances",
  "Entertainment",
  "Building & Access",
] as const;

export const SECTIONS: SectionDef[] = [
  {
    key: "basic",
    title: "Basic property information",
    icon: "🏠",
    fields: [
      { key: "name", label: "Property name", required: true },
      { key: "reference", label: "Internal reference" },
      { key: "address", label: "Full address", required: true },
      { key: "country", label: "Country", required: true },
      { key: "type", label: "Property type", required: true },
      { key: "area", label: "Area (m²)" },
      { key: "floors", label: "Number of floors" },
      { key: "floorLocation", label: "Floor location (apartments)" },
      { key: "maxGuests", label: "Maximum guests", required: true },
      { key: "shortSummary", label: "One-line summary", type: "textarea", required: true },
    ],
  },
  { key: "rooms", title: "Bedrooms & bathrooms", icon: "🛏" },
  { key: "amenities", title: "Amenities", icon: "✨" },
  {
    key: "wifi",
    title: "WiFi & connectivity",
    icon: "📶",
    fields: [
      { key: "network", label: "Network name (SSID)", required: true },
      { key: "password", label: "Password", required: true },
      { key: "coverage", label: "Coverage notes" },
      { key: "speed", label: "Speed" },
    ],
  },
  {
    key: "checkin",
    title: "Check-in & check-out",
    icon: "🔑",
    fields: [
      { key: "checkInTime", label: "Check-in time", required: true },
      { key: "checkOutTime", label: "Check-out time", required: true },
      { key: "accessMethod", label: "Access method", required: true },
      { key: "arrivalInstructions", label: "Arrival instructions", type: "textarea", required: true },
      { key: "earlyCheckIn", label: "Early check-in policy", type: "textarea" },
      { key: "lateCheckOut", label: "Late check-out policy", type: "textarea" },
      { key: "checkOutInstructions", label: "Check-out instructions", type: "textarea" },
      { key: "emergencyContact", label: "Emergency contact", required: true },
    ],
  },
  {
    key: "rules",
    title: "House rules",
    icon: "📋",
    fields: [
      { key: "pets", label: "Pets", required: true },
      { key: "smoking", label: "Smoking", required: true },
      { key: "events", label: "Parties & events", required: true },
      { key: "quietHours", label: "Quiet hours" },
      { key: "additionalRules", label: "Additional rules", type: "textarea" },
    ],
  },
  {
    key: "description",
    title: "Property description for chatbot",
    icon: "💬",
    fields: [
      { key: "shortDescription", label: "Short description", type: "textarea", required: true },
      { key: "sellingPoints", label: "Selling points", type: "textarea", required: true },
      { key: "warnings", label: "Things guests should know", type: "textarea" },
      { key: "neighbourhood", label: "Neighbourhood", type: "textarea", required: true },
    ],
  },
  {
    key: "guardrails",
    title: "Chatbot guardrails",
    icon: "🛡",
    fields: [
      { key: "bookingConfirmation", label: "Can confirm bookings?", required: true },
      { key: "accessCodes", label: "Can share access codes?", required: true },
      { key: "pricing", label: "Can quote pricing?", required: true },
      { key: "discounts", label: "Can offer discounts?", required: true },
      { key: "escalation", label: "Escalate to human on", type: "textarea", required: true },
      { key: "tone", label: "Tone of voice", required: true },
      { key: "languages", label: "Languages" },
      { key: "fallback", label: "Fallback message", type: "textarea", required: true },
    ],
  },
];

export interface GlobalRule {
  id: string;
  scope: "company" | "country";
  country?: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  sourceBlockId: string;
  chatbotInstruction: string;
}
