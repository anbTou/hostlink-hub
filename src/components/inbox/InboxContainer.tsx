import { useState, useMemo, useEffect } from "react";
import { Search, Send, Users, Info, RefreshCw, PanelRightOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { isToday, parseISO, isThisWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConversationView } from "@/components/inbox/ConversationView";
import { GuestContextPanel } from "@/components/inbox/GuestContextPanel";
import { InboxFilterDropdowns, QuickFilterValue } from "@/components/inbox/InboxFilterDropdowns";
import { InboxConversationItem, InboxConversation } from "@/components/inbox/InboxConversationItem";
import { ConversationSource } from "@/types/inbox";
import { useTeam } from "@/contexts/TeamContext";
import { getAgentById } from "@/types/team";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";
import { useBelowBreakpoint } from "@/hooks/use-breakpoint";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  ListSkeleton,
  ConversationSkeleton,
  ContextSkeleton,
  EmptyConversations,
  InboxErrorState,
} from "@/components/inbox/InboxStates";


// 12 mock conversations as specified
const buildSampleConversations = (): InboxConversation[] => [
  {
    id: "1", guestName: "Sarah Miller", guestEmail: "sarah.miller@example.com",
    channel: "email", preview: "Interested in booking your beachfront villa...",
    timestamp: "2026-03-23T10:30:00Z", propertyName: "Beachfront Villa",
    tags: ["booking"], isUnread: true, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-ana", assignedToName: "Ana Costa",
    isAssignedToMe: false, autoAssigned: true,
  },
  {
    id: "2", guestName: "John Davis", guestEmail: "john.davis@example.com",
    channel: "airbnb", preview: "Question about the mountain cabin amenities...",
    timestamp: "2026-03-23T09:15:00Z", propertyName: "Mountain Cabin",
    tags: ["question"], isUnread: true, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-sofia", assignedToName: "Sofia Martins",
    isAssignedToMe: false, autoAssigned: false,
  },
  {
    id: "3", guestName: "Maria Rodriguez", guestEmail: "maria.r@example.com",
    channel: "whatsapp", preview: "Check-in instructions please? Arriving at 3pm",
    timestamp: "2026-03-23T08:45:00Z", propertyName: "Lakeside Cottage",
    tags: ["check-in"], isUnread: false, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-joao", assignedToName: "João Ferreira",
    isAssignedToMe: false, autoAssigned: true,
    checkIn: "2026-03-23T15:00:00Z",
  },
  {
    id: "4", guestName: "Hans Weber", guestEmail: "hans.weber@example.com",
    channel: "booking", preview: "Ist es möglich, spät auszuchecken?",
    timestamp: "2026-03-22T22:10:00Z", propertyName: "City Apartment",
    tags: ["late-checkout"], isUnread: true, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-tiago", assignedToName: "Tiago Santos",
    isAssignedToMe: false, autoAssigned: false,
  },
  {
    id: "5", guestName: "Emma Thompson", guestEmail: "emma.thompson@example.com",
    channel: "email", preview: "We need to cancel our reservation unfortunately",
    timestamp: "2026-03-22T18:30:00Z", propertyName: "Beachfront Villa",
    tags: ["cancellation", "urgent"], isUnread: true, isStarred: true, isSnoozed: false,
    isResolved: false, assignedTo: "agent-pedro", assignedToName: "Pedro Almeida",
    isAssignedToMe: false, autoAssigned: false,
  },
  {
    id: "6", guestName: "Luca Bianchi", guestEmail: "luca.bianchi@example.com",
    channel: "airbnb", preview: "The wifi password isn't working, help?",
    timestamp: "2026-03-22T16:00:00Z", propertyName: "Mountain Cabin",
    tags: ["support"], isUnread: false, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-sofia", assignedToName: "Sofia Martins",
    isAssignedToMe: false, autoAssigned: true,
  },
  {
    id: "7", guestName: "Yuki Tanaka", guestEmail: "yuki.tanaka@example.com",
    channel: "booking", preview: "Is there parking available at the property?",
    timestamp: "2026-03-22T14:20:00Z", propertyName: "City Apartment",
    tags: ["question"], isUnread: true, isStarred: false, isSnoozed: false,
    isResolved: false, isAssignedToMe: false,
    // unassigned
  },
  {
    id: "8", guestName: "François Dupont", guestEmail: "francois.dupont@example.com",
    channel: "whatsapp", preview: "Merci pour le séjour, c'était parfait!",
    timestamp: "2026-03-21T11:00:00Z", propertyName: "Lakeside Cottage",
    tags: ["feedback"], isUnread: false, isStarred: false, isSnoozed: false,
    isResolved: true, assignedTo: "agent-ana", assignedToName: "Ana Costa",
    isAssignedToMe: false,
  },
  {
    id: "9", guestName: "Lisa Chen", guestEmail: "lisa.chen@example.com",
    channel: "vrbo", preview: "Can we bring our dog? Is the property pet-friendly?",
    timestamp: "2026-03-21T09:30:00Z", propertyName: "Mountain Cabin",
    tags: ["inquiry"], isUnread: true, isStarred: false, isSnoozed: false,
    isResolved: false, isAssignedToMe: false,
    // unassigned
  },
  {
    id: "10", guestName: "Ahmed Hassan", guestEmail: "ahmed.hassan@example.com",
    channel: "email", preview: "Invoice request for business trip expenses",
    timestamp: "2026-03-20T15:45:00Z", propertyName: "Luxury Suite",
    tags: ["invoice"], isUnread: false, isStarred: false, isSnoozed: false,
    isResolved: false, assignedTo: "agent-joao", assignedToName: "João Ferreira",
    isAssignedToMe: false, autoAssigned: false,
  },
  {
    id: "11", guestName: "Claire Dubois", guestEmail: "claire.dubois@example.com",
    channel: "expedia", preview: "Pool maintenance issue during our stay",
    timestamp: "2026-03-20T12:00:00Z", propertyName: "Beachfront Villa",
    tags: ["maintenance", "urgent"], isUnread: true, isStarred: true, isSnoozed: false,
    isResolved: false, assignedTo: "agent-pedro", assignedToName: "Pedro Almeida",
    isAssignedToMe: false, autoAssigned: true,
  },
  {
    id: "12", guestName: "Ravi Patel", guestEmail: "ravi.patel@example.com",
    channel: "airbnb", preview: "Amazing property! 5 stars, will recommend",
    timestamp: "2026-03-19T20:15:00Z", propertyName: "Luxury Suite",
    tags: ["feedback"], isUnread: false, isStarred: false, isSnoozed: false,
    isResolved: true, assignedTo: "agent-tiago", assignedToName: "Tiago Santos",
    isAssignedToMe: false,
  },
];

