import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Property } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";

export function LocalAreaTab({ property }: { property: Property }) {
  const la = property.localArea;
  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            About the Area
          </SectionTitle>
          <p className="text-sm text-foreground">{la.syncedDescription}</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="internal">Team Recommendations</SectionTitle>
          <div className="space-y-2">
            {la.categories.map((cat) => (
              <Collapsible key={cat.id} defaultOpen className="rounded-lg border border-border">
                <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <span aria-hidden>{cat.icon}</span> {cat.label}
                    <span className="text-xs text-muted-foreground">({cat.items.length})</span>
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="divide-y divide-border border-t border-border">
                    {cat.items.map((item) => (
                      <div key={item.id} className="px-3 py-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {item.name}
                            {item.detail && <span className="text-muted-foreground font-normal"> · {item.detail}</span>}
                          </p>
                          {item.distance && <span className="text-xs text-muted-foreground">{item.distance}</span>}
                        </div>
                        {item.note && <p className="text-sm text-muted-foreground mt-0.5">{item.note}</p>}
                        {item.contact && (
                          <a href={`tel:${item.contact}`} className="text-sm text-primary hover:underline">
                            {item.contact}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
