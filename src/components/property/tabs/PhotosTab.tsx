import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Property } from "@/types/property";

export function PhotosTab({ property }: { property: Property }) {
  const photos = property.photos;
  const [active, setActive] = useState<number | null>(null);

  const open = (i: number) => setActive(i);
  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
  const next = () => setActive((i) => (i === null ? i : (i + 1) % photos.length));

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {photos.map((photo, i) => (
          <div key={photo.id} className="group">
            <button
              onClick={() => open(i)}
              className="relative block w-full overflow-hidden rounded-lg border border-border"
              aria-label={`View ${photo.caption ?? "photo"}`}
            >
              <div className="aspect-[4/3] w-full bg-muted">
                <img src={photo.url} alt={photo.caption ?? property.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors grid place-items-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium">
                  <Eye className="h-4 w-4" /> View
                </span>
              </div>
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 text-[10px]"
              >
                {photo.source === "synced" ? "Synced" : "Internal"}
              </Badge>
            </button>
            {photo.caption && <p className="text-xs text-muted-foreground mt-1.5">{photo.caption}</p>}
          </div>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {active !== null && (
            <div className="relative">
              <img src={photos[active].url} alt={photos[active].caption ?? ""} className="w-full max-h-[70vh] object-contain bg-black" />
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-card/90 hover:bg-card"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-card/90 hover:bg-card"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="flex items-center justify-between p-3">
                <p className="text-sm text-foreground">{photos[active].caption}</p>
                <span className="text-xs text-muted-foreground">
                  {active + 1} / {photos.length} · {photos[active].source === "synced" ? "Synced" : "Internal"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
