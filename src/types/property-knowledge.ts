
export interface MediaFile {
  id: string;
  filename: string;
  type: 'document' | 'image' | 'video' | 'audio';
  url: string;
  size: number;
  uploadedAt: string;
}

export interface ContentSource {
  filename?: string;
  uploadedAt?: string;
  generatedByAI?: boolean;
  mediaFiles?: MediaFile[];
  extractedFrom?: string[];
}

export interface Property {
  id: string;
  name: string;
  type: "villa" | "apartment" | "house" | "cabin" | "hotel";
  address?: string;
  isDefault?: boolean;
}

export interface KnowledgeBlock {
  id: string;
  title: string;
  content: string;
  category: "property" | "policies" | "local" | "custom" | "safety" | "amenities" | "checkin" | "emergency";
  lastUpdated: string;
  source?: ContentSource;
  tags?: string[];
  status: "draft" | "reviewed" | "approved";
  guestPersona?: "family" | "business" | "romantic" | "group" | "all";
  seasonal?: "summer" | "winter" | "spring" | "fall" | "all";
  priority: "high" | "medium" | "low";
  aiConfidence?: number;
  propertyId?: string; // Link knowledge blocks to specific properties
}

export interface PropertyTemplate {
  id: string;
  name: string;
  type: "villa" | "apartment" | "house" | "cabin" | "hotel";
  requiredCategories: string[];
  suggestedTags: string[];
}

export interface ContentGap {
  category: string;
  description: string;
  importance: "critical" | "important" | "nice-to-have";
  suggestedContent?: string;
}

export interface AIProcessingResult {
  extractedBlocks: KnowledgeBlock[];
  detectedGaps: ContentGap[];
  qualityScore: number;
  suggestions: string[];
}
