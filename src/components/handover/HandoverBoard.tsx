import { useEffect, useMemo, useState } from "react";
import { addDays, format, isToday, parseISO, subDays } from "date-fns";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHandover } from "@/contexts/HandoverContext";
import { toDateKey } from "@/data/mockHandover";
import { HandoverItem } from "@/types/handover";
import { teamMembers } from "@/types/team";
import { HANDOVER_CATEGORIES } from "./handoverMeta";
import { HandoverSection } from "./HandoverSection";
import { HandoverItemRow } from "./HandoverItemRow";
import { HandoverItemDrawer } from "./HandoverItemDrawer";

const STORAGE_KEY = "hostsy.handover.sections";

export function HandoverBoard() {
  const {
    todayKey,
    getItemsForDate,
    ensureDayLoaded,
    addItem,
    updateItem,
    toggleComplete,
    deleteItem,
  } = useHandover();

  const [dateKey, setDateKey] = useState(todayKey);
  const [selected, setSelected] = useState<HandoverItem | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return Object.fromEntries(HANDOVER_CATEGORIES.map((c) => [c.id, true]));
  });

  useEffect(() => {
    ensureDayLoaded(dateKey);
  }, [dateKey, ensureDayLoaded]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expanded));
    } catch { /* ignore */ }
  }, [expanded]);

  const items = getItemsForDate(dateKey);
  const readOnly = dateKey !== todayKey;

  const open = items.filter((i) => i.status === "open");
  const completed = items.filter((i) => i.status === "completed");
  const urgent = open.filter((i) => i.is_urgent);
  const onShift = useMemo(() => teamMembers.filter((m) => m.isOnline), []);

  const day = parseISO(dateKey);

  const shift = (delta: number) => setDateKey(toDateKey(delta > 0 ? addDays(day, 1) : subDays(day, 1)));

  return (
    <div className="space-y-4 pb-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => shift(-1)} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[150px] text-center">
            <p className="text-sm font-semibold">
              {isToday(day) ? "Today" : format(day, "EEEE")}
            </p>
            <p className="text-[11px] text-muted-foreground">{format(day, "d MMM yyyy")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => shift(1)} aria-label="Next day">
            <ChevronRight className="h-4 w-4" />
          </Button>
          {readOnly && (
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setDateKey(todayKey)}>
              Back to today
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline" className="h-6">{open.length} open</Badge>
          <Badge variant="outline" className="h-6">{completed.length} completed</Badge>
          {urgent.length > 0 && (
            <Badge className="h-6 bg-red-100 text-red-700 hover:bg-red-100">{urgent.length} urgent</Badge>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">On shift</span>
          <div className="flex -space-x-2">
            {onShift.map((m) => (
              <div
                key={m.id}
                title={m.name}
                className="h-7 w-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: m.avatarColor }}
              >
                {m.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {readOnly && (
        <p className="text-xs text-muted-foreground">
          Viewing a past day — items can only be changed on today's handover.
        </p>
      )}

      {/* Urgent */}
      {urgent.length > 0 && (
        <section className="rounded-2xl border-l-4 border-l-red-500 bg-white shadow-soft">
          <div className="flex items-center gap-2 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold">Urgent</span>
            <Badge className="h-5 bg-red-100 text-red-700 hover:bg-red-100">{urgent.length}</Badge>
          </div>
          <div className="space-y-2 px-4 pb-4">
            {urgent.map((item) => (
              <HandoverItemRow
                key={item.id}
                item={item}
                readOnly={readOnly}
                onToggle={toggleComplete}
                onOpen={setSelected}
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <div className="grid gap-4 xl:grid-cols-2">
        {HANDOVER_CATEGORIES.map((meta) => (
          <HandoverSection
            key={meta.id}
            meta={meta}
            items={items.filter((i) => i.category === meta.id)}
            expanded={expanded[meta.id] ?? true}
            readOnly={readOnly}
            onToggleExpanded={() =>
              setExpanded((prev) => ({ ...prev, [meta.id]: !(prev[meta.id] ?? true) }))
            }
            onToggleItem={toggleComplete}
            onOpenItem={setSelected}
            onAdd={addItem}
          />
        ))}
      </div>

      <HandoverItemDrawer
        item={selected}
        readOnly={readOnly}
        onClose={() => setSelected(null)}
        onSave={updateItem}
        onDelete={deleteItem}
      />
    </div>
  );
}
