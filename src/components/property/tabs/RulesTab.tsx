import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, Cigarette, PartyPopper, Volume2, Users, FileText, CalendarClock } from "lucide-react";
import { Property } from "@/types/property";
import { SectionTitle } from "../SyncIndicator";

export function RulesTab({ property }: { property: Property }) {
  const r = property.rules;
  const rows = [
    { icon: <PawPrint className="h-4 w-4" />, label: "Pets", value: r.petsFee ? `${r.pets} · ${r.petsFee}` : r.pets },
    { icon: <Cigarette className="h-4 w-4" />, label: "Smoking", value: r.smoking },
    { icon: <PartyPopper className="h-4 w-4" />, label: "Events / Parties", value: r.events },
    { icon: <Volume2 className="h-4 w-4" />, label: "Quiet hours", value: r.quietHours },
    { icon: <Users className="h-4 w-4" />, label: "Maximum occupancy", value: `${r.maxOccupancy} guests` },
    { icon: <CalendarClock className="h-4 w-4" />, label: "Minimum age to book", value: r.minAge ? `${r.minAge}+` : "No restriction" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
            House Rules
          </SectionTitle>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {row.icon}
                  {row.label}
                </span>
                <span className="text-sm font-medium text-foreground text-right">{row.value || "—"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {r.additionalRules && (
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <SectionTitle source="synced" provider={property.syncProvider} lastUpdated={property.lastSyncedAt}>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Additional Rules
              </span>
            </SectionTitle>
            <p className="text-sm text-foreground whitespace-pre-line">{r.additionalRules}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
