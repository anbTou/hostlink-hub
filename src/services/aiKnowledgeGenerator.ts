import { Property } from "@/types/property";
import { KnowledgeBlock } from "@/types/knowledge";
import { compileForProperty } from "@/lib/knowledgeUtils";
import {
  AiAmenity,
  AiPropertyCard,
  AMENITY_GROUPS,
  autoField,
  AiField,
  FieldMap,
  SECTIONS,
} from "@/types/ai-knowledge";

const PI = (tab: string) => `Property Info → ${tab}`;

/** Map a Property Info amenity category onto one of the standard groups. */
function groupFor(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("outdoor") || c.includes("pool") || c.includes("leisure")) return "Outdoor & Leisure";
  if (c.includes("climate") || c.includes("comfort") || c.includes("heat")) return "Climate & Comfort";
  if (c.includes("kitchen") || c.includes("appliance") || c.includes("laundry")) return "Appliances";
  if (c.includes("entertain") || c.includes("media") || c.includes("tv")) return "Entertainment";
  return "Building & Access";
}

export function generateCard(
  property: Property,
  blocks: KnowledgeBlock[]
): AiPropertyCard {
  const compiled = compileForProperty(
    { id: property.id, type: capitalize(property.type), country: property.country },
    blocks
  ).filter((e) => !e.overriddenBy);

  const checkinBlock = compiled.find((e) => e.block.category === "checkin")?.block;
  const checkinData = checkinBlock?.structuredData?.checkin;
  const kbRef = checkinBlock
    ? `Knowledge Base → ${checkinBlock.title}`
    : "Knowledge Base";

  const basic: FieldMap = {
    name: autoField(property.name, PI("Basic")),
    reference: autoField(property.id.toUpperCase(), PI("Basic")),
    address: autoField(property.fullAddress, PI("Basic")),
    country: autoField(property.country, PI("Basic")),
    type: autoField(capitalize(property.type), PI("Basic")),
    area: autoField(property.size ?? "", PI("Basic")),
    floors: autoField("", PI("Basic")),
    floorLocation: autoField("", PI("Basic")),
    maxGuests: autoField(String(property.accommodation.maxGuests), PI("Accommodation")),
    shortSummary: autoField(property.marketingDescription, PI("Basic")),
  };

  const rooms = property.accommodation.rooms.map((r) => ({
    id: r.id,
    name: r.name,
    bed: r.bed,
    ensuite: r.ensuite,
    notes: r.notes,
  }));

  const bathroomCount = parseInt(property.accommodation.bathrooms, 10) || 1;
  const bathrooms = Array.from({ length: bathroomCount }).map((_, i) => ({
    id: `bath-${i + 1}`,
    name: `Bathroom ${i + 1}`,
    kind: i === 0 ? "Full (bath + shower)" : "Shower only",
    notes: "",
  }));

  const amenities: AiAmenity[] = property.amenities.flatMap((cat) =>
    cat.items.map((item) => ({
      id: `${property.id}-${item.id}`,
      group: groupFor(cat.category),
      label: item.label,
      available: item.available,
      details: autoField(item.note ?? "", PI("Amenities")),
    }))
  );

  const wifi: FieldMap = {
    network: autoField("", PI("Arrival")),
    password: autoField("", PI("Arrival")),
    coverage: autoField("", PI("Arrival")),
    speed: autoField("", PI("Arrival")),
  };

  const checkin: FieldMap = {
    checkInTime: autoField(checkinData?.checkInTime ?? property.arrival.checkInTime, checkinBlock ? kbRef : PI("Arrival")),
    checkOutTime: autoField(checkinData?.checkOutTime ?? property.arrival.checkOutTime, checkinBlock ? kbRef : PI("Arrival")),
    accessMethod: autoField(property.arrival.accessMethod, PI("Arrival")),
    arrivalInstructions: autoField(property.arrival.arrivalInstructions, PI("Arrival")),
    earlyCheckIn: autoField(
      checkinData
        ? checkinData.earlyCheckIn
          ? `Available${checkinData.earlyCheckInCost ? ` — €${checkinData.earlyCheckInCost}` : ""}${
              checkinData.earlyCheckInConditions ? `. ${checkinData.earlyCheckInConditions}` : ""
            }`
          : "Not available"
        : "",
      kbRef
    ),
    lateCheckOut: autoField(
      checkinData
        ? checkinData.lateCheckOut
          ? `Available${checkinData.lateCheckOutCost ? ` — €${checkinData.lateCheckOutCost}` : ""}${
              checkinData.lateCheckOutConditions ? `. ${checkinData.lateCheckOutConditions}` : ""
            }`
          : "Not available"
        : "",
      kbRef
    ),
    checkOutInstructions: autoField(property.arrival.checkOutInstructions, PI("Arrival")),
    emergencyContact: autoField(
      property.arrival.localContacts.emergency
        ? `${property.arrival.localContacts.emergency.name} — ${property.arrival.localContacts.emergency.phone}`
        : "",
      PI("Arrival")
    ),
  };

  const rules: FieldMap = {
    pets: autoField(property.rules.pets, PI("Rules")),
    smoking: autoField(property.rules.smoking, PI("Rules")),
    events: autoField(property.rules.events, PI("Rules")),
    quietHours: autoField(property.rules.quietHours ?? "", PI("Rules")),
    additionalRules: autoField(property.rules.additionalRules ?? "", PI("Rules")),
  };

  const description: FieldMap = {
    shortDescription: autoField(property.marketingDescription, PI("Basic")),
    sellingPoints: autoField(property.keyFeatures.join(", "), PI("Basic")),
    warnings: autoField("", PI("Basic")),
    neighbourhood: autoField(property.localArea.syncedDescription, PI("Local Area")),
  };

  const guardrails: FieldMap = {
    bookingConfirmation: autoField("No — always escalate to the team", "Default policy"),
    accessCodes: autoField("Only after check-in day and identity confirmed", "Default policy"),
    pricing: autoField("Yes — published rates only", "Default policy"),
    discounts: autoField("No", "Default policy"),
    escalation: autoField(
      "Complaints, refunds, damages, medical or safety issues, payment problems",
      "Default policy"
    ),
    tone: autoField("Friendly, concise, professional", "Default policy"),
    languages: autoField("English, Portuguese", "Default policy"),
    fallback: autoField(
      "I'm not sure about that — let me pass you to a member of our team who can help.",
      "Default policy"
    ),
  };

  return {
    propertyId: property.id,
    propertyName: property.name,
    lastGeneratedAt: new Date().toISOString(),
    basic,
    rooms,
    bathrooms,
    amenities,
    wifi,
    checkin,
    rules,
    description,
    guardrails,
  };
}

