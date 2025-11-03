import { useState } from "react";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { ThreadedConversationList } from "@/components/inbox/ThreadedConversationList";
import { SmartFilters } from "@/components/inbox/SmartFilters";
import { BulkActionBar } from "@/components/inbox/BulkActionBar";
import { PerformanceDashboard } from "@/components/inbox/PerformanceDashboard";
import { FilterOptions, ConversationThread, BulkAction, InboxType } from "@/types/inbox";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { filterByInboxType } from "@/services/inboxFilterService";
import { useCollisionPrevention } from "@/hooks/useCollisionPrevention";

interface InboxContainerProps {
  inboxType: InboxType;
  sampleConversations: any[];
}

export const InboxContainer = ({ inboxType, sampleConversations }: InboxContainerProps) => {
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
    isUnread: undefined,
    inboxType
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

  const handleBulkAction = (action: BulkAction, itemIds: string[]) => {
    console.log("Bulk action:", action, "on items:", itemIds);
    setSelectedItems([]);
  };

  // Filter conversations by inbox type first
  const inboxFilteredConversations = sampleConversations.filter(conv => 
    conv.inboxType === inboxType
  );

  const filteredConversations = inboxFilteredConversations.filter(conv => {
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
    isAssigned: !!conv.assignedToUser,
    assignedTo: conv.assignedToUser
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
      vipStatus: "none" as const
    },
    messages: conv.messages.map((msg: any) => ({
      id: msg.id,
      threadId: conv.id,
      text: msg.content,
      sender: "contact" as const,
      timestamp: msg.date,
      platform: "email" as const,
      isRead: msg.isRead
    })),
    relatedBookings: [],
    priority: conv.labels.includes('urgent') ? 'urgent' as const : 'medium' as const,
    tags: conv.labels,
    lastActivity: conv.date,
    inboxType: conv.inboxType,
    assignedToUser: conv.assignedToUser
  }));

  // Sample performance data
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
      { name: "Email", value: 120, color: "#8884d8" },
    ],
    teamStats: [
      { name: "John Doe", responseTime: 2.1, satisfaction: 4.9, volume: 25 }
    ]
  };

  const inboxTitle = inboxType === 'main' ? 'Main Inbox' : 'Private Inbox';
  const inboxDescription = inboxType === 'main' 
    ? 'Team-wide conversations' 
    : 'Your personal conversations';

  return (
    <div className="h-full bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
      <div className="flex h-full">
        {!selectedConversation && (
          <div className="w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {inboxTitle}
                  <Badge variant={inboxType === 'main' ? 'default' : 'secondary'}>
                    {inboxFilteredConversations.length}
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground">{inboxDescription}</p>
              </div>
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
                onAction={(action) => handleBulkAction(action, selectedItems)}
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
                      onBulkAction={handleBulkAction}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {selectedConversation && (
          <div className="w-full">
            <ConversationView 
              conversation={selectedConversation}
              onBack={handleBack}
              onReply={handleReply}
            />
          </div>
        )}
      </div>
    </div>
  );
};
