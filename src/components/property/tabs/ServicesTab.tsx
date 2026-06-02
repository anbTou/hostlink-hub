import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { EmptyState } from "./shared";

export function ServicesTab({ property, onAdd }: { property: Property; onAdd?: () => void }) {
  if (property.services.length === 0) {
    return (
      <Card className="shadow-sm animate-fade-in">
        <CardContent className="p-0">
          <EmptyState
            message="No services data available. This data will appear once synced from your channel manager."
            onAdd={onAdd}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
      {property.services.map((s) => (
        <Card key={s.id} className="shadow-sm">
          <CardContent className="p-4 space-y-1.5">
            <p className="font-medium text-foreground flex items-center gap-2">
              <span aria-hidden>{s.icon}</span> {s.name}
            </p>
            {s.included && (
              <p className="text-sm">
                <span className="text-muted-foreground">Included: </span>
                {s.included}
              </p>
            )}
            {s.extra && (
              <p className="text-sm">
                <span className="text-muted-foreground">Extra: </span>
                {s.extra}
              </p>
            )}
            {s.provider && (
              <p className="text-sm">
                <span className="text-muted-foreground">Provider: </span>
                {s.provider}
              </p>
            )}
            {s.contact && (
              <p className="text-sm">
                <span className="text-muted-foreground">Contact: </span>
                <a href={`tel:${s.contact}`} className="text-primary hover:underline">
                  {s.contact}
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
