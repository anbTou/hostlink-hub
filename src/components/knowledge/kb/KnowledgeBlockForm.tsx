import { useEffect, useMemo, useState } from "react";
import {
  KnowledgeBlock,
  KnowledgeCategory,
  KnowledgeScope,
  CATEGORY_LABELS,
  COUNTRIES,
  PROPERTY_TYPES,
  PRICE_UNITS,
  PriceUnit,
  ExtraItem,
  StructuredData,
} from "@/types/knowledge";
import { KB_PROPERTIES } from "@/data/mockKnowledge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2, AlertTriangle, Info } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: KnowledgeBlock | null;
  presetScope?: KnowledgeScope;
  presetCategory?: KnowledgeCategory;
  overridesId?: string;
  allBlocks: KnowledgeBlock[];
  onSave: (block: KnowledgeBlock) => void;
}

const SCOPE_OPTIONS: {
  value: KnowledgeScope;
  icon: string;
  label: string;
  hint: string;
}[] = [
  { value: "company", icon: "🏢", label: "Company-wide", hint: "Applies to all properties by default" },
  { value: "country", icon: "🌍", label: "Country-specific", hint: "Applies to all properties in a specific country" },
  { value: "property-type", icon: "🏷", label: "Property Type-specific", hint: "Applies to all properties of a specific type" },
  { value: "property", icon: "🏠", label: "Property-specific", hint: "Applies to a specific property (exception)" },
];

