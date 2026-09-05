import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BrainCircuit,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockProperties } from "@/data/mockProperties";
import { mockKnowledgeBlocks } from "@/data/mockKnowledge";
import { mockAiCards, mockGlobalRules } from "@/data/mockAiKnowledge";
import {
  AiPropertyCard,
  FieldMap,
  GlobalRule,
  SECTIONS,
  SectionKey,
} from "@/types/ai-knowledge";
import { computeCompletion, regenerateCard } from "@/services/aiKnowledgeGenerator";
import { relativeTime } from "@/lib/relativeTime";
import { AiFieldInput } from "@/components/ai-knowledge/AiFieldInput";
import { SectionShell } from "@/components/ai-knowledge/SectionShell";
import { AmenityGrid } from "@/components/ai-knowledge/AmenityGrid";
import { RoomTables } from "@/components/ai-knowledge/RoomTables";
import { ChatbotPreviewDialog } from "@/components/ai-knowledge/ChatbotPreviewDialog";
import { GlobalRulesTable } from "@/components/ai-knowledge/GlobalRulesTable";
import { PropertyPills, completionTone } from "@/components/ai-knowledge/PropertyPills";
import { COUNTRIES } from "@/types/knowledge";

const OPEN_KEY = "hostsy.aikb.sections";

const DEFAULT_OPEN: Record<SectionKey, boolean> = {
  basic: true,
  rooms: false,
  amenities: false,
  wifi: false,
  checkin: true,
  rules: false,
  description: false,
  guardrails: false,
};

