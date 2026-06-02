// Rich data model for the Property Info page (Hostsy)
// Data is mostly synced from a PMS/Channel Manager (read-only) with some
// internal Hostsy fields that are editable.

export type DataSource = "synced" | "internal";

export type PropertyType =
  | "villa"
  | "apartment"
  | "studio"
  | "house"
  | "cabin"
  | "hotel";

export interface SyncMeta {
  source: DataSource;
  provider?: string; // e.g. "BookingSync"
  lastUpdated: string; // ISO timestamp
}

export type ChannelStatus = "active" | "paused" | "not-listed";

export interface ChannelListing {
  channel: string; // Airbnb, Booking, VRBO, Expedia
  status: ChannelStatus;
  listingId?: string;
  lastSynced?: string; // ISO
  url?: string;
}

export interface RoomDetail {
  id: string;
  name: string;
  bed: string;
  ensuite: boolean;
  notes?: string;
}

export interface CommonArea {
  id: string;
  name: string;
  note?: string;
}

export interface Amenity {
  id: string;
  label: string;
  available: boolean;
  note?: string;
}

export interface AmenityCategory {
  category: string;
  items: Amenity[];
}

export interface ServiceItem {
  id: string;
  name: string;
  icon?: string;
  included?: string;
  extra?: string;
  provider?: string;
  contact?: string;
}

export interface LocalRecommendation {
  id: string;
  name: string;
  detail?: string; // cuisine / type
  distance?: string;
  note?: string;
  contact?: string;
}

export interface LocalCategory {
  id: string;
  label: string;
  icon: string;
  items: LocalRecommendation[];
}

export interface PropertyPhoto {
  id: string;
  url: string;
  caption?: string;
  source: DataSource;
}

export interface Contact {
  name: string;
  phone: string;
  role?: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  isDefault?: boolean;
  syncProvider: string;
  lastSyncedAt: string; // ISO
  syncFailed?: boolean;

  // Basic
  city: string;
  country: string;
  fullAddress: string;
  size?: string;
  coordinates?: { lat: number; lng: number };
  marketingDescription: string;
  fullDescription: string;
  keyFeatures: string[];
  externalIds: { channel: string; id: string }[];
  owner?: { name: string; contact: string; notes?: string };

  coverImage: string;

  // Arrival
  arrival: {
    checkInTime: string;
    accessMethod: string;
    accessCode?: string;
    arrivalInstructions: string;
    checkOutTime: string;
    checkOutInstructions: string;
    directions: string;
    publicTransport?: string;
    parking: { available: boolean; type?: string; cost?: string; notes?: string };
    localContacts: { emergency?: Contact; cleaning?: Contact; maintenance?: Contact };
  };

  // Accommodation
  accommodation: {
    maxGuests: number;
    bedrooms: number;
    beds: string;
    bathrooms: string;
    rooms: RoomDetail[];
    commonAreas: CommonArea[];
  };

  // Amenities
  amenities: AmenityCategory[];

  // Rules
  rules: {
    pets: string;
    petsFee?: string;
    smoking: string;
    events: string;
    quietHours?: string;
    maxOccupancy: number;
    additionalRules?: string;
    minAge?: string;
  };

  // Services
  services: ServiceItem[];

  // Local Area
  localArea: {
    syncedDescription: string;
    categories: LocalCategory[];
  };

  // Photos
  photos: PropertyPhoto[];

  // Channel status
  channels: ChannelListing[];
}

export const propertyTypeIcon: Record<PropertyType, string> = {
  villa: "🏡",
  apartment: "🏢",
  studio: "🏬",
  house: "🏠",
  cabin: "🛖",
  hotel: "🏨",
};
