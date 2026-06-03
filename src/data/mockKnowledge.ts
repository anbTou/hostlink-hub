import { KnowledgeBlock } from "@/types/knowledge";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

/** Lightweight property roster for scope targeting (mirrors mockProperties). */
export const KB_PROPERTIES = [
  { id: "p1", name: "Villa Serenity", type: "Villa", country: "Portugal" },
  { id: "p2", name: "Downtown Apartment", type: "Apartment", country: "Portugal" },
  { id: "p3", name: "Mountain Cabin", type: "Cabin", country: "Portugal" },
];

export function propertyName(id?: string): string {
  return KB_PROPERTIES.find((p) => p.id === id)?.name ?? id ?? "";
}

export const mockKnowledgeBlocks: KnowledgeBlock[] = [
  {
    id: "kb-checkin-company",
    title: "Standard Check-in & Check-out Policy",
    category: "checkin",
    scopeType: "company",
    content:
      "Standard check-in time is 15:00. Standard check-out time is 11:00. Early check-in may be available upon request, subject to availability (€25). Late check-out is available until 14:00 (€30). Keys are delivered via lockbox; the code is sent to the guest 24 hours before arrival.",
    structuredData: {
      checkin: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        earlyCheckIn: true,
        earlyCheckInCost: 25,
        earlyCheckInConditions: "Subject to availability, request 24h in advance.",
        lateCheckOut: true,
        lateCheckOutCost: 30,
        lateCheckOutConditions: "Until 14:00, subject to availability.",
        keyDelivery: "Lockbox",
        accessCode: "—",
        showCodeToTeam: false,
      },
    },
    tags: ["arrival", "checkout", "lockbox", "timing"],
    status: "active",
    createdAt: daysAgo(40),
    updatedAt: daysAgo(2),
  },
  {
    id: "kb-comm-protocol",
    title: "Guest Communication Protocol",
    category: "general",
    scopeType: "company",
    content:
      "Response SLA: 30 minutes during working hours, 2 hours outside working hours. Always address the guest by name. Reply on the original channel of the message. Escalate to a manager for any serious complaint.",
    tags: ["communication", "sla", "escalation"],
    status: "active",
    createdAt: daysAgo(38),
    updatedAt: daysAgo(6),
  },
  {
    id: "kb-cancellation-company",
    title: "Standard Cancellation Policy",
    category: "cancellation",
    scopeType: "company",
    content:
      "Free cancellation up to 48 hours before check-in. Within 48 hours: 50% refund. No-show: no refund.",
    structuredData: {
      cancellation: {
        policyName: "Standard Flexible Policy",
        freeWindowValue: 48,
        freeWindowUnit: "hours",
        partialRefund: true,
        partialRefundPercent: 50,
        partialRefundWindow: "Within 48 hours of check-in",
        noRefund: "No-show or same-day cancellation: no refund.",
        channelNotes:
          "Note: Airbnb enforces its own cancellation policy which may differ from this internal policy. The Airbnb policy takes precedence for bookings via Airbnb.",
        exceptionsText: "Force majeure cases reviewed individually by a manager.",
      },
    },
    tags: ["refund", "cancellation", "ota"],
    status: "active",
    createdAt: daysAgo(35),
    updatedAt: daysAgo(10),
  },
  {
    id: "kb-damage-report",
    title: "Damage & Incident Reporting",
    category: "general",
    scopeType: "company",
    content:
      "Photograph any damage immediately. Report to the manager. Contact the guest within 24 hours. Document everything in the system.",
    tags: ["damage", "incident", "reporting"],
    status: "active",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(12),
  },
  {
    id: "kb-extras-company",
    title: "Available Extras",
    category: "extras",
    scopeType: "company",
    content: "Standard list of paid extras available across all properties.",
    structuredData: {
      extras: [
        { id: "x1", name: "Baby Crib", price: 15, unit: "per night", description: "Wooden crib with mattress.", availableAt: ["all"], conditions: "Request 48h in advance." },
        { id: "x2", name: "Airport Transfer", price: 45, unit: "one-time", description: "Private transfer to/from airport.", availableAt: ["all"] },
        { id: "x3", name: "Late Check-out", price: 30, unit: "one-time", description: "Check-out extended until 14:00.", availableAt: ["all"] },
        { id: "x4", name: "Pet Fee", price: 20, unit: "per night", description: "Per pet, cleaning surcharge.", availableAt: ["all"] },
        { id: "x5", name: "Welcome Pack", price: 35, unit: "one-time", description: "Local produce and essentials on arrival.", availableAt: ["all"] },
      ],
    },
    tags: ["extras", "fees", "addons"],
    status: "active",
    createdAt: daysAgo(28),
    updatedAt: daysAgo(4),
  },
  {
    id: "kb-portugal-legal",
    title: "Portugal — Legal Requirements",
    category: "country",
    scopeType: "country",
    scopeId: "Portugal",
    content:
      "SEF guest communication is mandatory within 3 business days. Tourist tax applies where required by the municipality. A complaints book (livro de reclamações) is mandatory. Registration with Turismo de Portugal is required.",
    tags: ["sef", "legal", "tax", "portugal"],
    status: "active",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(8),
  },
  {
    id: "kb-spain-legal",
    title: "Spain — Legal Requirements",
    category: "country",
    scopeType: "country",
    scopeId: "Spain",
    content:
      "Parte de Viajeros is mandatory (submit to police within 24h). A tourist registration number is mandatory on listings. Follow homeowners' association (comunidad de propietarios) rules.",
    tags: ["legal", "police", "spain"],
    status: "active",
    createdAt: daysAgo(24),
    updatedAt: daysAgo(9),
  },
  {
    id: "kb-villa-pool",
    title: "Villa Pool Maintenance Protocol",
    category: "property-type",
    scopeType: "property-type",
    scopeId: "Villa",
    content:
      "Check pH and chlorine daily in high season. Clean filters weekly. Cover the pool in low season. Contact the technician if pH is out of range.",
    tags: ["pool", "maintenance", "villa"],
    status: "active",
    createdAt: daysAgo(22),
    updatedAt: daysAgo(7),
  },
  {
    id: "kb-villa-serenity-checkin",
    title: "Villa Serenity — Check-in Exception",
    category: "checkin",
    scopeType: "property",
    scopeId: "p1",
    overridesId: "kb-checkin-company",
    content:
      "Check-in at 16:00 (instead of 15:00). Reason: the cleaning service needs more time due to the size of the property. Smart lock with code sent automatically.",
    structuredData: {
      checkin: {
        checkInTime: "16:00",
        checkOutTime: "11:00",
        earlyCheckIn: false,
        lateCheckOut: true,
        lateCheckOutCost: 30,
        keyDelivery: "Smart Lock",
        accessCode: "4827",
        showCodeToTeam: true,
      },
    },
    tags: ["checkin", "exception", "villa-serenity"],
    status: "active",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(3),
  },
  {
    id: "kb-mountain-cabin-checkin",
    title: "Mountain Cabin — Winter Check-in Exception",
    category: "checkin",
    scopeType: "property",
    scopeId: "p3",
    overridesId: "kb-checkin-company",
    content:
      "Check-in at 14:00 in winter (Nov–Mar). Reason: short days, guests need to arrive in daylight. Check-in at 15:00 the rest of the year (follows the standard policy).",
    structuredData: {
      checkin: {
        checkInTime: "14:00",
        checkOutTime: "10:00",
        earlyCheckIn: false,
        lateCheckOut: false,
        keyDelivery: "In-person",
        showCodeToTeam: false,
      },
    },
    tags: ["checkin", "exception", "winter", "mountain-cabin"],
    status: "active",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(5),
  },
];
