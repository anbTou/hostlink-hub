
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
    (filters.dateRange.start ? 1 : 0) +
    (filters.assignedTo ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations, guests, bookings..."
          className="pl-9 pr-4"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
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

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <button onClick={() => onFiltersChange({ ...filters, status: "all" })}>×</button>
            </Badge>
          )}
          {filters.platforms.map((platform) => (
            <Badge key={platform} variant="secondary" className="gap-1">
              {platformOptions.find(p => p.value === platform)?.label}
              <button onClick={() => togglePlatform(platform)}>×</button>
            </Badge>
          ))}
          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              Priority: {priority}
              <button onClick={() => togglePriority(priority)}>×</button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
