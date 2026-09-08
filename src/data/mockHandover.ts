import { addDays, format, subDays } from "date-fns";
import { HandoverActivity, HandoverConversationRef, HandoverItem } from "@/types/handover";

export const toDateKey = (d: Date) => format(d, "yyyy-MM-dd");

/** Lightweight mirror of the inbox mock conversations for linking/search. */
export const handoverConversationRefs: HandoverConversationRef[] = [
  { id: "1", guestName: "Sarah Miller", propertyName: "Villa Serenity", propertyId: "p1", timestamp: "2026-03-23T10:30:00Z", preview: "Interested in booking your beachfront villa..." },
  { id: "2", guestName: "John Davis", propertyName: "Mountain Cabin", propertyId: "p3", timestamp: "2026-03-23T09:15:00Z", preview: "Question about the mountain cabin amenities..." },
  { id: "3", guestName: "Maria Rodriguez", propertyName: "Lakeside Cottage", timestamp: "2026-03-23T08:45:00Z", preview: "Check-in instructions please? Arriving at 3pm" },
  { id: "4", guestName: "Hans Weber", propertyName: "Downtown Apartment", propertyId: "p2", timestamp: "2026-03-22T22:10:00Z", preview: "Late checkout request" },
  { id: "5", guestName: "Emma Thompson", propertyName: "Villa Serenity", propertyId: "p1", timestamp: "2026-03-22T18:30:00Z", preview: "Need to cancel..." },
  { id: "6", guestName: "Luca Bianchi", propertyName: "Mountain Cabin", propertyId: "p3", timestamp: "2026-03-22T16:00:00Z", preview: "Wifi not working..." },
  { id: "7", guestName: "Yuki Tanaka", propertyName: "Downtown Apartment", propertyId: "p2", timestamp: "2026-03-22T14:20:00Z", preview: "Parking available?" },
  { id: "8", guestName: "François Dupont", propertyName: "Lakeside Cottage", timestamp: "2026-03-21T11:00:00Z", preview: "Merci..." },
  { id: "9", guestName: "Lisa Chen", propertyName: "Mountain Cabin", propertyId: "p3", timestamp: "2026-03-21T09:30:00Z", preview: "Pet-friendly?" },
  { id: "10", guestName: "Ahmed Hassan", propertyName: "Luxury Suite", timestamp: "2026-03-20T15:45:00Z", preview: "Invoice for expenses..." },
  { id: "11", guestName: "Claire Dubois", propertyName: "Villa Serenity", propertyId: "p1", timestamp: "2026-03-20T12:00:00Z", preview: "Pool issue..." },
  { id: "12", guestName: "Ravi Patel", propertyName: "Luxury Suite", timestamp: "2026-03-19T20:15:00Z", preview: "Late arrival..." },
];

export const getConversationRef = (id?: string) =>
  id ? handoverConversationRefs.find((c) => c.id === id) : undefined;

const NAMES: Record<string, string> = {
  "agent-ana": "Ana Costa",
  "agent-pedro": "Pedro Almeida",
  "agent-sofia": "Sofia Martins",
  "agent-joao": "João Ferreira",
  "agent-mariana": "Mariana Silva",
  "agent-tiago": "Tiago Santos",
  "agent-carolina": "Carolina Oliveira",
};

