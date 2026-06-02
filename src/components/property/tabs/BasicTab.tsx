import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, ExternalLink } from "lucide-react";
import { Property, propertyTypeIcon } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";
import { Field } from "./shared";

export function BasicTab({ property }: { property: Property }) {
  const [expanded, setExpanded] = useState(false);
  const mapsUrl = property.coordinates
    ? `https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-in">
      {/* Left 60% */}
      <Card className="lg:col-span-3 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Property Details
          </SectionTitle>

          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span aria-hidden>{propertyTypeIcon[property.type]}</span>
              {property.name}
            </h2>
            <p className="text-sm text-muted-foreground capitalize">{property.type}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Address" value={property.fullAddress} />
            <Field label="Size" value={property.size} />
            <Field
              label="GPS Coordinates"
              value={
                property.coordinates ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                  </a>
                ) : null
              }
            />
            <Field label="City / Country" value={`${property.city}, ${property.country}`} />
          </div>

          <Separator />

          <div>
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              Marketing Description
            </SectionTitle>
            <p className="text-sm text-foreground">{property.marketingDescription}</p>
          </div>

          <div>
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              Full Description
            </SectionTitle>
            <p className={`text-sm text-foreground whitespace-pre-line ${expanded ? "" : "line-clamp-3"}`}>
              {property.fullDescription}
            </p>
            <Button variant="link" className="px-0 h-auto text-primary" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Read less" : "Read more"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right 40% */}
      <div className="lg:col-span-2 space-y-5">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              Key Features
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              {property.keyFeatures.map((f) => (
                <Badge key={f} variant="secondary">
                  {f}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-5 space-y-2">
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              Property IDs
            </SectionTitle>
            <Field label="Internal ID" value={property.id.toUpperCase()} />
            {property.externalIds.map((e) => (
              <div key={e.channel} className="flex items-center justify-between text-sm py-1">
                <span className="text-muted-foreground">{e.channel}</span>
                <span className="font-mono">{e.id}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {property.owner && (
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-2">
              <SectionTitle source="internal">Owner Info</SectionTitle>
              <Field label="Name" value={property.owner.name} synced={false} />
              <Field label="Contact" value={property.owner.contact} synced={false} />
              {property.owner.notes && <Field label="Notes" value={property.owner.notes} synced={false} />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
