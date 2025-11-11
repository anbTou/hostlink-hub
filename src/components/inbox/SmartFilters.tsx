
import { useState } from "react";
import { Calendar, Filter, Search, Tag, User, Clock, AlertTriangle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { FilterOptions, ConversationSource } from "@/types/inbox";
import { SaveViewDialog } from "./SaveViewDialog";
import { useSavedViews } from "@/hooks/useSavedViews";

interface SmartFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SmartFilters({ filters, onFiltersChange, searchQuery, onSearchChange }: SmartFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveViewOpen, setSaveViewOpen] = useState(false);
  const { createSavedView } = useSavedViews();

  const platformOptions: { value: ConversationSource; label: string; color: string }[] = [
    { value: "email", label: "Email", color: "bg-blue-100 text-blue-800" },
    { value: "airbnb", label: "Airbnb", color: "bg-red-100 text-red-800" },
    { value: "booking", label: "Booking.com", color: "bg-blue-100 text-blue-800" },
    { value: "vrbo", label: "VRBO", color: "bg-yellow-100 text-yellow-800" },
    { value: "expedia", label: "Expedia", color: "bg-purple-100 text-purple-800" },
    { value: "whatsapp", label: "WhatsApp", color: "bg-green-100 text-green-800" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  ];

  const togglePlatform = (platform: ConversationSource) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const togglePriority = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: "all",
      platforms: [],
      dateRange: {},
      priority: [],
      tags: [],
      teams: [],
      properties: [],
      slaHours: undefined,
    });
    onSearchChange("");
  };

  const handleSaveView = async (name: string, icon: string) => {
    await createSavedView(name, filters, icon);
  };

  const activeFilterCount = 
    (filters.status !== "all" ? 1 : 0) +
    filters.platforms.length +
    filters.priority.length +
    filters.tags.length +
    filters.teams.length +
    filters.properties.length +
    (filters.slaHours ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0) +
    (filters.assignedTo ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar with Filter Chips */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations, guests, bookings..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        {/* Stackable Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center px-1">
            {filters.platforms.map((platform) => (
              <Badge 
                key={platform} 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => togglePlatform(platform)}
              >
                {platformOptions.find(p => p.value === platform)?.label}
                <span className="text-muted-foreground">×</span>
              </Badge>
            ))}
            {filters.teams.map((team) => (
              <Badge 
                key={team} 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => {
                  const newTeams = filters.teams.filter(t => t !== team);
                  onFiltersChange({ ...filters, teams: newTeams });
                }}
              >
                Team: {team}
                <span className="text-muted-foreground">×</span>
              </Badge>
            ))}
            {filters.properties.map((property) => (
              <Badge 
                key={property} 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => {
                  const newProperties = filters.properties.filter(p => p !== property);
                  onFiltersChange({ ...filters, properties: newProperties });
                }}
              >
                {property}
                <span className="text-muted-foreground">×</span>
              </Badge>
            ))}
            {filters.slaHours && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, slaHours: undefined })}
              >
                SLA &lt; {filters.slaHours}h
                <span className="text-muted-foreground">×</span>
              </Badge>
            )}
            {filters.priority.map((priority) => (
              <Badge 
                key={priority} 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => togglePriority(priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                <span className="text-muted-foreground">×</span>
              </Badge>
            ))}
            {filters.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => {
                  const newTags = filters.tags.filter(t => t !== tag);
                  onFiltersChange({ ...filters, tags: newTags });
                }}
              >
                #{tag}
                <span className="text-muted-foreground">×</span>
              </Badge>
            ))}
            {filters.status !== "all" && (
              <Badge 
                variant="secondary" 
                className="gap-1.5 text-xs h-6 px-2 hover:bg-secondary/80 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, status: "all" })}
              >
                {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                <span className="text-muted-foreground">×</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={showAdvanced ? "default" : "outline"}
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-3.5 w-3.5" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSaveViewOpen(true)}
              className="gap-2"
            >
              <Bookmark className="h-4 w-4" />
              Save View
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </>
        )}
      </div>

      <SaveViewDialog
        open={saveViewOpen}
        onOpenChange={setSaveViewOpen}
        filters={filters}
        onSave={handleSaveView}
      />

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Platform Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Platforms</label>
              <div className="space-y-2">
                {platformOptions.map((platform) => (
                  <div key={platform.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.value}
                      checked={filters.platforms.includes(platform.value)}
                      onCheckedChange={() => togglePlatform(platform.value)}
                    />
                    <label htmlFor={platform.value} className="text-sm">
                      {platform.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <div className="space-y-2">
                {priorityOptions.map((priority) => (
                  <div key={priority.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={priority.value}
                      checked={filters.priority.includes(priority.value as any)}
                      onCheckedChange={() => togglePriority(priority.value as any)}
                    />
                    <label htmlFor={priority.value} className="text-sm">
                      {priority.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <DatePickerWithRange
                onDateChange={(range) => 
                  onFiltersChange({
                    ...filters,
                    dateRange: {
                      start: range?.from?.toISOString(),
                      end: range?.to?.toISOString(),
                    }
                  })
                }
              />
            </div>

            {/* Team Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Team</label>
              <Select
                value={filters.teams[0] || ""}
                onValueChange={(value) => {
                  const newTeams = value ? [value] : [];
                  onFiltersChange({ ...filters, teams: newTeams });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Teams</SelectItem>
                  <SelectItem value="GuestSupport">Guest Support</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Property</label>
              <Select
                value={filters.properties[0] || ""}
                onValueChange={(value) => {
                  const newProperties = value ? [value] : [];
                  onFiltersChange({ ...filters, properties: newProperties });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Properties</SelectItem>
                  <SelectItem value="Casa Flamingo">Casa Flamingo</SelectItem>
                  <SelectItem value="Villa Azure">Villa Azure</SelectItem>
                  <SelectItem value="Sunset Apartment">Sunset Apartment</SelectItem>
                  <SelectItem value="Ocean View Studio">Ocean View Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SLA Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">SLA Response Time</label>
              <Select
                value={filters.slaHours?.toString() || ""}
                onValueChange={(value) => {
                  const slaHours = value ? parseInt(value) : undefined;
                  onFiltersChange({ ...filters, slaHours });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SLA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No SLA Filter</SelectItem>
                  <SelectItem value="1">Within 1 hour</SelectItem>
                  <SelectItem value="2">Within 2 hours</SelectItem>
                  <SelectItem value="4">Within 4 hours</SelectItem>
                  <SelectItem value="24">Within 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Options */}
            <div>
              <label className="text-sm font-medium mb-2 block">Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unread"
                    checked={filters.isUnread || false}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, isUnread: checked as boolean })
                    }
                  />
                  <label htmlFor="unread" className="text-sm">Unread only</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attachments"
                    checked={filters.hasAttachments || false}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, hasAttachments: checked as boolean })
                    }
                  />
                  <label htmlFor="attachments" className="text-sm">Has attachments</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