let seq = 0;
const at = (day: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

interface SeedInput {
  id: string;
  day: Date;
  description: string;
  category: HandoverItem["category"];
  property_id?: string;
  conversation_id?: string;
  assigned_to?: string;
  is_urgent?: boolean;
  notes?: string;
  created_by: string;
  created: string; // HH:mm
  done?: { by: string; time: string };
  edited?: { by: string; time: string; details?: string };
}

function seed(i: SeedInput): HandoverItem {
  const created_at = at(i.day, i.created);
  const log: HandoverActivity[] = [
    { id: `a${++seq}`, action: "created", user: NAMES[i.created_by], timestamp: created_at, details: "created this item" },
  ];
  let updated_at = created_at;
  let updated_by = i.created_by;
  if (i.assigned_to) {
    log.push({ id: `a${++seq}`, action: "assigned", user: NAMES[i.created_by], timestamp: created_at, details: `assigned to ${NAMES[i.assigned_to]}` });
  }
  if (i.is_urgent) {
    log.push({ id: `a${++seq}`, action: "urgent_on", user: NAMES[i.created_by], timestamp: created_at, details: "marked as urgent" });
  }
  if (i.edited) {
    const ts = at(i.day, i.edited.time);
    log.push({ id: `a${++seq}`, action: "notes", user: NAMES[i.edited.by], timestamp: ts, details: i.edited.details ?? "added notes" });
    updated_at = ts;
    updated_by = i.edited.by;
  }
  let completed_at: string | undefined;
  if (i.done) {
    completed_at = at(i.day, i.done.time);
    log.push({ id: `a${++seq}`, action: "completed", user: NAMES[i.done.by], timestamp: completed_at, details: "marked as completed" });
    updated_at = completed_at;
    updated_by = i.done.by;
  }
  return {
    id: i.id,
    date: toDateKey(i.day),
    description: i.description,
    category: i.category,
    property_id: i.property_id,
    conversation_id: i.conversation_id,
    assigned_to: i.assigned_to,
    is_urgent: !!i.is_urgent,
    status: i.done ? "completed" : "open",
    completed_at,
    completed_by: i.done?.by,
    notes: i.notes,
    created_by: i.created_by,
    created_at,
    updated_by,
    updated_at,
    activity_log: log.sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
  };
}

/**
 * Builds the seed keyed by date. Yesterday contains the items that will be
 * carried over by the client-side day-transition logic (still open at end of
 * day) plus a few completed ones that stay in the archive.
 */
export function buildHandoverSeed(today: Date): Record<string, HandoverItem[]> {
  const yesterday = subDays(today, 1);
  const twoDaysAgo = subDays(today, 2);

  const yesterdayItems: HandoverItem[] = [
    seed({ id: "h-lockout", day: yesterday, description: "Guest locked out — lockbox code not working", category: "guest_issues", property_id: "p1", conversation_id: "5", assigned_to: "agent-ana", is_urgent: true, created_by: "agent-ana", created: "20:15" }),
    seed({ id: "h-tap", day: yesterday, description: "Fix leaking tap in master bathroom", category: "maintenance", property_id: "p1", conversation_id: "1", assigned_to: "agent-pedro", is_urgent: true, notes: "The tap in the master bathroom has been dripping since yesterday. Guest mentioned it's keeping them awake at night. Plumber called, scheduled for tomorrow 10am.", created_by: "agent-ana", created: "17:30", edited: { by: "agent-pedro", time: "18:40", details: "added notes: plumber scheduled tomorrow 10am" } }),
    seed({ id: "h-toiletries", day: yesterday, description: "Restock toiletries — guest reported shampoo empty", category: "cleaning", property_id: "p2", conversation_id: "7", assigned_to: "agent-sofia", created_by: "agent-joao", created: "19:00" }),
    seed({ id: "h-irrigation-check", day: yesterday, description: "Confirm gardener visit for Villa Serenity", category: "office", property_id: "p1", assigned_to: "agent-ana", created_by: "agent-ana", created: "09:10", done: { by: "agent-ana", time: "15:20" } }),
    seed({ id: "h-y-clean", day: yesterday, description: "Mid-stay clean — Downtown Apartment", category: "cleaning", property_id: "p2", assigned_to: "agent-sofia", created_by: "agent-sofia", created: "08:05", done: { by: "agent-sofia", time: "12:45" } }),
    seed({ id: "h-y-guest", day: yesterday, description: "Send parking instructions to Yuki Tanaka", category: "guest_issues", property_id: "p2", conversation_id: "7", assigned_to: "agent-joao", created_by: "agent-joao", created: "14:30", done: { by: "agent-joao", time: "14:55" } }),
  ];

  const todayItems: HandoverItem[] = [
    // Guest issues
    seed({ id: "h-ac", day: today, description: "AC unit making loud noise, guest threatening bad review", category: "guest_issues", property_id: "p2", conversation_id: "4", assigned_to: "agent-pedro", is_urgent: true, created_by: "agent-pedro", created: "09:30" }),
    seed({ id: "h-late-checkout", day: today, description: "Late check-out request for Thursday", category: "guest_issues", property_id: "p3", conversation_id: "2", created_by: "agent-sofia", created: "10:00" }),
    seed({ id: "h-wifi", day: today, description: "Send WiFi password to guest (lost the welcome email)", category: "guest_issues", property_id: "p1", conversation_id: "6", assigned_to: "agent-sofia", created_by: "agent-ana", created: "09:05", done: { by: "agent-sofia", time: "09:45" } }),
    // Cleaning
    seed({ id: "h-deep-clean", day: today, description: "Deep clean before VIP arrival Saturday", category: "cleaning", property_id: "p1", created_by: "agent-ana", created: "08:00" }),
    seed({ id: "h-checkout-clean", day: today, description: "Post check-out clean", category: "cleaning", property_id: "p3", assigned_to: "agent-sofia", created_by: "agent-sofia", created: "08:10", done: { by: "agent-sofia", time: "14:00" } }),
    seed({ id: "h-pillowcases", day: today, description: "Replace stained pillowcases", category: "cleaning", property_id: "p1", assigned_to: "agent-sofia", created_by: "agent-ana", created: "08:20", done: { by: "agent-sofia", time: "10:30" } }),
    // Maintenance
    seed({ id: "h-irrigation", day: today, description: "Garden irrigation system not activating", category: "maintenance", property_id: "p1", created_by: "agent-joao", created: "07:00" }),
    seed({ id: "h-bulb", day: today, description: "Replace light bulb in hallway", category: "maintenance", property_id: "p2", assigned_to: "agent-joao", created_by: "agent-pedro", created: "09:00" }),
    seed({ id: "h-towel-rail", day: today, description: "Fix broken towel rail", category: "maintenance", property_id: "p3", assigned_to: "agent-pedro", created_by: "agent-ana", created: "08:40", done: { by: "agent-pedro", time: "11:30" } }),
    // Office
    seed({ id: "h-owner-call", day: today, description: "Call Villa Serenity owner — monthly report due", category: "office", property_id: "p1", assigned_to: "agent-ana", created_by: "agent-ana", created: "08:30" }),
    seed({ id: "h-photos", day: today, description: "Update Booking.com listing photos for Downtown Apt", category: "office", property_id: "p2", created_by: "agent-pedro", created: "09:00" }),
  ];

  const twoDaysAgoItems: HandoverItem[] = [
    seed({ id: "h-2-pool", day: twoDaysAgo, description: "Pool pump inspection", category: "maintenance", property_id: "p1", conversation_id: "11", assigned_to: "agent-pedro", created_by: "agent-ana", created: "10:00", done: { by: "agent-pedro", time: "16:10" } }),
    seed({ id: "h-2-invoice", day: twoDaysAgo, description: "Send invoice to Ahmed Hassan", category: "office", conversation_id: "10", assigned_to: "agent-ana", created_by: "agent-ana", created: "11:20", done: { by: "agent-ana", time: "11:50" } }),
  ];

  return {
    [toDateKey(twoDaysAgo)]: twoDaysAgoItems,
    [toDateKey(yesterday)]: yesterdayItems,
    [toDateKey(today)]: todayItems,
    [toDateKey(addDays(today, 1))]: [],
  };
}