// Raw conversation data for ConversationView
const rawConversations = [
  { id: "1", subject: "Booking Inquiry - Beachfront Villa", from: "Sarah Miller <sarah.miller@example.com>", date: "2026-03-23T10:30:00Z", preview: "Interested in booking...", isRead: false, labels: ["booking"], inboxType: "main" as const, messages: [{ id: "msg-1", from: "Sarah Miller <sarah.miller@example.com>", to: "bookings@hostsy.com", date: "2026-03-23T10:30:00Z", content: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing for September 15-22?", isRead: false }] },
  { id: "2", subject: "Mountain Cabin Amenities", from: "John Davis <john.davis@example.com>", date: "2026-03-23T09:15:00Z", preview: "Question about amenities...", isRead: false, labels: ["question"], inboxType: "main" as const, messages: [{ id: "msg-2", from: "John Davis <john.davis@example.com>", to: "info@hostsy.com", date: "2026-03-23T09:15:00Z", content: "Question about the mountain cabin amenities. Does it have a hot tub?", isRead: false }] },
  { id: "3", subject: "Check-in Instructions", from: "Maria Rodriguez <maria.r@example.com>", date: "2026-03-23T08:45:00Z", preview: "Check-in instructions...", isRead: true, labels: ["check-in"], inboxType: "main" as const, messages: [{ id: "msg-3", from: "Maria Rodriguez <maria.r@example.com>", to: "info@hostsy.com", date: "2026-03-23T08:45:00Z", content: "Check-in instructions please? Arriving at 3pm today.", isRead: true }] },
  { id: "4", subject: "Late Checkout Request", from: "Hans Weber <hans.weber@example.com>", date: "2026-03-22T22:10:00Z", preview: "Late checkout...", isRead: false, labels: ["late-checkout"], inboxType: "main" as const, messages: [{ id: "msg-4", from: "Hans Weber <hans.weber@example.com>", to: "info@hostsy.com", date: "2026-03-22T22:10:00Z", content: "Ist es möglich, spät auszuchecken? Wir würden gerne bis 14 Uhr bleiben.", isRead: false }] },
  { id: "5", subject: "Cancellation Request", from: "Emma Thompson <emma.thompson@example.com>", date: "2026-03-22T18:30:00Z", preview: "Need to cancel...", isRead: false, labels: ["cancellation", "urgent"], inboxType: "main" as const, messages: [{ id: "msg-5", from: "Emma Thompson <emma.thompson@example.com>", to: "bookings@hostsy.com", date: "2026-03-22T18:30:00Z", content: "We need to cancel our reservation unfortunately. Something came up. Can we get a refund?", isRead: false }] },
  { id: "6", subject: "WiFi Issue", from: "Luca Bianchi <luca.bianchi@example.com>", date: "2026-03-22T16:00:00Z", preview: "Wifi not working...", isRead: true, labels: ["support"], inboxType: "main" as const, messages: [{ id: "msg-6", from: "Luca Bianchi <luca.bianchi@example.com>", to: "support@hostsy.com", date: "2026-03-22T16:00:00Z", content: "The wifi password isn't working, help? I've tried multiple times.", isRead: true }] },
  { id: "7", subject: "Parking Question", from: "Yuki Tanaka <yuki.tanaka@example.com>", date: "2026-03-22T14:20:00Z", preview: "Parking available?", isRead: false, labels: ["question"], inboxType: "main" as const, messages: [{ id: "msg-7", from: "Yuki Tanaka <yuki.tanaka@example.com>", to: "info@hostsy.com", date: "2026-03-22T14:20:00Z", content: "Is there parking available at the property? We'll be driving.", isRead: false }] },
  { id: "8", subject: "Thank You", from: "François Dupont <francois.dupont@example.com>", date: "2026-03-21T11:00:00Z", preview: "Merci...", isRead: true, labels: ["feedback"], inboxType: "main" as const, messages: [{ id: "msg-8", from: "François Dupont <francois.dupont@example.com>", to: "info@hostsy.com", date: "2026-03-21T11:00:00Z", content: "Merci pour le séjour, c'était parfait! We had a wonderful time.", isRead: true }] },
  { id: "9", subject: "Pet Policy", from: "Lisa Chen <lisa.chen@example.com>", date: "2026-03-21T09:30:00Z", preview: "Pet-friendly?", isRead: false, labels: ["inquiry"], inboxType: "main" as const, messages: [{ id: "msg-9", from: "Lisa Chen <lisa.chen@example.com>", to: "info@hostsy.com", date: "2026-03-21T09:30:00Z", content: "Can we bring our dog? Is the property pet-friendly? She's a small breed.", isRead: false }] },
  { id: "10", subject: "Invoice Request", from: "Ahmed Hassan <ahmed.hassan@example.com>", date: "2026-03-20T15:45:00Z", preview: "Invoice for expenses...", isRead: true, labels: ["invoice"], inboxType: "main" as const, messages: [{ id: "msg-10", from: "Ahmed Hassan <ahmed.hassan@example.com>", to: "billing@hostsy.com", date: "2026-03-20T15:45:00Z", content: "Invoice request for business trip expenses. Need it for company reimbursement.", isRead: true }] },
  { id: "11", subject: "Pool Maintenance Issue", from: "Claire Dubois <claire.dubois@example.com>", date: "2026-03-20T12:00:00Z", preview: "Pool issue...", isRead: false, labels: ["maintenance", "urgent"], inboxType: "main" as const, messages: [{ id: "msg-11", from: "Claire Dubois <claire.dubois@example.com>", to: "support@hostsy.com", date: "2026-03-20T12:00:00Z", content: "Pool maintenance issue during our stay. The water looks green.", isRead: false }] },
  { id: "12", subject: "Great Stay Review", from: "Ravi Patel <ravi.patel@example.com>", date: "2026-03-19T20:15:00Z", preview: "5 stars!...", isRead: true, labels: ["feedback"], inboxType: "main" as const, messages: [{ id: "msg-12", from: "Ravi Patel <ravi.patel@example.com>", to: "info@hostsy.com", date: "2026-03-19T20:15:00Z", content: "Amazing property! 5 stars, will recommend to all our friends.", isRead: true }] },
];

const guestProfiles: Record<string, { totalStays: number; totalSpent: number; memberSince: string; preferredLanguage: string; vipStatus: string; phone?: string }> = {
  "1": { totalStays: 2, totalSpent: 5600, memberSince: "2023-06-15", preferredLanguage: "en", vipStatus: "silver", phone: "+1 555-0101" },
  "2": { totalStays: 1, totalSpent: 1200, memberSince: "2024-01-01", preferredLanguage: "en", vipStatus: "none" },
  "3": { totalStays: 4, totalSpent: 9200, memberSince: "2022-08-20", preferredLanguage: "es", vipStatus: "gold", phone: "+34 612-345-678" },
  "4": { totalStays: 1, totalSpent: 800, memberSince: "2024-01-10", preferredLanguage: "de", vipStatus: "none" },
  "5": { totalStays: 3, totalSpent: 7500, memberSince: "2023-03-12", preferredLanguage: "en", vipStatus: "silver" },
  "6": { totalStays: 2, totalSpent: 3400, memberSince: "2023-09-05", preferredLanguage: "it", vipStatus: "none", phone: "+39 333-1234567" },
  "7": { totalStays: 1, totalSpent: 950, memberSince: "2025-12-01", preferredLanguage: "ja", vipStatus: "none" },
  "8": { totalStays: 5, totalSpent: 12000, memberSince: "2021-05-15", preferredLanguage: "fr", vipStatus: "platinum", phone: "+33 6 12 34 56 78" },
  "9": { totalStays: 1, totalSpent: 1100, memberSince: "2025-11-20", preferredLanguage: "en", vipStatus: "none", phone: "+1 555-0109" },
  "10": { totalStays: 3, totalSpent: 6800, memberSince: "2023-07-10", preferredLanguage: "ar", vipStatus: "gold" },
  "11": { totalStays: 2, totalSpent: 4200, memberSince: "2024-03-01", preferredLanguage: "fr", vipStatus: "silver" },
  "12": { totalStays: 6, totalSpent: 15000, memberSince: "2020-11-01", preferredLanguage: "en", vipStatus: "platinum", phone: "+91 98765 43210" },
};

const bookingData: Record<string, { reservationCode: string; propertyName: string; checkIn: string; checkOut: string; status: string; platform: string; totalAmount: number; currency: string }> = {
  "1": { reservationCode: "HMABCD123", propertyName: "Beachfront Villa", checkIn: "2026-09-15T15:00:00Z", checkOut: "2026-09-22T11:00:00Z", status: "upcoming", platform: "Email", totalAmount: 2800, currency: "USD" },
  "3": { reservationCode: "HMEFGH456", propertyName: "Lakeside Cottage", checkIn: "2026-03-23T15:00:00Z", checkOut: "2026-03-28T11:00:00Z", status: "current", platform: "WhatsApp", totalAmount: 1400, currency: "USD" },
  "4": { reservationCode: "HMIJKL789", propertyName: "City Apartment", checkIn: "2026-03-24T14:00:00Z", checkOut: "2026-03-27T11:00:00Z", status: "upcoming", platform: "Booking", totalAmount: 600, currency: "EUR" },
};

type TabType = "all" | "unread" | "mine" | "important";
type PrivateSubTab = "my" | "all_agents";

export const InboxContainer = () => {
  const location = useLocation();
  const isPrivateInbox = location.pathname === "/inbox/private";
  const { currentUser, isSenior, onShiftAgents, allMembers } = useTeam();
  const { toast } = useToast();

  // Build conversations with isAssignedToMe based on current user
  const initialConversations = useMemo(() => {
    return buildSampleConversations().map(c => ({
      ...c,
      isAssignedToMe: c.assignedTo === currentUser.id,
    }));
  }, [currentUser.id]);

  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [activeChannels, setActiveChannels] = useState<ConversationSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilterValue>(null);
  const [privateSubTab, setPrivateSubTab] = useState<PrivateSubTab>("my");

  // Update isAssignedToMe when currentUser changes
  useMemo(() => {
    setConversations(prev => prev.map(c => ({
      ...c,
      isAssignedToMe: c.assignedTo === currentUser.id,
    })));
  }, [currentUser.id]);

  // Filter logic
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Inbox type filtering
    if (isPrivateInbox) {
      if (privateSubTab === "my") {
        result = result.filter(c => c.assignedTo === currentUser.id);
      }
      // "all_agents" shows all assigned (for seniors)
      if (privateSubTab === "all_agents" && isSenior) {
        result = result.filter(c => !!c.assignedTo);
      }
    } else {
      // Main Inbox
      if (isSenior) {
        // Seniors see everything
      } else {
        // Support sees only unassigned
        result = result.filter(c => !c.assignedTo);
      }
    }

    // Hide resolved unless toggle is on
    if (!showResolved) {
      result = result.filter(c => !c.isResolved);
    }

    // Tab filter
    switch (activeTab) {
      case "unread":
        result = result.filter(c => c.isUnread);
        break;
      case "mine":
        result = result.filter(c => c.isAssignedToMe);
        break;
      case "important":
        result = result.filter(c => c.isStarred);
        break;
    }

    // Quick filters
    if (quickFilter === "checkin_today") {
      result = result.filter(c => c.checkIn && isToday(parseISO(c.checkIn)));
    } else if (quickFilter === "checkout_today") {
      result = result.filter(c => c.checkOut && isToday(parseISO(c.checkOut)));
    } else if (quickFilter === "arriving_this_week") {
      result = result.filter(c => c.checkIn && isThisWeek(parseISO(c.checkIn)));
    } else if (quickFilter === "urgent") {
      result = result.filter(c => c.tags.includes("urgent"));
    } else if (quickFilter === "tagged") {
      result = result.filter(c => c.tags.length > 0);
    } else if (quickFilter === "unassigned") {
      result = result.filter(c => !c.assignedTo);
    }

    if (activeChannels.length > 0) {
      result = result.filter(c => activeChannels.includes(c.channel));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.guestName.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q) ||
        c.propertyName?.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [conversations, activeTab, activeChannels, searchQuery, showResolved, quickFilter, isPrivateInbox, privateSubTab, currentUser.id, isSenior]);

  const toggleChannel = (ch: ConversationSource) => {
    setActiveChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleSnooze = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isSnoozed: !c.isSnoozed } : c));
    toast({ title: "Conversation snoozed" });
  };

  const handleResolve = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, isResolved: true } : c));
    if (selectedId === id) setSelectedId(null);
    toast({ title: "Marked as resolved" });
  };

  const handleAssign = (id: string, agentId?: string) => {
    const targetId = agentId || currentUser.id;
    const agent = getAgentById(targetId);
    setConversations(prev => prev.map(c => c.id === id ? {
      ...c,
      assignedTo: targetId,
      assignedToName: agent?.name || currentUser.name,
      isAssignedToMe: targetId === currentUser.id,
      autoAssigned: false,
    } : c));
    toast({ title: `Assigned to ${agent?.name || currentUser.name}` });
  };

  const handleUnassign = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? {
      ...c,
      assignedTo: undefined,
      assignedToName: undefined,
      isAssignedToMe: false,
      autoAssigned: false,
    } : c));
    toast({ title: "Returned to Main Inbox" });
  };

  const selectedConversation = selectedId ? rawConversations.find(c => c.id === selectedId) : null;
  const selectedInboxConv = selectedId ? conversations.find(c => c.id === selectedId) : null;
  const guestProfile = selectedId ? guestProfiles[selectedId] : null;
  const booking = selectedId ? bookingData[selectedId] : undefined;

  // Tab counts
  const visibleConvs = conversations.filter(c => {
    if (isPrivateInbox) {
      return privateSubTab === "my" ? c.assignedTo === currentUser.id : !!c.assignedTo;
    }
    return isSenior ? true : !c.assignedTo;
  });
  const allCount = visibleConvs.filter(c => !c.isResolved).length;
  const unreadCount = visibleConvs.filter(c => c.isUnread && !c.isResolved).length;
  const mineCount = visibleConvs.filter(c => c.isAssignedToMe && !c.isResolved).length;
  const importantCount = visibleConvs.filter(c => c.isStarred && !c.isResolved).length;

  const channelUnreadCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const sources: ConversationSource[] = ["email", "airbnb", "booking", "whatsapp", "vrbo", "expedia"];
    sources.forEach(ch => {
      counts[ch] = conversations.filter(c => c.channel === ch && c.isUnread && !c.isResolved).length;
    });
    return counts as Record<ConversationSource, number>;
  }, [conversations]);

  // For "All Agents" view, group by agent
  const groupedByAgent = useMemo(() => {
    if (!isPrivateInbox || privateSubTab !== "all_agents") return null;
    const groups: Record<string, InboxConversation[]> = {};
    allMembers.forEach(m => { groups[m.id] = []; });
    filteredConversations.forEach(c => {
      if (c.assignedTo && groups[c.assignedTo]) {
        groups[c.assignedTo].push(c);
      }
    });
    return groups;
  }, [filteredConversations, allMembers, isPrivateInbox, privateSubTab]);

  // Check if current conversation is assigned to someone else (for senior banner)
  const isViewingOthersConversation = selectedInboxConv && selectedInboxConv.assignedTo && selectedInboxConv.assignedTo !== currentUser.id && isSenior;

  return (
    <div className="h-[calc(100vh-5rem)] bg-card rounded-lg border border-border overflow-hidden flex">
      {/* Column A — Conversation List (300px) */}
      <div className="w-[300px] shrink-0 flex flex-col border-r border-border">
        {/* On-shift indicator */}
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {isPrivateInbox ? "My Inbox" : "Main Inbox"}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                {onShiftAgents.length} on-shift
                <Info className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <p className="text-xs font-semibold">Today's Shift</p>
                {allMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${m.isOnline ? 'bg-emerald-500' : 'bg-destructive'}`} />
                    <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: m.avatarColor }}>
                      {m.name.charAt(0)}
                    </div>
                    <span className="text-xs">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto capitalize">{m.role}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Private Inbox sub-tabs for Seniors */}
        {isPrivateInbox && isSenior && (
          <div className="border-b border-border">
            <Tabs value={privateSubTab} onValueChange={v => setPrivateSubTab(v as PrivateSubTab)}>
              <TabsList className="w-full rounded-none h-9 bg-transparent p-0">
                <TabsTrigger value="my" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  My Conversations
                </TabsTrigger>
                <TabsTrigger value="all_agents" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  All Agents
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabType)}>
          <TabsList className="w-full rounded-none border-b h-10 bg-transparent p-0">
            <TabsTrigger value="all" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              All <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">{allCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Unread <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">{unreadCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="mine" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Mine <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">{mineCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="important" className="flex-1 rounded-none text-xs data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              Important <Badge variant="secondary" className="ml-1 text-[9px] h-4 px-1">{importantCount}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter Dropdowns */}
        <InboxFilterDropdowns
          activeChannels={activeChannels}
          onToggleChannel={toggleChannel}
          onClearChannels={() => setActiveChannels([])}
          quickFilter={quickFilter}
          onSetQuickFilter={setQuickFilter}
          channelUnreadCounts={channelUnreadCounts}
        />
        {/* Search */}
        <div className="px-4 py-2.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 h-9 text-xs"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Show resolved toggle */}
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <Label className="text-[10px] text-muted-foreground">Show resolved</Label>
          <Switch checked={showResolved} onCheckedChange={setShowResolved} className="scale-75" />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isPrivateInbox && privateSubTab === "all_agents" && isSenior && groupedByAgent ? (
            // All Agents grouped view
            <div>
              {allMembers.map(member => {
                const agentConvs = groupedByAgent[member.id] || [];
                return (
                  <Collapsible key={member.id} defaultOpen={agentConvs.length > 0}>
                    <CollapsibleTrigger className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted/50 border-b border-border">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: member.avatarColor }}>
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium flex-1 text-left">{member.name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{member.role}</span>
                      <Badge variant="secondary" className="text-[9px] h-4 px-1">{agentConvs.length}</Badge>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {agentConvs.length === 0 ? (
                        <div className="px-4 py-3 text-[10px] text-muted-foreground italic">No active conversations</div>
                      ) : (
                        agentConvs.map(conv => (
                          <InboxConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedId === conv.id}
                            onSelect={setSelectedId}
                            onSnooze={handleSnooze}
                            onResolve={handleResolve}
                            onAssign={handleAssign}
                          />
                        ))
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          ) : (
            // Normal list view
            filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <InboxConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedId === conv.id}
                  onSelect={setSelectedId}
                  onSnooze={handleSnooze}
                  onResolve={handleResolve}
                  onAssign={(id) => handleAssign(id)}
                  showPickUp={!isPrivateInbox && !conv.assignedTo}
                  onPickUp={() => handleAssign(conv.id)}
                />
              ))
            )
          )}
        </div>
      </div>

      {/* Column B — Active Conversation (flex) */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Senior banner when viewing other's conversation */}
            {isViewingOthersConversation && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-800 dark:text-amber-200">
                This conversation is assigned to <strong>{selectedInboxConv?.assignedToName}</strong>
              </div>
            )}
            <ConversationView
              conversation={selectedConversation}
              guestName={selectedInboxConv?.guestName || ""}
              guestAvatarUrl={selectedInboxConv?.guestAvatarUrl}
              channel={selectedInboxConv?.channel || "email"}
              reservationCode={booking?.reservationCode}
              propertyName={selectedInboxConv?.propertyName}
              tags={selectedInboxConv?.tags || []}
              onBack={() => setSelectedId(null)}
              onReply={(content) => console.log("Reply:", content)}
              onAssign={(agentId) => handleAssign(selectedId!, agentId)}
              onTag={(tag) => {
                setConversations(prev => prev.map(c =>
                  c.id === selectedId ? { ...c, tags: [...c.tags, tag] } : c
                ));
              }}
              onSnooze={() => handleSnooze(selectedId!)}
              onResolve={() => handleResolve(selectedId!)}
              showReturnToMain={isPrivateInbox && selectedInboxConv?.assignedTo === currentUser.id}
              onReturnToMain={() => selectedId && handleUnassign(selectedId)}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Send className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a conversation to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Column C — Guest Context Panel (360px) */}
      {selectedInboxConv && guestProfile && (
        <GuestContextPanel
          guest={{
            name: selectedInboxConv.guestName,
            email: selectedInboxConv.guestEmail,
            avatarUrl: selectedInboxConv.guestAvatarUrl,
            ...guestProfile,
          }}
          booking={booking}
          propertyName={selectedInboxConv.propertyName}
        />
      )}
    </div>
  );
};
