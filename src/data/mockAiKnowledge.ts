import { mockProperties } from "@/data/mockProperties";
import { mockKnowledgeBlocks } from "@/data/mockKnowledge";
import { generateCard } from "@/services/aiKnowledgeGenerator";
import { AiPropertyCard, FieldMap, GlobalRule } from "@/types/ai-knowledge";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

function setValue(map: FieldMap, key: string, value: string, manual = false) {
  if (!map[key]) return;
  map[key] = {
    ...map[key],
    value,
    source: manual ? "manual" : "auto",
    updatedAt: manual ? hoursAgo(6) : map[key].updatedAt,
  };
}

function clear(map: FieldMap, ...keys: string[]) {
  keys.forEach((k) => {
    if (map[k]) map[k] = { ...map[k], value: "", source: "auto" };
  });
}

/** Fill amenity details with a sensible line, except the labels listed. */
function fillAmenityDetails(card: AiPropertyCard, skipLabels: string[] = []) {
  card.amenities = card.amenities.map((a) => {
    if (!a.available || a.details.value.trim()) return a;
    if (skipLabels.includes(a.label)) return a;
    return { ...a, details: { ...a.details, value: `${a.label} available for guests.` } };
  });
}

function buildCards(): AiPropertyCard[] {
  const cards = mockProperties.slice(0, 3).map((p) => generateCard(p, mockKnowledgeBlocks));

  // ── Villa Serenity — most complete, missing emergency contact & neighbourhood
  const villa = cards.find((c) => c.propertyId === "p1");
  if (villa) {
    villa.lastGeneratedAt = hoursAgo(5);
    setValue(villa.basic, "floors", "2");
    setValue(villa.wifi, "network", "VillaSerenity_5G");
    setValue(villa.wifi, "password", "Ocean2024!");
    setValue(villa.wifi, "coverage", "Whole house, pool area and terrace");
    setValue(villa.wifi, "speed", "500 Mbps fibre");
    setValue(
      villa.description,
      "warnings",
      "The pool is unfenced — children must be supervised at all times.",
      true
    );
    clear(villa.checkin, "emergencyContact");
    clear(villa.description, "neighbourhood");
    fillAmenityDetails(villa);
  }

  // ── Downtown Apartment — missing amenity details & arrival instructions
  const apt = cards.find((c) => c.propertyId === "p2");
  if (apt) {
    apt.lastGeneratedAt = hoursAgo(30);
    setValue(apt.basic, "floors", "1");
    setValue(apt.basic, "floorLocation", "3rd floor, lift available");
    setValue(apt.wifi, "network", "Downtown_Guest");
    setValue(apt.wifi, "password", "Lisboa2024");
    setValue(apt.wifi, "coverage", "Full apartment");
    clear(apt.checkin, "arrivalInstructions", "emergencyContact");
    clear(apt.description, "neighbourhood", "warnings");
    fillAmenityDetails(apt, apt.amenities.filter((a) => a.available).slice(0, 5).map((a) => a.label));
  }

  // ── Mountain Cabin — missing WiFi, check-in and guardrails
  const cabin = cards.find((c) => c.propertyId === "p3");
  if (cabin) {
    cabin.lastGeneratedAt = hoursAgo(96);
    clear(cabin.wifi, "network", "password", "coverage", "speed");
    clear(
      cabin.checkin,
      "accessMethod",
      "arrivalInstructions",
      "emergencyContact",
      "checkOutInstructions"
    );
    clear(cabin.guardrails, "escalation", "fallback", "tone", "discounts");
    clear(cabin.description, "neighbourhood", "warnings", "sellingPoints");
    fillAmenityDetails(cabin, cabin.amenities.filter((a) => a.available).slice(0, 4).map((a) => a.label));
  }

  return cards;
}

export const mockAiCards: AiPropertyCard[] = buildCards();

export const mockGlobalRules: GlobalRule[] = mockKnowledgeBlocks
  .filter((b) => b.scopeType === "company" || b.scopeType === "country")
  .map((b) => ({
    id: `gr-${b.id}`,
    scope: b.scopeType as "company" | "country",
    country: b.scopeType === "country" ? b.scopeId : undefined,
    category: b.category,
    title: b.title,
    summary: b.content.split("\n")[0].slice(0, 160),
    content: b.content,
    status: b.status,
    sourceBlockId: b.id,
    chatbotInstruction: "",
  }));
