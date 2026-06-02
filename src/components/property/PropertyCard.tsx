import { MapPin, BedDouble, Bath, Users, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Property, propertyTypeIcon } from "@/types/property";
import { relativeTime } from "@/lib/relativeTime";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onSelect: (id: string) => void;
}

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  return (
    <button
      onClick={() => onSelect(property.id)}
      className={cn(
        "group text-left rounded-xl border border-border bg-card overflow-hidden",
        "shadow-sm transition-all duration-150 hover:shadow-md hover:scale-[1.01]"
      )}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={property.coverImage}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground flex items-center gap-1.5">
            <span aria-hidden>{propertyTypeIcon[property.type]}</span>
            {property.name}
          </h3>
          {property.isDefault && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              Default
            </Badge>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {property.city}, {property.country}
        </p>

        <div className="flex items-center gap-4 text-sm text-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-muted-foreground" />
            {property.accommodation.bedrooms} rooms
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            {property.accommodation.bathrooms.split(" ")[0]} WC
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            {property.accommodation.maxGuests} guests
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Channels:</span>
          {property.channels
            .filter((c) => c.status !== "not-listed")
            .map((c) => (
              <Badge key={c.channel} variant="secondary" className="text-[10px]">
                {c.channel}
              </Badge>
            ))}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border">
          <RefreshCw className="h-3 w-3" />
          Synced {relativeTime(property.lastSyncedAt)}
        </p>
      </div>
    </button>
  );
}
