import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

interface PropertyOverviewGridProps {
  properties: Property[];
  onSelect: (id: string) => void;
}

export function PropertyOverviewGrid({ properties, onSelect }: PropertyOverviewGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
