import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { subDays } from "date-fns";
import { useTeam } from "@/contexts/TeamContext";
import { getAgentById } from "@/types/team";
import {
  HandoverActivity,
  HandoverActivityAction,
  HandoverCategory,
  HandoverItem,
  NewHandoverItemInput,
} from "@/types/handover";
import { buildHandoverSeed, toDateKey } from "@/data/mockHandover";

type ItemsByDate = Record<string, HandoverItem[]>;

interface HandoverContextType {
  todayKey: string;
  itemsByDate: ItemsByDate;
  getItemsForDate: (dateKey: string) => HandoverItem[];
  ensureDayLoaded: (dateKey: string) => void;
  urgentOpenCount: number;
  addItem: (input: NewHandoverItemInput) => HandoverItem;
  updateItem: (id: string, patch: Partial<HandoverItem>) => void;
  toggleComplete: (id: string) => void;
  toggleUrgent: (id: string) => void;
  deleteItem: (id: string) => void;
  restoreItem: (item: HandoverItem, index?: number) => void;
}

const HandoverContext = createContext<HandoverContextType | undefined>(undefined);

const uid = () => `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Carry all still-open items from `fromKey` into `toKey` if not already present. */
function carryOver(state: ItemsByDate, fromKey: string, toKey: string): ItemsByDate {
  const from = state[fromKey] ?? [];
  const to = state[toKey] ?? [];
  const existing = new Set(to.map((i) => i.id));
  const carried: HandoverItem[] = from
    .filter((i) => i.status === "open" && !existing.has(i.id))
    .map((i) => ({
      ...i,
      date: toKey,
      carried_over_from_date: fromKey,
      activity_log: [
        ...i.activity_log,
        {
          id: uid(),
          action: "carried_over" as const,
          user: "System",
          timestamp: new Date().toISOString(),
          details: `carried over from ${fromKey}`,
        },
      ],
    }));
  if (carried.length === 0 && state[toKey]) return state;
  return { ...state, [toKey]: [...carried, ...to] };
}

export function HandoverProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useTeam();
  const todayKey = toDateKey(new Date());

  const [itemsByDate, setItemsByDate] = useState<ItemsByDate>(() => {
    const seed = buildHandoverSeed(new Date());
    return carryOver(seed, toDateKey(subDays(new Date(), 1)), todayKey);
  });

  const getItemsForDate = useCallback((dateKey: string) => itemsByDate[dateKey] ?? [], [itemsByDate]);

  const ensureDayLoaded = useCallback(
    (dateKey: string) => {
      if (dateKey !== todayKey) return;
      setItemsByDate((prev) => carryOver(prev, toDateKey(subDays(new Date(), 1)), todayKey));
    },
    [todayKey]
  );

  const log = (action: HandoverActivityAction, details?: string): HandoverActivity => ({
    id: uid(),
    action,
    user: currentUser.name,
    timestamp: new Date().toISOString(),
    details,
  });

  const mutateToday = (fn: (items: HandoverItem[]) => HandoverItem[]) =>
    setItemsByDate((prev) => ({ ...prev, [todayKey]: fn(prev[todayKey] ?? []) }));

  const stamp = (item: HandoverItem, entries: HandoverActivity[]): HandoverItem => ({
    ...item,
    updated_by: currentUser.id,
    updated_at: new Date().toISOString(),
    activity_log: [...item.activity_log, ...entries],
  });

  const addItem = useCallback(
    (input: NewHandoverItemInput): HandoverItem => {
      const now = new Date().toISOString();
      const entries: HandoverActivity[] = [log("created", "created this item")];
      if (input.assigned_to) entries.push(log("assigned", `assigned to ${getAgentById(input.assigned_to)?.name ?? "someone"}`));
      if (input.is_urgent) entries.push(log("urgent_on", "marked as urgent"));
      if (input.notes) entries.push(log("notes", "added notes"));
      const item: HandoverItem = {
        id: uid(),
        date: todayKey,
        description: input.description.trim(),
        category: input.category,
        property_id: input.property_id,
        conversation_id: input.conversation_id,
        assigned_to: input.assigned_to,
        is_urgent: !!input.is_urgent,
        status: "open",
        notes: input.notes?.trim() || undefined,
        created_by: currentUser.id,
        created_at: now,
        updated_by: currentUser.id,
        updated_at: now,
        activity_log: entries,
      };
      mutateToday((items) => [item, ...items]);
      return item;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, todayKey]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<HandoverItem>) => {
      mutateToday((items) =>
        items.map((item) => {
          if (item.id !== id) return item;
          const entries: HandoverActivity[] = [];
          if (patch.description !== undefined && patch.description !== item.description) entries.push(log("edited", "edited the description"));
          if (patch.category !== undefined && patch.category !== item.category) entries.push(log("category", `moved to ${labelFor(patch.category)}`));
          if (patch.assigned_to !== undefined && patch.assigned_to !== item.assigned_to) {
            entries.push(
              patch.assigned_to
                ? log("assigned", `assigned to ${getAgentById(patch.assigned_to)?.name ?? "someone"}`)
                : log("unassigned", "removed the assignee")
            );
          }
          if (patch.is_urgent !== undefined && patch.is_urgent !== item.is_urgent) entries.push(log(patch.is_urgent ? "urgent_on" : "urgent_off", patch.is_urgent ? "marked as urgent" : "removed urgent flag"));
          if (patch.notes !== undefined && (patch.notes || "") !== (item.notes || "")) entries.push(log("notes", patch.notes ? "updated notes" : "cleared notes"));
          if (patch.property_id !== undefined && patch.property_id !== item.property_id) entries.push(log("edited", "changed the property"));
          if (patch.conversation_id !== undefined && patch.conversation_id !== item.conversation_id) entries.push(log("edited", patch.conversation_id ? "linked a conversation" : "unlinked the conversation"));
          if (patch.status !== undefined && patch.status !== item.status) {
            const done = patch.status === "completed";
            entries.push(log(done ? "completed" : "reopened", done ? "marked as completed" : "reopened this item"));
            patch = { ...patch, completed_at: done ? new Date().toISOString() : undefined, completed_by: done ? currentUser.id : undefined };
          }
          return stamp({ ...item, ...patch }, entries);
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, todayKey]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      const item = (itemsByDate[todayKey] ?? []).find((i) => i.id === id);
      if (!item) return;
      updateItem(id, { status: item.status === "open" ? "completed" : "open" });
    },
    [itemsByDate, todayKey, updateItem]
  );

  const toggleUrgent = useCallback(
    (id: string) => {
      const item = (itemsByDate[todayKey] ?? []).find((i) => i.id === id);
      if (!item) return;
      updateItem(id, { is_urgent: !item.is_urgent });
    },
    [itemsByDate, todayKey, updateItem]
  );

  const deleteItem = useCallback(
    (id: string) => mutateToday((items) => items.filter((i) => i.id !== id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayKey]
  );

  const restoreItem = useCallback(
    (item: HandoverItem, index?: number) =>
      mutateToday((items) => {
        if (items.some((i) => i.id === item.id)) return items;
        const next = [...items];
        next.splice(index ?? 0, 0, item);
        return next;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [todayKey]
  );

  const urgentOpenCount = useMemo(
    () => (itemsByDate[todayKey] ?? []).filter((i) => i.is_urgent && i.status === "open").length,
    [itemsByDate, todayKey]
  );

  const value = useMemo<HandoverContextType>(
    () => ({
      todayKey,
      itemsByDate,
      getItemsForDate,
      ensureDayLoaded,
      urgentOpenCount,
      addItem,
      updateItem,
      toggleComplete,
      toggleUrgent,
      deleteItem,
      restoreItem,
    }),
    [todayKey, itemsByDate, getItemsForDate, ensureDayLoaded, urgentOpenCount, addItem, updateItem, toggleComplete, toggleUrgent, deleteItem, restoreItem]
  );

  return <HandoverContext.Provider value={value}>{children}</HandoverContext.Provider>;
}

function labelFor(cat: HandoverCategory) {
  return { guest_issues: "Guest Issues", cleaning: "Cleaning", maintenance: "Maintenance", office: "Office" }[cat];
}

export function useHandover() {
  const ctx = useContext(HandoverContext);
  if (!ctx) throw new Error("useHandover must be used within HandoverProvider");
  return ctx;
}
