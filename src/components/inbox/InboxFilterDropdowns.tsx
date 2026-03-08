import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Link, Calendar, ChevronDown, X, Check,
  Mail, Home, ClipboardList, MessageSquare, Building, Plane,
  LogIn, LogOut, CalendarDays, AlertCircle, Tag, UserX
} from "lucide-react";
import { ConversationSource } from "@/types/inbox";
import { cn } from "@/lib/utils";

interface ChannelOption {
  value: ConversationSource;
  label: string;
  icon: React.ReactNode;
  unreadCount: number;
}

export type QuickFilterValue =
  | "checkin_today"
  | "checkout_today"
  | "arriving_this_week"
  | "urgent"
  | "tagged"
  | "unassigned"
  | null;

interface FilterOption {
  value: QuickFilterValue;
  label: string;
  icon: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  { value: null, label: "All conversations", icon: null },
  { value: "checkin_today", label: "Check-in Today", icon: <LogIn className="h-3.5 w-3.5" /> },
  { value: "checkout_today", label: "Check-out Today", icon: <LogOut className="h-3.5 w-3.5" /> },
  { value: "arriving_this_week", label: "Arriving This Week", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  { value: "urgent", label: "Urgent", icon: <AlertCircle className="h-3.5 w-3.5" /> },
  { value: "tagged", label: "Tagged", icon: <Tag className="h-3.5 w-3.5" /> },
  { value: "unassigned", label: "Unassigned", icon: <UserX className="h-3.5 w-3.5" /> },
];

interface InboxFilterDropdownsProps {
  activeChannels: ConversationSource[];
  onToggleChannel: (channel: ConversationSource) => void;
  onClearChannels: () => void;
  quickFilter: QuickFilterValue;
  onSetQuickFilter: (filter: QuickFilterValue) => void;
  channelUnreadCounts: Record<ConversationSource, number>;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

const allChannels: { value: ConversationSource; label: string; icon: React.ReactNode }[] = [
  { value: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  { value: "airbnb", label: "Airbnb", icon: <Home className="h-3.5 w-3.5" /> },
  { value: "booking", label: "Booking.com", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { value: "vrbo", label: "VRBO", icon: <Building className="h-3.5 w-3.5" /> },
  { value: "expedia", label: "Expedia", icon: <Plane className="h-3.5 w-3.5" /> },
];

export function InboxFilterDropdowns({
  activeChannels,
  onToggleChannel,
  onClearChannels,
  quickFilter,
  onSetQuickFilter,
  channelUnreadCounts,
}: InboxFilterDropdownsProps) {
  const [channelOpen, setChannelOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const channelRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useClickOutside(channelRef, () => setChannelOpen(false));
  useClickOutside(filterRef, () => setFilterOpen(false));

  const hasChannelFilter = activeChannels.length > 0;
  const hasQuickFilter = quickFilter !== null;

  const channelLabel = () => {
    if (activeChannels.length === 0) return "Channel";
    if (activeChannels.length === 1) {
      return allChannels.find(c => c.value === activeChannels[0])?.label || activeChannels[0];
    }
    return `${activeChannels.length} channels`;
  };

  const filterLabel = () => {
    if (!quickFilter) return "Filter";
    return filterOptions.find(f => f.value === quickFilter)?.label || "Filter";
  };

  return (
    <div className="flex gap-2 px-3 py-2 border-b border-border">
      {/* Channel Dropdown */}
      <div ref={channelRef} className="relative flex-1">
        <Button
          variant={hasChannelFilter ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full h-8 text-xs justify-between gap-1 px-2.5",
            channelOpen && "ring-2 ring-ring",
            hasChannelFilter && "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
          )}
          onClick={() => { setChannelOpen(!channelOpen); setFilterOpen(false); }}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Link className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{channelLabel()}</span>
          </span>
          <span className="flex items-center gap-0.5 shrink-0">
            {hasChannelFilter && (
              <span
                role="button"
                className="rounded-full hover:bg-primary/20 p-0.5"
                onClick={(e) => { e.stopPropagation(); onClearChannels(); }}
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown className={cn("h-3 w-3 transition-transform", channelOpen && "rotate-180")} />
          </span>
        </Button>

        {channelOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 py-1">
            {allChannels.map(ch => {
              const isActive = activeChannels.includes(ch.value);
              const count = channelUnreadCounts[ch.value] || 0;
              return (
                <button
                  key={ch.value}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors text-left",
                    isActive && "bg-accent/50"
                  )}
                  onClick={() => onToggleChannel(ch.value)}
                >
                  <span className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center shrink-0",
                    isActive ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  )}>
                    {isActive && <Check className="h-2.5 w-2.5" />}
                  </span>
                  <span className="flex items-center gap-1.5 flex-1">
                    {ch.icon}
                    <span>{ch.label}</span>
                  </span>
                  {count > 0 && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1 min-w-[16px]">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      <div ref={filterRef} className="relative flex-1">
        <Button
          variant={hasQuickFilter ? "default" : "outline"}
          size="sm"
          className={cn(
            "w-full h-8 text-xs justify-between gap-1 px-2.5",
            filterOpen && "ring-2 ring-ring",
            hasQuickFilter && "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
          )}
          onClick={() => { setFilterOpen(!filterOpen); setChannelOpen(false); }}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{filterLabel()}</span>
          </span>
          <span className="flex items-center gap-0.5 shrink-0">
            {hasQuickFilter && (
              <span
                role="button"
                className="rounded-full hover:bg-primary/20 p-0.5"
                onClick={(e) => { e.stopPropagation(); onSetQuickFilter(null); }}
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronDown className={cn("h-3 w-3 transition-transform", filterOpen && "rotate-180")} />
          </span>
        </Button>

        {filterOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 py-1 min-w-[180px]">
            {filterOptions.map((opt, i) => (
              <div key={opt.value ?? "all"}>
                {i === 1 && <div className="border-t border-border my-1" />}
                <button
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-accent transition-colors text-left",
                    quickFilter === opt.value && "bg-accent/50"
                  )}
                  onClick={() => {
                    onSetQuickFilter(opt.value);
                    setFilterOpen(false);
                  }}
                >
                  <span className={cn(
                    "h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0",
                    quickFilter === opt.value ? "border-primary bg-primary" : "border-muted-foreground/40"
                  )}>
                    {quickFilter === opt.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </span>
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
