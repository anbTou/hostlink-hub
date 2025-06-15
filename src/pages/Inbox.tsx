
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { ThreadedConversationList } from "@/components/inbox/ThreadedConversationList";
import { SmartFilters } from "@/components/inbox/SmartFilters";
import { BulkActionBar } from "@/components/inbox/BulkActionBar";
import { PerformanceDashboard } from "@/components/inbox/PerformanceDashboard";
import { AIInsightsPanel } from "@/components/inbox/AIInsightsPanel";
import { FilterOptions, ConversationThread } from "@/types/inbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useCollisionPrevention } from "@/hooks/useCollisionPrevention";

// Sample conversation data
const sampleConversations = [
  {
    id: "1",
    subject: "Booking Inquiry - Beachfront Villa",
    from: "Sarah Miller <sarah.miller@example.com>",
    date: "2024-01-15T10:30:00Z",
    preview: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing?",
    isRead: false,
    labels: ["urgent", "booking"],
    messages: [
      {
        id: "msg-1",
        from: "Sarah Miller <sarah.miller@example.com>",
        to: "bookings@property.com",
        date: "2024-01-15T10:30:00Z",
        content: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing for September 15-22?",
        isRead: false
      }
    ]
  },
  {
    id: "2",
    subject: "Question about Mountain Cabin",
    from: "John Davis <john.davis@example.com>",
    date: "2024-01-14T14:00:00Z",
    preview: "I have a question about the amenities at the mountain cabin. Does it have a fireplace and is firewood provided?",
    isRead: true,
    labels: ["question"],
    messages: [
      {
        id: "msg-2",
        from: "John Davis <john.davis@example.com>",
        to: "info@property.com",
        date: "2024-01-14T14:00:00Z",
        content: "I have a question about the amenities at the mountain cabin. Does it have a fireplace and is firewood provided?",
        isRead: true
      }
    ]
  },
  {
    id: "3",
    subject: "Feedback on Lakeside Cottage",
    from: "Maria Rodriguez <maria.r@example.com>",
    date: "2024-01-13T18:45:00Z",
    preview: "We had a wonderful stay at the lakeside cottage! The view was amazing, and we enjoyed the peaceful atmosphere. We'll definitely be back!",
    isRead: true,
    labels: ["feedback", "positive"],
    messages: [
      {
        id: "msg-3",
        from: "Maria Rodriguez <maria.r@example.com>",
        to: "feedback@property.com",
        date: "2024-01-13T18:45:00Z",
        content: "We had a wonderful stay at the lakeside cottage! The view was amazing, and we enjoyed the peaceful atmosphere. We'll definitely be back!",
        isRead: true
      }
    ]
  },
  {
    id: "4",
    subject: "Inquiry about City Apartment",
    from: "Thomas Brown <t.brown@example.com>",
    date: "2024-01-12T09:15:00Z",
    preview: "I'm interested in renting the city apartment for a week in February. Could you tell me more about the parking situation?",
    isRead: false,
    labels: ["inquiry", "parking"],
    messages: [
      {
        id: "msg-4",
        from: "Thomas Brown <t.brown@example.com>",
        to: "rentals@property.com",
        date: "2024-01-12T09:15:00Z",
        content: "I'm interested in renting the city apartment for a week in February. Could you tell me more about the parking situation?",
        isRead: false
      }
    ]
  },
  {
    id: "5",
    subject: "Request for Restaurant Recommendations",
    from: "Emma Wilson <emma.wilson@example.com>",
    date: "2024-01-11T16:20:00Z",
    preview: "We're staying at the luxury suite next month and would love some recommendations for local restaurants. We're particularly interested in Italian cuisine.",
    isRead: true,
    labels: ["recommendation", "restaurant"],
    messages: [
      {
        id: "msg-5",
        from: "Emma Wilson <emma.wilson@example.com>",
        to: "concierge@property.com",
        date: "2024-01-11T16:20:00Z",
        content: "We're staying at the luxury suite next month and would love some recommendations for local restaurants. We're particularly interested in Italian cuisine.",
        isRead: true
      }
    ]
  }
];

const InboxPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<"inbox" | "threaded">("inbox");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "important">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    platforms: [],
    dateRange: { start: undefined, end: undefined },
    priority: [],
    assignedTo: undefined,
    tags: [],
    hasAttachments: undefined,
    isUnread: undefined
  });
  
  const collisionPrevention = useCollisionPrevention();

  const handleSelectConversation = (conversationId: string) => {
    const conversation = sampleConversations.find(c => c.id === conversationId);
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleReply = (content: string) => {
    console.log("Reply content:", content);
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(item => item !== id)
    );
  };

  const filteredConversations = sampleConversations.filter(conv => {
    switch (activeTab) {
      case "unread":
        return !conv.isRead;
      case "important":
        return conv.labels.includes("urgent");
      default:
        return true;
    }
  });

  // Convert conversations to expected format for ConversationList
  const adaptedConversations = filteredConversations.map(conv => ({
    id: conv.id,
    contact: {
      id: conv.id,
      name: conv.from.split('<')[0].trim(),
      email: conv.from,
      isOnline: false,
      lastSeen: conv.date
    },
    lastMessage: {
      id: conv.messages[conv.messages.length - 1]?.id || '',
      text: conv.preview,
      time: conv.date,
      timestamp: conv.date,
      sender: 'contact' as const,
      isUnread: !conv.isRead
    },
    source: 'email' as const,
    status: conv.isRead ? 'done' as const : 'todo' as const,
    priority: conv.labels.includes('urgent') ? 'urgent' as const : 'medium' as const,
    unreadCount: conv.isRead ? 0 : 1,
    tags: conv.labels,
    isAssigned: false,
    assignedTo: undefined
  }));

  // Build array of ConversationThread objects for threaded view
  const adaptedThreads: ConversationThread[] = filteredConversations.map(conv => ({
    id: conv.id,
    guest: {
      id: conv.id,
      name: conv.from.split('<')[0].trim(),
      email: conv.from,
      totalStays: 1,
      totalSpent: 0,
      memberSince: "2024-01-01",
      preferredLanguage: "en",
      vipStatus: "none"
    },
    messages: conv.messages.map(msg => ({
      id: msg.id,
      threadId: conv.id,
      text: msg.content,
      sender: "contact",
      timestamp: msg.date,
      platform: "email",
      isRead: msg.isRead
    })),
    relatedBookings: [],
    priority: conv.labels.includes('urgent') ? 'urgent' : 'medium',
    tags: conv.labels,
    lastActivity: conv.date
  }));

  // Sample performance data with correct structure (fix platformDistribution)
  const performanceData = {
    responseTimeData: [
      { date: "2024-01-15", avgTime: 2.5, target: 3.0 }
    ],
    satisfactionData: [
      { platform: "email", score: 4.8, count: 150 }
    ],
    volumeData: [
      { date: "2024-01-15", messages: 45, resolved: 40 }
    ],
    platformDistribution: [
      { name: "Email", value: 120, color: "#8884d8" }, // Fix example
    ],
    teamStats: [
      { name: "John Doe", responseTime: 2.1, satisfaction: 4.9, volume: 25 }
    ]
  };

  // Sample thread data for AI insights
  const sampleThread = selectedConversation ? {
    id: selectedConversation.id,
    guest: {
      id: "guest-1",
      name: selectedConversation.from.split('<')[0].trim(),
      email: selectedConversation.from,
      totalStays: 3,
      totalSpent: 2500,
      memberSince: "2023-01-15",
      preferredLanguage: "en",
      vipStatus: "none" as const
    },
    messages: selectedConversation.messages.map((msg: any) => ({
      id: msg.id,
      threadId: selectedConversation.id,
      text: msg.content,
      sender: "contact" as const,
      timestamp: msg.date,
      platform: "email" as const,
      isRead: msg.isRead
    })),
    relatedBookings: [],
    priority: "medium" as const,
    tags: selectedConversation.labels,
    lastActivity: selectedConversation.date
  } : null;

  return (
    <MainLayout>
      <div className="h-full bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
        <div className="flex h-full">
          {!selectedConversation && (
            <div className="w-full">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h1 className="text-xl font-bold">Inbox</h1>
                <div className="flex items-center gap-2">
                  <SmartFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                  <PerformanceDashboard data={performanceData} />
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <BulkActionBar 
                  selectedCount={selectedItems.length}
                  onAction={(action) => console.log('Bulk action:', action)}
                  onClear={() => setSelectedItems([])}
                />
              )}
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                  <TabsTrigger value="important" className="flex-1">Important</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="m-0">
                  <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                    <TabsList className="w-full rounded-none border-b">
                      <TabsTrigger value="inbox" className="flex-1">List View</TabsTrigger>
                      <TabsTrigger value="threaded" className="flex-1">Threaded View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="inbox" className="m-0">
                      <ConversationList 
                        conversations={adaptedConversations}
                        selectedConversationId={selectedConversation?.id}
                        onSelectConversation={handleSelectConversation}
                        selectedItems={selectedItems}
                        onSelectItem={handleSelectItem}
                      />
                    </TabsContent>
                    
                    <TabsContent value="threaded" className="m-0">
                      <ThreadedConversationList 
                        threads={adaptedThreads}
                        onSelectThread={handleSelectConversation}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {selectedConversation && (
            <div className="w-full relative">
              <ConversationView 
                conversation={selectedConversation}
                onBack={handleBack}
                onReply={handleReply}
              />
            </div>
          )}
          
          {sampleThread && (
            <AIInsightsPanel 
              thread={sampleThread}
              onApplySuggestion={(suggestion) => console.log('Applying suggestion:', suggestion)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InboxPage;
