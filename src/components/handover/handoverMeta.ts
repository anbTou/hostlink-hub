import { HandoverCategory } from "@/types/handover";

export interface CategoryMeta {
  id: HandoverCategory;
  label: string;
  emoji: string;
  /** Tailwind classes for the section's left border + badge */
  border: string;
  badge: string;
  dot: string;
}

export const HANDOVER_CATEGORIES: CategoryMeta[] = [
  {
    id: "guest_issues",
    label: "Guest Issues",
    emoji: "💬",
    border: "border-l-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    id: "cleaning",
    label: "Cleaning",
    emoji: "🧹",
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    emoji: "🔧",
    border: "border-l-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  {
    id: "office",
    label: "Office",
    emoji: "🏢",
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
];

export const getCategoryMeta = (id: HandoverCategory): CategoryMeta =>
  HANDOVER_CATEGORIES.find((c) => c.id === id) ?? HANDOVER_CATEGORIES[0];