/** Regenerate auto fields from sources while preserving manual edits. */
export function regenerateCard(
  current: AiPropertyCard,
  property: Property,
  blocks: KnowledgeBlock[]
): AiPropertyCard {
  const fresh = generateCard(property, blocks);
  const mergeMap = (cur: FieldMap, next: FieldMap): FieldMap => {
    const out: FieldMap = {};
    Object.keys(next).forEach((k) => {
      const c = cur[k];
      if (c?.source === "manual") {
        out[k] = { ...c, autoValue: next[k].value, autoSourceRef: next[k].autoSourceRef };
      } else {
        out[k] = next[k];
      }
    });
    return out;
  };

  return {
    ...fresh,
    lastGeneratedAt: new Date().toISOString(),
    basic: mergeMap(current.basic, fresh.basic),
    wifi: mergeMap(current.wifi, fresh.wifi),
    checkin: mergeMap(current.checkin, fresh.checkin),
    rules: mergeMap(current.rules, fresh.rules),
    description: mergeMap(current.description, fresh.description),
    guardrails: mergeMap(current.guardrails, fresh.guardrails),
    rooms: current.rooms.length ? current.rooms : fresh.rooms,
    bathrooms: current.bathrooms.length ? current.bathrooms : fresh.bathrooms,
    amenities: fresh.amenities.map((a) => {
      const cur = current.amenities.find((x) => x.label === a.label);
      if (cur?.details.source === "manual") return { ...a, available: cur.available, details: cur.details };
      return a;
    }),
    ...(current.amenities.filter((a) => a.custom).length
      ? {}
      : {}),
  };
}

export interface Completion {
  filled: number;
  total: number;
  percent: number;
  missing: { section: string; label: string }[];
}

export function computeCompletion(card: AiPropertyCard): Completion {
  const missing: { section: string; label: string }[] = [];
  let total = 0;
  let filled = 0;

  SECTIONS.forEach((section) => {
    if (!section.fields) return;
    const map = card[section.key as keyof AiPropertyCard] as FieldMap;
    section.fields
      .filter((f) => f.required)
      .forEach((f) => {
        total += 1;
        const v = map?.[f.key]?.value?.trim();
        if (v) filled += 1;
        else missing.push({ section: section.title, label: f.label });
      });
  });

  // Bedrooms must be described
  total += 1;
  if (card.rooms.length) filled += 1;
  else missing.push({ section: "Bedrooms & bathrooms", label: "At least one bedroom" });

  // Available amenities need details
  card.amenities
    .filter((a) => a.available)
    .forEach((a) => {
      total += 1;
      if (a.details.value.trim()) filled += 1;
      else missing.push({ section: "Amenities", label: `${a.label} details` });
    });

  return {
    filled,
    total,
    percent: total ? Math.round((filled / total) * 100) : 0,
    missing,
  };
}

export function isFieldMissing(field: AiField | undefined, required?: boolean) {
  return !!required && !field?.value?.trim();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
