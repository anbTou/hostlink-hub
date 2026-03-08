import { useState, useMemo } from "react";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConversationView } from "@/components/inbox/ConversationView";
import { GuestContextPanel } from "@/components/inbox/GuestContextPanel";
import { ChannelFilterBar } from "@/components/inbox/ChannelFilterBar";
import { InboxConversationItem, InboxConversation } from "@/components/inbox/InboxConversationItem";
import { ConversationSource } from "@/types/inbox";
import { getCurrentUser } from "@/types/team";
import { useToast } from "@/hooks/use-toast";

// Enriched sample data
const currentUser = getCurrentUser();

const sampleConversations: InboxConversation[] = [
  {
    id: "1",
    guestName: "Sarah Miller",
    guestEmail: "sarah.miller@example.com",
    channel: "airbnb",
    preview: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September.",
    timestamp: "2024-01-15T10:30:00Z",
    propertyName: "Beachfront Villa",
    tags: ["booking", "urgent"],
    isUnread: true,
    isStarred: true,
    isSnoozed: false,
    isResolved: false,
    assignedTo: currentUser.id,
    assignedToName: currentUser.name,
    isAssignedToMe: true,
  },
  {
    id: "2",
    guestName: "John Davis",
    guestEmail: "john.davis@example.com",
    channel: "email",
    preview: "Does the mountain cabin have a fireplace and is firewood provided?",
    timestamp: "2024-01-14T14:00:00Z",
    propertyName: "Mountain Cabin",
    tags: ["question"],
    isUnread: false,
    isStarred: false,
    isSnoozed: false,
    isResolved: false,
    isAssignedToMe: false,
  },
  {
    id: "3",
    guestName: "Maria Rodriguez",
    guestEmail: "maria.r@example.com",
    channel: "booking",
    preview: "We had a wonderful stay at the lakeside cottage! The view was amazing.",
    timestamp: "2024-01-13T18:45:00Z",
    propertyName: "Lakeside Cottage",
    tags: ["feedback"],
    isUnread: false,
    isStarred: false,
    isSnoozed: false,
    isResolved: false,
    isAssignedToMe: false,
  },
  {
    id: "4",
    guestName: "Thomas Brown",
    guestEmail: "t.brown@example.com",
    channel: "whatsapp",
    preview: "Hi, I was referred to you. Interested in the city apartment for February.",
    timestamp: "2024-01-12T09:15:00Z",
    propertyName: "City Apartment",
    tags: ["inquiry"],
    isUnread: true,
    isStarred: false,
    isSnoozed: false,
    isResolved: false,
    assignedTo: currentUser.id,
    assignedToName: currentUser.name,
    isAssignedToMe: true,
  },
  {
    id: "5",
    guestName: "Emma Wilson",
    guestEmail: "emma.wilson@example.com",
    channel: "vrbo",
    preview: "Would love your personal recommendations for local restaurants near the suite.",
    timestamp: "2024-01-11T16:20:00Z",
    propertyName: "Luxury Suite",
    tags: ["recommendation"],
    isUnread: false,
    isStarred: true,
    isSnoozed: false,
    isResolved: false,
    isAssignedToMe: false,
  },
  {
    id: "6",
    guestName: "David Lee",
    guestEmail: "david.lee@example.com",
    channel: "expedia",
    preview: "Thank you for accommodating our early check-in. We'd like to book again.",
    timestamp: "2024-01-10T11:30:00Z",
    propertyName: "Sunset Apartment",
    tags: ["follow-up"],
    isUnread: true,
    isStarred: false,
    isSnoozed: true,
    snoozeUntil: "2024-01-16T09:00:00Z",
    isResolved: false,
    isAssignedToMe: false,
  },
];

