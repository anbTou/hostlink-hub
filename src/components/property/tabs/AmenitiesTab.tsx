import { Card, CardContent } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Property } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";
import { cn } from "@/lib/utils";

export function AmenitiesTab({ property }: { property: Property }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {property.amenities.map((group) => (
        <Card key={group.category} className="shadow-sm">
          <CardContent className="p-5">
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              {group.category}
            </SectionTitle>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const chip = (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm",
                      item.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-muted text-muted-foreground opacity-60"
                    )}
                  >
                    {item.available ? <Check className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    {item.label}
                  </span>
                );
                return item.note ? (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{chip}</TooltipTrigger>
                    <TooltipContent>{item.note}</TooltipContent>
                  </Tooltip>
                ) : (
                  <span key={item.id}>{chip}</span>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
