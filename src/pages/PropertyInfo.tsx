import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { mockProperties } from "@/data/mockProperties";
import { Property } from "@/types/property";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { PropertySelector } from "@/components/property/PropertySelector";
import { PropertyOverviewGrid } from "@/components/property/PropertyOverviewGrid";
import { AddPropertyDialog } from "@/components/property/AddPropertyDialog";
import { TabSkeleton } from "@/components/property/TabSkeleton";

import { BasicTab } from "@/components/property/tabs/BasicTab";
import { ArrivalTab } from "@/components/property/tabs/ArrivalTab";
import { AccommodationTab } from "@/components/property/tabs/AccommodationTab";
import { AmenitiesTab } from "@/components/property/tabs/AmenitiesTab";
import { RulesTab } from "@/components/property/tabs/RulesTab";
import { ServicesTab } from "@/components/property/tabs/ServicesTab";
import { LocalAreaTab } from "@/components/property/tabs/LocalAreaTab";
import { PhotosTab } from "@/components/property/tabs/PhotosTab";
import { ChannelStatusTab } from "@/components/property/tabs/ChannelStatusTab";

const TABS = [
  "Basic",
  "Arrival",
  "Accommodation",
  "Amenities",
  "Rules",
  "Services",
  "Local Area",
  "Photos",
  "Channel Status",
] as const;
type TabKey = (typeof TABS)[number];

const PropertyInfo = () => {
  const { toast } = useToast();
  const [properties] = useState<Property[]>(mockProperties);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("Basic");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => properties.find((p) => p.id === selectedId) ?? null,
    [properties, selectedId]
  );

  // Simulate a short data load when switching properties / tabs.
  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [selectedId, activeTab, selected]);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
    setActiveTab("Basic");
  };

  const renderTab = (p: Property) => {
    switch (activeTab) {
      case "Basic":
        return <BasicTab property={p} />;
      case "Arrival":
        return <ArrivalTab property={p} />;
      case "Accommodation":
        return <AccommodationTab property={p} />;
      case "Amenities":
        return <AmenitiesTab property={p} />;
      case "Rules":
        return <RulesTab property={p} />;
      case "Services":
        return <ServicesTab property={p} onAdd={() => setAddOpen(true)} />;
      case "Local Area":
        return <LocalAreaTab property={p} />;
      case "Photos":
        return <PhotosTab property={p} />;
      case "Channel Status":
        return <ChannelStatusTab property={p} />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Property Info</h1>
            <p className="text-muted-foreground">Property details synced from your channel manager</p>
          </div>
          <Button variant="outline" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Selector */}
        <PropertySelector properties={properties} selectedId={selectedId} onSelect={handleSelect} />

        {/* Content */}
        {!selected ? (
          <PropertyOverviewGrid properties={properties} onSelect={(id) => handleSelect(id)} />
        ) : (
          <div className="space-y-4">
            {/* Sync error banner */}
            {selected.syncFailed && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
                <p className="flex items-center gap-2 text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Last sync failed. Data may be outdated.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300"
                  onClick={() => toast({ title: "Retrying sync…", description: `Re-syncing ${selected.name}` })}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
                </Button>
              </div>
            )}

            {/* Tab bar */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {loading ? <TabSkeleton /> : renderTab(selected)}
          </div>
        )}
      </div>

      <AddPropertyDialog open={addOpen} onOpenChange={setAddOpen} />
    </MainLayout>
  );
};

export default PropertyInfo;