// Raw conversation data for ConversationView (kept for compatibility)
const rawConversations = [
  {
    id: "1", subject: "Booking Inquiry - Beachfront Villa", from: "Sarah Miller <sarah.miller@example.com>",
    date: "2024-01-15T10:30:00Z", preview: "Hi, I'm interested in booking your beachfront villa...",
    isRead: false, labels: ["urgent", "booking"], inboxType: "main" as const,
    messages: [{ id: "msg-1", from: "Sarah Miller <sarah.miller@example.com>", to: "bookings@property.com", date: "2024-01-15T10:30:00Z", content: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing for September 15-22?", isRead: false }]
  },
  {
    id: "2", subject: "Question about Mountain Cabin", from: "John Davis <john.davis@example.com>",
    date: "2024-01-14T14:00:00Z", preview: "Does the mountain cabin have a fireplace?",
    isRead: true, labels: ["question"], inboxType: "main" as const,
    messages: [{ id: "msg-2", from: "John Davis <john.davis@example.com>", to: "info@property.com", date: "2024-01-14T14:00:00Z", content: "I have a question about the amenities at the mountain cabin. Does it have a fireplace and is firewood provided?", isRead: true }]
  },
  {
    id: "3", subject: "Feedback on Lakeside Cottage", from: "Maria Rodriguez <maria.r@example.com>",
    date: "2024-01-13T18:45:00Z", preview: "We had a wonderful stay!",
    isRead: true, labels: ["feedback"], inboxType: "main" as const,
    messages: [{ id: "msg-3", from: "Maria Rodriguez <maria.r@example.com>", to: "feedback@property.com", date: "2024-01-13T18:45:00Z", content: "We had a wonderful stay at the lakeside cottage! The view was amazing, and we enjoyed the peaceful atmosphere.", isRead: true }]
  },
  {
    id: "4", subject: "City Apartment Inquiry", from: "Thomas Brown <t.brown@example.com>",
    date: "2024-01-12T09:15:00Z", preview: "Interested in the city apartment.",
    isRead: false, labels: ["inquiry"], inboxType: "main" as const,
    messages: [{ id: "msg-4", from: "Thomas Brown <t.brown@example.com>", to: "info@property.com", date: "2024-01-12T09:15:00Z", content: "Hi, I was referred to you specifically. I'm interested in renting the city apartment for a week in February.", isRead: false }]
  },
  {
    id: "5", subject: "Restaurant Recommendations", from: "Emma Wilson <emma.wilson@example.com>",
    date: "2024-01-11T16:20:00Z", preview: "Would love restaurant recommendations.",
    isRead: true, labels: ["recommendation"], inboxType: "main" as const,
    messages: [{ id: "msg-5", from: "Emma Wilson <emma.wilson@example.com>", to: "info@property.com", date: "2024-01-11T16:20:00Z", content: "We're staying at the luxury suite next month and would love your personal recommendations for local restaurants.", isRead: true }]
  },
  {
    id: "6", subject: "Follow-up on Special Request", from: "David Lee <david.lee@example.com>",
    date: "2024-01-10T11:30:00Z", preview: "Thank you for the early check-in.",
    isRead: true, labels: ["follow-up"], inboxType: "main" as const,
    messages: [{ id: "msg-6", from: "David Lee <david.lee@example.com>", to: "info@property.com", date: "2024-01-10T11:30:00Z", content: "Thank you for accommodating our early check-in request last time. We'd like to book again with similar arrangements.", isRead: true }]
  },
];

const guestProfiles: Record<string, { totalStays: number; totalSpent: number; memberSince: string; preferredLanguage: string; vipStatus: string; phone?: string }> = {
  "1": { totalStays: 2, totalSpent: 5600, memberSince: "2023-06-15", preferredLanguage: "en", vipStatus: "silver", phone: "+1 555-0101" },
  "2": { totalStays: 1, totalSpent: 1200, memberSince: "2024-01-01", preferredLanguage: "en", vipStatus: "none" },
  "3": { totalStays: 4, totalSpent: 9200, memberSince: "2022-08-20", preferredLanguage: "es", vipStatus: "gold", phone: "+34 612-345-678" },
  "4": { totalStays: 1, totalSpent: 800, memberSince: "2024-01-10", preferredLanguage: "en", vipStatus: "none", phone: "+1 555-0104" },
  "5": { totalStays: 3, totalSpent: 7500, memberSince: "2023-03-12", preferredLanguage: "en", vipStatus: "silver" },
  "6": { totalStays: 2, totalSpent: 3400, memberSince: "2023-09-05", preferredLanguage: "en", vipStatus: "none", phone: "+1 555-0106" },
};

const bookingData: Record<string, { reservationCode: string; propertyName: string; checkIn: string; checkOut: string; status: string; platform: string; totalAmount: number; currency: string }> = {
  "1": { reservationCode: "HMABCD123", propertyName: "Beachfront Villa", checkIn: "2024-09-15T15:00:00Z", checkOut: "2024-09-22T11:00:00Z", status: "upcoming", platform: "Airbnb", totalAmount: 2800, currency: "USD" },
  "4": { reservationCode: "HMEFGH456", propertyName: "City Apartment", checkIn: "2024-02-10T14:00:00Z", checkOut: "2024-02-17T11:00:00Z", status: "upcoming", platform: "WhatsApp", totalAmount: 1400, currency: "USD" },
};

type TabType = "all" | "unread" | "mine" | "important";

export const InboxContainer = () => {
  const [conversations, setConversations] = useState(sampleConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [activeChannels, setActiveChannels] = useState<ConversationSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const { toast } = useToast();

  // Filter logic
  const filteredConversations = useMemo(() => {
    let result = conversations;

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

    // Channel filter
    if (activeChannels.length > 0) {
      result = result.filter(c => activeChannels.includes(c.channel));
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.guestName.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q) ||
        c.propertyName?.toLowerCase().includes(q)
      );
    }

    // Sort by timestamp desc
    return [...result].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [conversations, activeTab, activeChannels, searchQuery, showResolved]);

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

  const handleAssign = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, assignedTo: currentUser.id, assignedToName: currentUser.name, isAssignedToMe: true } : c));
    toast({ title: `Assigned to ${currentUser.name}` });
  };

  const selectedConversation = selectedId ? rawConversations.find(c => c.id === selectedId) : null;
  const selectedInboxConv = selectedId ? conversations.find(c => c.id === selectedId) : null;
  const guestProfile = selectedId ? guestProfiles[selectedId] : null;
  const booking = selectedId ? bookingData[selectedId] : undefined;

  // Tab counts
  const allCount = conversations.filter(c => !c.isResolved).length;
  const unreadCount = conversations.filter(c => c.isUnread && !c.isResolved).length;
  const mineCount = conversations.filter(c => c.isAssignedToMe && !c.isResolved).length;
  const importantCount = conversations.filter(c => c.isStarred && !c.isResolved).length;

  return (
    <div className="h-[calc(100vh-5rem)] bg-card rounded-lg border border-border overflow-hidden flex">
      {/* Column A — Conversation List (300px) */}
      <div className="w-[300px] shrink-0 flex flex-col border-r border-border">
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

        {/* Channel Filter Bar */}
        <ChannelFilterBar
          conversations={conversations}
          activeChannels={activeChannels}
          onToggleChannel={toggleChannel}
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
          {filteredConversations.length === 0 ? (
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
                onAssign={handleAssign}
              />
            ))
          )}
        </div>
      </div>

      {/* Column B — Active Conversation (flex) */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
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
            onAssign={(agentId) => handleAssign(selectedId!)}
            onTag={(tag) => {
              setConversations(prev => prev.map(c =>
                c.id === selectedId ? { ...c, tags: [...c.tags, tag] } : c
              ));
            }}
            onSnooze={() => handleSnooze(selectedId!)}
            onResolve={() => handleResolve(selectedId!)}
          />
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
