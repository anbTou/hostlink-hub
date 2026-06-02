import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyType } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pmsAvailable = [
  { id: "x1", name: "Seaside Loft — Porto" },
  { id: "x2", name: "Algarve Beach House" },
  { id: "x3", name: "Douro Valley Cottage" },
];

export function AddPropertyDialog({ open, onOpenChange }: AddPropertyDialogProps) {
  const { toast } = useToast();
  const [source, setSource] = useState<"import" | "manual">("import");
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<PropertyType>("apartment");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleImport = () => {
    toast({ title: "Import started", description: `${selected.length} property(ies) will be imported.` });
    onOpenChange(false);
    setSelected([]);
  };

  const handleCreate = () => {
    if (!name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    toast({ title: "Property created", description: `${name} added. Fill in details in the tabs.` });
    onOpenChange(false);
    setName("");
    setAddress("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Property</SheetTitle>
          <SheetDescription>Import from your channel manager or add one manually.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-5">
          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v as "import" | "manual")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="import">Import from BookingSync</SelectItem>
                <SelectItem value="manual">Add manually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {source === "import" ? (
            <div className="space-y-2">
              <Label>Properties not yet imported</Label>
              <div className="space-y-2 rounded-lg border border-border p-2">
                {pmsAvailable.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer">
                    <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                    <span className="text-sm">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Villa Serenity" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as PropertyType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["villa", "apartment", "studio", "house", "cabin", "hotel"] as PropertyType[]).map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, Country" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <Label htmlFor="default" className="cursor-pointer">Set as default property</Label>
            <Switch id="default" checked={isDefault} onCheckedChange={setIsDefault} />
          </div>
        </div>

        <SheetFooter>
          {source === "import" ? (
            <Button onClick={handleImport} disabled={selected.length === 0} className="w-full">
              Import Selected ({selected.length})
            </Button>
          ) : (
            <Button onClick={handleCreate} className="w-full">
              Create Property
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