const AIKnowledgePage = () => {
  const [cards, setCards] = useState<AiPropertyCard[]>(mockAiCards);
  const [rules, setRules] = useState<GlobalRule[]>(mockGlobalRules);
  const [selectedId, setSelectedId] = useState(mockAiCards[0]?.propertyId ?? "");
  const [editing, setEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const dirty = useRef(false);

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(() => {
    try {
      const raw = localStorage.getItem(OPEN_KEY);
      return raw ? { ...DEFAULT_OPEN, ...JSON.parse(raw) } : DEFAULT_OPEN;
    } catch {
      return DEFAULT_OPEN;
    }
  });

  useEffect(() => {
    localStorage.setItem(OPEN_KEY, JSON.stringify(openSections));
  }, [openSections]);

  // Auto-save draft every 30s while editing
  useEffect(() => {
    if (!editing) return;
    const id = window.setInterval(() => {
      if (!dirty.current) return;
      dirty.current = false;
      setDraftSavedAt(new Date().toISOString());
    }, 30_000);
    return () => window.clearInterval(id);
  }, [editing]);

  const card = cards.find((c) => c.propertyId === selectedId) ?? cards[0];
  const completion = useMemo(() => (card ? computeCompletion(card) : null), [card]);

  const pills = cards.map((c) => {
    const prop = mockProperties.find((p) => p.id === c.propertyId);
    return {
      id: c.propertyId,
      name: c.propertyName,
      type: prop?.type ?? "house",
      percent: computeCompletion(c).percent,
    };
  });

  const average = pills.length
    ? Math.round(pills.reduce((s, p) => s + p.percent, 0) / pills.length)
    : 0;

  const patchCard = (patch: Partial<AiPropertyCard>) => {
    dirty.current = true;
    setCards((prev) =>
      prev.map((c) => (c.propertyId === card.propertyId ? { ...c, ...patch } : c))
    );
  };

  const setField = (sectionKey: SectionKey, key: string, value: string) => {
    const map = card[sectionKey as keyof AiPropertyCard] as FieldMap;
    patchCard({
      [sectionKey]: {
        ...map,
        [key]: {
          ...map[key],
          value,
          source: "manual",
          updatedAt: new Date().toISOString(),
        },
      },
    } as Partial<AiPropertyCard>);
  };

  const resetField = (sectionKey: SectionKey, key: string) => {
    const map = card[sectionKey as keyof AiPropertyCard] as FieldMap;
    patchCard({
      [sectionKey]: {
        ...map,
        [key]: { ...map[key], value: map[key].autoValue ?? "", source: "auto" },
      },
    } as Partial<AiPropertyCard>);
  };

  const handleRegenerate = () => {
    const property = mockProperties.find((p) => p.id === card.propertyId);
    if (!property) return;
    const next = regenerateCard(card, property, mockKnowledgeBlocks);
    setCards((prev) => prev.map((c) => (c.propertyId === card.propertyId ? next : c)));
    setConfirmRegen(false);
    toast({
      title: "Card regenerated",
      description: "Automatic fields were refreshed. Your manual edits were kept.",
    });
  };

  if (!card || !completion) {
    return (
      <MainLayout>
        <Card className="p-10 text-center text-muted-foreground">
          No AI knowledge cards yet.
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-5 pb-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              AI Knowledge Base
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Standardized property knowledge compiled for the guest chatbot.
            </p>
          </div>
          <Button onClick={() => toast({ title: "Add property card", description: "Connect a property in Property Info to create a new card." })}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Property Card
          </Button>
        </div>

        {/* Dashboard strip */}
        <Card className="p-4 flex flex-wrap items-center gap-4">
          <Stat label="Property cards" value={String(pills.length)} />
          <Stat label="Average completion" value={`${average}%`} />
          <div className="flex flex-wrap gap-2 ml-auto">
            {pills.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs ring-1 transition-transform hover:scale-[1.03]",
                  completionTone(p.percent),
                  selectedId === p.id && "ring-2"
                )}
              >
                {p.name} · {p.percent}%
              </button>
            ))}
          </div>
        </Card>

        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">Property Cards</TabsTrigger>
            <TabsTrigger value="global">Global Rules</TabsTrigger>
          </TabsList>

          {/* ── Property cards ─────────────────────────────── */}
          <TabsContent value="cards" className="space-y-4">
            <PropertyPills items={pills} selectedId={card.propertyId} onSelect={setSelectedId} />

            <Card className="p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-sm font-medium ring-1",
                    completionTone(completion.percent)
                  )}
                >
                  {completion.percent}% complete
                </span>
                <span className="text-sm text-muted-foreground">
                  {completion.filled}/{completion.total} fields ·{" "}
                  {completion.missing.length} missing
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Generated {relativeTime(card.lastGeneratedAt)}
              </span>
              {draftSavedAt && (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <Check className="h-3 w-3" /> Draft saved {relativeTime(draftSavedAt)}
                </span>
              )}
              <div className="flex flex-wrap gap-2 ml-auto">
                <Button variant="outline" size="sm" onClick={() => setConfirmRegen(true)}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Regenerate from sources
                </Button>
                <Button
                  variant={editing ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (editing) {
                      setDraftSavedAt(new Date().toISOString());
                      toast({ title: "Changes saved" });
                    }
                    setEditing((e) => !e);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> {editing ? "Done editing" : "Edit mode"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview as chatbot
                </Button>
              </div>
            </Card>

            {completion.missing.length > 0 && (
              <Card className="p-3 flex items-start gap-2 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  Missing: {completion.missing.slice(0, 6).map((m) => m.label).join(", ")}
                  {completion.missing.length > 6 && ` +${completion.missing.length - 6} more`}
                </p>
              </Card>
            )}

            <div className="space-y-3">
              {SECTIONS.map((section) => {
                const open = openSections[section.key];
                const toggle = () =>
                  setOpenSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }));

                if (section.key === "rooms") {
                  return (
                    <SectionShell
                      key={section.key}
                      title={section.title}
                      icon={section.icon}
                      filled={card.rooms.length ? 1 : 0}
                      total={1}
                      open={open}
                      onToggle={toggle}
                    >
                      <RoomTables
                        rooms={card.rooms}
                        bathrooms={card.bathrooms}
                        editing={editing}
                        onRoomsChange={(rows) => patchCard({ rooms: rows })}
                        onBathroomsChange={(rows) => patchCard({ bathrooms: rows })}
                      />
                    </SectionShell>
                  );
                }

                if (section.key === "amenities") {
                  const available = card.amenities.filter((a) => a.available);
                  return (
                    <SectionShell
                      key={section.key}
                      title={section.title}
                      icon={section.icon}
                      filled={available.filter((a) => a.details.value.trim()).length}
                      total={available.length}
                      open={open}
                      onToggle={toggle}
                    >
                      <AmenityGrid
                        amenities={card.amenities}
                        editing={editing}
                        onChange={(a) => patchCard({ amenities: a })}
                      />
                    </SectionShell>
                  );
                }

                const map = card[section.key as keyof AiPropertyCard] as FieldMap;
                const required = section.fields?.filter((f) => f.required) ?? [];
                const filled = required.filter((f) => map[f.key]?.value.trim()).length;

                return (
                  <SectionShell
                    key={section.key}
                    title={section.title}
                    icon={section.icon}
                    filled={filled}
                    total={required.length}
                    open={open}
                    onToggle={toggle}
                  >
                    {section.key === "checkin" && (
                      <p className="text-xs text-muted-foreground pt-3">
                        Times and policies are inherited from the Knowledge Base — see the source on
                        each field.
                      </p>
                    )}
                    <div className="grid gap-3 md:grid-cols-2 pt-3">
                      {section.fields?.map((def) => (
                        <div
                          key={def.key}
                          className={def.type === "textarea" ? "md:col-span-2" : undefined}
                        >
                          <AiFieldInput
                            def={def}
                            field={map[def.key]}
                            editing={editing}
                            masked={section.key === "wifi" && def.key === "password"}
                            onChange={(v) => setField(section.key, def.key, v)}
                            onReset={() => resetField(section.key, def.key)}
                          />
                        </div>
                      ))}
                    </div>
                  </SectionShell>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Global rules ───────────────────────────────── */}
          <TabsContent value="global">
            <Tabs defaultValue="company" className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <TabsList>
                  <TabsTrigger value="company">Company Rules</TabsTrigger>
                  <TabsTrigger value="country">Country Rules</TabsTrigger>
                </TabsList>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-9 rounded-md border border-border bg-card px-2 text-sm"
                  aria-label="Country"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <TabsContent value="company">
                <GlobalRulesTable
                  rules={rules.filter((r) => r.scope === "company")}
                  onChange={(id, patch) =>
                    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
                  }
                />
              </TabsContent>
              <TabsContent value="country">
                <GlobalRulesTable
                  rules={rules.filter((r) => r.scope === "country" && r.country === country)}
                  onChange={(id, patch) =>
                    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
                  }
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      <ChatbotPreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} card={card} />

      <AlertDialog open={confirmRegen} onOpenChange={setConfirmRegen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate from sources?</AlertDialogTitle>
            <AlertDialogDescription>
              Automatic fields will be refilled from Property Info and the Knowledge Base. Fields
              you edited manually are preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerate}>Regenerate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default AIKnowledgePage;