const emptyExtra = (): ExtraItem => ({
  id: `x-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  price: 0,
  unit: "per night",
  description: "",
  availableAt: ["all"],
  conditions: "",
});

export function KnowledgeBlockForm({
  open,
  onOpenChange,
  editing,
  presetScope,
  presetCategory,
  overridesId,
  allBlocks,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("general");
  const [scope, setScope] = useState<KnowledgeScope>("company");
  const [scopeId, setScopeId] = useState<string>("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [structured, setStructured] = useState<StructuredData>({});

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTitle(editing.title);
      setCategory(editing.category);
      setScope(editing.scopeType);
      setScopeId(editing.scopeId ?? "");
      setContent(editing.content);
      setStatus(editing.status === "archived" ? "draft" : (editing.status as "active" | "draft"));
      setTags(editing.tags);
      setStructured(editing.structuredData ?? {});
    } else {
      setTitle("");
      setCategory(presetCategory ?? "general");
      setScope(presetScope ?? "company");
      setScopeId("");
      setContent("");
      setStatus("active");
      setTags([]);
      setStructured({});
    }
    setTagInput("");
  }, [open, editing, presetScope, presetCategory]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  // ---- validation hints ----
  const companyCheckinExists = useMemo(
    () =>
      allBlocks.some(
        (b) =>
          b.scopeType === "company" &&
          b.category === "checkin" &&
          b.id !== editing?.id
      ),
    [allBlocks, editing]
  );

  const showReplaceWarning =
    scope === "company" && category === "checkin" && companyCheckinExists;

  const companyRuleForCategory = useMemo(
    () => allBlocks.some((b) => b.scopeType === "company" && b.category === category),
    [allBlocks, category]
  );

  const showNoBaseInfo =
    scope === "property" && !companyRuleForCategory && category !== "country";

  const updateCheckin = (patch: Partial<NonNullable<StructuredData["checkin"]>>) =>
    setStructured((s) => ({
      checkin: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        earlyCheckIn: false,
        lateCheckOut: false,
        ...s.checkin,
        ...patch,
      },
    }));

  const updateCancellation = (
    patch: Partial<NonNullable<StructuredData["cancellation"]>>
  ) =>
    setStructured((s) => ({
      cancellation: { ...s.cancellation, ...patch },
    }));

  const submit = (saveStatus: "active" | "draft") => {
    if (!title.trim() || !content.trim()) return;
    const needsTarget = scope !== "company";
    const now = new Date().toISOString();
    const block: KnowledgeBlock = {
      id: editing?.id ?? `kb-${Date.now()}`,
      title: title.trim(),
      category,
      scopeType: scope,
      scopeId: needsTarget ? scopeId || undefined : undefined,
      content: content.trim(),
      structuredData: Object.keys(structured).length ? structured : undefined,
      tags,
      status: saveStatus,
      overridesId: editing?.overridesId ?? overridesId,
      createdAt: editing?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(block);
    onOpenChange(false);
  };

  const ci = structured.checkin;
  const ca = structured.cancellation;
  const extras = structured.extras ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle>{editing ? "Edit Knowledge Block" : "Add Knowledge Block"}</SheetTitle>
          <SheetDescription>
            Define an operational rule with its inheritance scope.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 p-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="kb-title">Title *</Label>
            <Input
              id="kb-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Early Check-in Policy"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as KnowledgeCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label>Scope *</Label>
            <RadioGroup value={scope} onValueChange={(v) => { setScope(v as KnowledgeScope); setScopeId(""); }}>
              {SCOPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`scope-${opt.value}`}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-2.5 hover:bg-secondary/50"
                >
                  <RadioGroupItem id={`scope-${opt.value}`} value={opt.value} className="mt-0.5" />
                  <span className="text-sm">
                    <span className="font-medium">{opt.icon} {opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Scope target */}
          {scope === "country" && (
            <div className="space-y-1.5">
              <Label>Country *</Label>
              <Select value={scopeId} onValueChange={setScopeId}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === "property-type" && (
            <div className="space-y-1.5">
              <Label>Property Type *</Label>
              <Select value={scopeId} onValueChange={setScopeId}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === "property" && (
            <div className="space-y-1.5">
              <Label>Property *</Label>
              <Select value={scopeId} onValueChange={setScopeId}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  {KB_PROPERTIES.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* warnings */}
          {showReplaceWarning && (
            <div className="flex gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              A company-wide Check-in &amp; Check-out policy already exists. Creating this will replace it.
            </div>
          )}
          {showNoBaseInfo && (
            <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
              <Info className="h-4 w-4 shrink-0" />
              This is a property-specific exception, but no company-wide rule exists for this category yet. Consider creating a company-wide rule first.
            </div>
          )}

          {/* Structured: Check-in */}
          {category === "checkin" && (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-sm font-semibold">Check-in / Check-out details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Check-in time</Label>
                  <Input type="time" value={ci?.checkInTime ?? "15:00"} onChange={(e) => updateCheckin({ checkInTime: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Check-out time</Label>
                  <Input type="time" value={ci?.checkOutTime ?? "11:00"} onChange={(e) => updateCheckin({ checkOutTime: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Early check-in available</Label>
                <Switch checked={!!ci?.earlyCheckIn} onCheckedChange={(v) => updateCheckin({ earlyCheckIn: v })} />
              </div>
              {ci?.earlyCheckIn && (
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Cost €" value={ci?.earlyCheckInCost ?? ""} onChange={(e) => updateCheckin({ earlyCheckInCost: Number(e.target.value) })} />
                  <Input placeholder="Conditions" value={ci?.earlyCheckInConditions ?? ""} onChange={(e) => updateCheckin({ earlyCheckInConditions: e.target.value })} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label className="text-xs">Late check-out available</Label>
                <Switch checked={!!ci?.lateCheckOut} onCheckedChange={(v) => updateCheckin({ lateCheckOut: v })} />
              </div>
              {ci?.lateCheckOut && (
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Cost €" value={ci?.lateCheckOutCost ?? ""} onChange={(e) => updateCheckin({ lateCheckOutCost: Number(e.target.value) })} />
                  <Input placeholder="Conditions" value={ci?.lateCheckOutConditions ?? ""} onChange={(e) => updateCheckin({ lateCheckOutConditions: e.target.value })} />
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-xs">Key delivery method</Label>
                <Select value={ci?.keyDelivery ?? ""} onValueChange={(v) => updateCheckin({ keyDelivery: v as NonNullable<StructuredData["checkin"]>["keyDelivery"] })}>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    {["Lockbox", "Smart Lock", "In-person", "Reception", "Key Safe"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Access code</Label>
                  <Input value={ci?.accessCode ?? ""} onChange={(e) => updateCheckin({ accessCode: e.target.value })} />
                </div>
                <div className="flex items-end justify-between gap-2 pb-1">
                  <Label className="text-xs">Show to team</Label>
                  <Switch checked={!!ci?.showCodeToTeam} onCheckedChange={(v) => updateCheckin({ showCodeToTeam: v })} />
                </div>
              </div>
            </div>
          )}

          {/* Structured: Cancellation */}
          {category === "cancellation" && (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-sm font-semibold">Cancellation rules</p>
              <Input placeholder="Policy name" value={ca?.policyName ?? ""} onChange={(e) => updateCancellation({ policyName: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="Free window" value={ca?.freeWindowValue ?? ""} onChange={(e) => updateCancellation({ freeWindowValue: Number(e.target.value) })} />
                <Select value={ca?.freeWindowUnit ?? "hours"} onValueChange={(v) => updateCancellation({ freeWindowUnit: v as "hours" | "days" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">hours before check-in</SelectItem>
                    <SelectItem value="days">days before check-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Partial refund</Label>
                <Switch checked={!!ca?.partialRefund} onCheckedChange={(v) => updateCancellation({ partialRefund: v })} />
              </div>
              {ca?.partialRefund && (
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="% refund" value={ca?.partialRefundPercent ?? ""} onChange={(e) => updateCancellation({ partialRefundPercent: Number(e.target.value) })} />
                  <Input placeholder="Window" value={ca?.partialRefundWindow ?? ""} onChange={(e) => updateCancellation({ partialRefundWindow: e.target.value })} />
                </div>
              )}
              <Textarea placeholder="No refund conditions" value={ca?.noRefund ?? ""} onChange={(e) => updateCancellation({ noRefund: e.target.value })} />
              <Textarea placeholder="Channel-specific notes (e.g. OTA policies)" value={ca?.channelNotes ?? ""} onChange={(e) => updateCancellation({ channelNotes: e.target.value })} />
              <Textarea placeholder="Exceptions" value={ca?.exceptionsText ?? ""} onChange={(e) => updateCancellation({ exceptionsText: e.target.value })} />
            </div>
          )}

          {/* Structured: Extras */}
          {category === "extras" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">Extra items</p>
              {extras.map((item, idx) => (
                <div key={item.id} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex gap-2">
                    <Input placeholder="Name" value={item.name} onChange={(e) => {
                      const next = [...extras]; next[idx] = { ...item, name: e.target.value };
                      setStructured((s) => ({ ...s, extras: next }));
                    }} />
                    <button onClick={() => setStructured((s) => ({ ...s, extras: extras.filter((x) => x.id !== item.id) }))} aria-label="Remove item" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Price €" value={item.price || ""} onChange={(e) => {
                      const next = [...extras]; next[idx] = { ...item, price: Number(e.target.value) };
                      setStructured((s) => ({ ...s, extras: next }));
                    }} />
                    <Select value={item.unit} onValueChange={(v) => {
                      const next = [...extras]; next[idx] = { ...item, unit: v as PriceUnit };
                      setStructured((s) => ({ ...s, extras: next }));
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PRICE_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea placeholder="Description" value={item.description ?? ""} onChange={(e) => {
                    const next = [...extras]; next[idx] = { ...item, description: e.target.value };
                    setStructured((s) => ({ ...s, extras: next }));
                  }} />
                  <Input placeholder="Conditions" value={item.conditions ?? ""} onChange={(e) => {
                    const next = [...extras]; next[idx] = { ...item, conditions: e.target.value };
                    setStructured((s) => ({ ...s, extras: next }));
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setStructured((s) => ({ ...s, extras: [...(s.extras ?? []), emptyExtra()] }))}>
                <Plus className="mr-1 h-4 w-4" /> Add Extra Item
              </Button>
              <div className="space-y-1.5">
                <Label>Summary / notes</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[80px]" placeholder="Optional summary for this extras block" />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="kb-content">Content *</Label>
              <Textarea
                id="kb-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                placeholder="Describe the procedure or policy..."
              />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label>Status: {status === "active" ? "Active" : "Draft"}</Label>
            <Switch checked={status === "active"} onCheckedChange={(v) => setStatus(v ? "active" : "draft")} />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2 py-0.5 text-xs text-[#374151]">
                  {t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Type a tag and press Enter"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border bg-card p-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => submit("draft")} disabled={!title.trim() || !content.trim()}>Save as Draft</Button>
            <Button onClick={() => submit("active")} disabled={!title.trim() || !content.trim()}>Save &amp; Publish</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
