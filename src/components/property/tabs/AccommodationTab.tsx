import { Card, CardContent } from "@/components/ui/card";
import { Users, BedDouble, Bath, Home } from "lucide-react";
import { Property } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";

export function AccommodationTab({ property }: { property: Property }) {
  const acc = property.accommodation;
  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Capacity
          </SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat icon={<Users className="h-5 w-5" />} label="Max guests" value={acc.maxGuests} />
            <Stat icon={<BedDouble className="h-5 w-5" />} label="Bedrooms" value={acc.bedrooms} />
            <Stat icon={<BedDouble className="h-5 w-5" />} label="Beds" value={acc.beds} />
            <Stat icon={<Bath className="h-5 w-5" />} label="Bathrooms" value={acc.bathrooms} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Rooms
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {acc.rooms.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="font-medium text-foreground flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4 text-muted-foreground" /> {r.name}
                </p>
                <p className="text-sm text-foreground mt-1">Bed: {r.bed}</p>
                <p className="text-sm text-foreground">En-suite: {r.ensuite ? "Yes" : "No"}</p>
                {r.notes && <p className="text-sm text-muted-foreground mt-1">{r.notes}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            Common Areas
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {acc.commonAreas.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-sm">
                <Home className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <span>
                  <span className="text-foreground">{c.name}</span>
                  {c.note && <span className="text-muted-foreground"> — {c.note}</span>}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="text-muted-foreground mb-1">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
