import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MapPin, Car, Train, ShieldAlert } from "lucide-react";
import { Property, Contact } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";
import { Field } from "./shared";

function ContactRow({ contact }: { contact?: Contact }) {
  if (!contact) return null;
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <div>
        <p className="text-foreground">{contact.name}</p>
        {contact.role && <p className="text-xs text-muted-foreground">{contact.role}</p>}
      </div>
      <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
        {contact.phone}
      </a>
    </div>
  );
}

export function ArrivalTab({ property }: { property: Property }) {
  const [showCode, setShowCode] = useState(false);
  const a = property.arrival;
  const mapsUrl = property.coordinates
    ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`
    : undefined;

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-4">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Check-in
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Check-in time" value={a.checkInTime} />
            <Field label="Access method" value={a.accessMethod} />
          </div>
          {a.accessCode && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-700 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" /> Access code · Visible to team only
                  </p>
                  <p className="font-mono text-lg tracking-widest text-amber-900">
                    {showCode ? a.accessCode : "••••"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCode((v) => !v)}>
                  {showCode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showCode ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          )}
          <Field label="Arrival instructions" value={<p className="whitespace-pre-line">{a.arrivalInstructions}</p>} />

          <Separator />

          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Check-out
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Check-out time" value={a.checkOutTime} />
          </div>
          <Field label="Check-out instructions" value={<p className="whitespace-pre-line">{a.checkOutInstructions}</p>} />

          <Separator />

          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Directions
          </SectionTitle>
          <Field label="How to get there" value={<p className="whitespace-pre-line">{a.directions}</p>} />
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <MapPin className="h-4 w-4" /> Open in Google Maps
            </a>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label="Public transport"
              value={
                <span className="flex items-start gap-1.5">
                  <Train className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  {a.publicTransport}
                </span>
              }
            />
            <Field
              label="Parking"
              value={
                <span className="flex items-start gap-1.5">
                  <Car className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  {a.parking.available
                    ? `${a.parking.type ?? "Available"} · ${a.parking.cost ?? ""} ${a.parking.notes ?? ""}`
                    : `Not available. ${a.parking.notes ?? ""}`}
                </span>
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="internal">Local Contacts</SectionTitle>
          <div className="divide-y divide-border">
            <ContactRow contact={a.localContacts.emergency} />
            <ContactRow contact={a.localContacts.cleaning} />
            <ContactRow contact={a.localContacts.maintenance} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
