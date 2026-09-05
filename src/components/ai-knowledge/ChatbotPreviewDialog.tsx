import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AiPropertyCard, FieldMap, SECTIONS } from "@/types/ai-knowledge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: AiPropertyCard;
}

function mapToPayload(map: FieldMap) {
  const out: Record<string, string> = {};
  Object.entries(map).forEach(([k, f]) => {
    if (f.value.trim()) out[k] = f.value;
  });
  return out;
}

export function ChatbotPreviewDialog({ open, onOpenChange, card }: Props) {
  const payload = {
    property: card.propertyName,
    ...Object.fromEntries(
      SECTIONS.filter((s) => s.fields).map((s) => [
        s.key,
        mapToPayload(card[s.key as keyof AiPropertyCard] as FieldMap),
      ])
    ),
    bedrooms: card.rooms.map((r) => ({
      name: r.name,
      bed: r.bed,
      ensuite: r.ensuite,
      notes: r.notes || undefined,
    })),
    bathrooms: card.bathrooms.map((b) => ({ name: b.name, type: b.kind, notes: b.notes || undefined })),
    amenities: card.amenities
      .filter((a) => a.available)
      .map((a) => ({ name: a.label, group: a.group, details: a.details.value || undefined })),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview as chatbot</DialogTitle>
          <DialogDescription>
            This is the structured knowledge the assistant receives for {card.propertyName}.
            Empty fields are omitted.
          </DialogDescription>
        </DialogHeader>
        <pre className="max-h-[60vh] overflow-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
