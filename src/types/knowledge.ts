export type KnowledgeCategory =
  | "general"
  | "checkin"
  | "cancellation"
  | "extras"
  | "country"
  | "property-type";

export type KnowledgeScope = "company" | "country" | "property-type" | "property";

export type KnowledgeStatus = "active" | "draft" | "archived";

export type PriceUnit =
  | "per night"
  | "per stay"
  | "per person"
  | "per person per night"
  | "one-time";

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  unit: PriceUnit;
  description?: string;
  availableAt: string[]; // property ids or ["all"]
  conditions?: string;
}

export interface CheckinStructured {
  checkInTime: string;
  checkOutTime: string;
  earlyCheckIn: boolean;
  earlyCheckInCost?: number;
  earlyCheckInConditions?: string;
  lateCheckOut: boolean;
  lateCheckOutCost?: number;
  lateCheckOutConditions?: string;
  keyDelivery?: "Lockbox" | "Smart Lock" | "In-person" | "Reception" | "Key Safe";
  accessCode?: string;
  showCodeToTeam?: boolean;
}

export interface CancellationStructured {
  policyName?: string;
  freeWindowValue?: number;
  freeWindowUnit?: "hours" | "days";
  partialRefund?: boolean;
  partialRefundPercent?: number;
  partialRefundWindow?: string;
  noRefund?: string;
  channelNotes?: string;
  exceptionsText?: string;
}

export interface StructuredData {
  checkin?: CheckinStructured;
  cancellation?: CancellationStructured;
  extras?: ExtraItem[];
}

export interface KnowledgeBlock {
  id: string;
  title: string;
  category: KnowledgeCategory;
  scopeType: KnowledgeScope;
  /** country name, property type, or property id depending on scopeType */
  scopeId?: string;
  content: string;
  structuredData?: StructuredData;
  tags: string[];
  status: KnowledgeStatus;
  /** id of the parent block this overrides, if it is an exception */
  overridesId?: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  general: "General Procedures",
  checkin: "Check-in & Check-out",
  cancellation: "Cancellation & Refunds",
  extras: "Extras & Fees",
  country: "Country Procedures",
  "property-type": "Property Type Procedures",
};

export const SCOPE_CONFIG: Record<
  KnowledgeScope,
  { label: string; icon: string; bg: string; text: string; ring: string }
> = {
  company: {
    label: "Company",
    icon: "🏢",
    bg: "#EFF6FF",
    text: "#1D4ED8",
    ring: "#BFDBFE",
  },
  country: {
    label: "Country",
    icon: "🌍",
    bg: "#ECFDF5",
    text: "#059669",
    ring: "#A7F3D0",
  },
  "property-type": {
    label: "Property Type",
    icon: "🏷",
    bg: "#F5F3FF",
    text: "#7C3AED",
    ring: "#DDD6FE",
  },
  property: {
    label: "Property",
    icon: "🏠",
    bg: "#FFF7ED",
    text: "#EA580C",
    ring: "#FED7AA",
  },
};

export const STATUS_CONFIG: Record<
  KnowledgeStatus,
  { label: string; color: string }
> = {
  active: { label: "Active", color: "#10B981" },
  draft: { label: "Draft", color: "#F59E0B" },
  archived: { label: "Archived", color: "#9CA3AF" },
};

export const COUNTRIES = [
  "Portugal",
  "Spain",
  "France",
  "Italy",
  "Greece",
  "UK",
  "USA",
];

export const PROPERTY_TYPES = [
  "Villa",
  "Apartment",
  "Studio",
  "Cabin",
  "House",
  "Penthouse",
];

export const PRICE_UNITS: PriceUnit[] = [
  "per night",
  "per stay",
  "per person",
  "per person per night",
  "one-time",
];
