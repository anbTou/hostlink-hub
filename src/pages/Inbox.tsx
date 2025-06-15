
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ThreadedConversationList } from "@/components/inbox/ThreadedConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { AIInsightsPanel } from "@/components/inbox/AIInsightsPanel";
import { ContactList } from "@/components/inbox/ContactList";
import { ConversationThread, BulkAction, ConversationSource } from "@/types/inbox";
import { parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Mock data with enhanced threading
const mockThreads: ConversationThread[] = [
  {
    id: "1",
    guest: {
      id: "guest1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1234567890",
      totalStays: 3,
      totalSpent: 2400,
      memberSince: "2022",
      preferredLanguage: "English",
      vipStatus: "gold"
    },
    messages: [
      {
        id: "1",
        threadId: "1",
        text: "Hi! I have a question about the breakfast service. What time is it served and where?",
        sender: "contact",
        timestamp: new Date().toISOString(),
        platform: "email",
        isRead: false,
        emailDetails: {
          from: "sarah.johnson@email.com",
          to: ["host@property.com"],
          subject: "Question about breakfast service"
        },
        aiInsights: [
          { type: "sentiment", value: "neutral", confidence: 0.85 },
          { type: "urgency", value: "low", confidence: 0.9 },
          { type: "language", value: "English", confidence: 0.95 },
          { type: "suggestion", value: "Provide breakfast times and location details", confidence: 0.88 }
        ]
      }
    ],
    relatedBookings: [
      {
        id: "booking1",
        propertyId: "prop1",
        guestId: "guest1",
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        status: "upcoming",
        platform: "airbnb",
        totalAmount: 800,
        currency: "USD"
      }
    ],
    priority: "medium",
    tags: ["breakfast", "amenities"],
    lastActivity: new Date().toISOString(),
    responseTime: 1800, // 30 minutes
    satisfactionScore: 0.85
  },
  {
    id: "2",
    guest: {
      id: "guest2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      totalStays: 1,
      totalSpent: 450,
      memberSince: "2024",
      preferredLanguage: "English",
      vipStatus: "none"
    },
    messages: [
      {
        id: "2",
        threadId: "2",
        text: "The WiFi password isn't working. Can you help?",
        sender: "contact",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        platform: "whatsapp",
        isRead: false,
        aiInsights: [
          { type: "sentiment", value: "neutral", confidence: 0.75 },
          { type: "urgency", value: "high", confidence: 0.92 },
          { type: "suggestion", value: "Provide current WiFi credentials immediately", confidence: 0.95 }
        ]
      }
    ],
    relatedBookings: [],
    priority: "high",
    tags: ["wifi", "technical"],
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
    responseTime: 900 // 15 minutes
  }
];

export default function Inbox() {
  const [selectedThreadId, setSelectedThreadId] = useState<string>();
  const [threads, setThreads] = useState<ConversationThread[]>(mockThreads);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const { toast } = useToast();

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  const handleBulkAction = (action: BulkAction, threadIds: string[]) => {
    console.log("Bulk action:", action, "on threads:", threadIds);
    
    // Simulate bulk actions
    switch (action.type) {
      case 'archive':
        toast({
          title: "Conversations archived",
          description: `${threadIds.length} conversation(s) have been archived.`
        });
        break;
      case 'mark_read':
        setThreads(prev => prev.map(thread => 
          threadIds.includes(thread.id) 
            ? { ...thread, messages: thread.messages.map(m => ({ ...m, isRead: true })) }
            : thread
        ));
        toast({
          title: "Marked as read",
          description: `${threadIds.length} conversation(s) marked as read.`
        });
        break;
      case 'priority':
        setThreads(prev => prev.map(thread => 
          threadIds.includes(thread.id) 
            ? { ...thread, priority: action.value as any }
            : thread
        ));
        toast({
          title: "Priority updated",
          description: `Priority set to ${action.value} for ${threadIds.length} conversation(s).`
        });
        break;
      case 'assign':
        toast({
          title: "Conversations assigned",
          description: `${threadIds.length} conversation(s) assigned to ${action.value}.`
        });
        break;
      case 'delete':
        setThreads(prev => prev.filter(thread => !threadIds.includes(thread.id)));
        toast({
          title: "Conversations deleted",
          description: `${threadIds.length} conversation(s) have been deleted.`,
          variant: "destructive"
        });
        break;
    }
  };

  const handleStatusChange = (threadId: string, status: string) => {
    // Update thread status logic here
    console.log("Status change:", threadId, status);
  };

  const handleApplySuggestion = (suggestion: string) => {
    // Apply AI suggestion to message composition
    console.log("Applying suggestion:", suggestion);
    toast({
      title: "Suggestion applied",
      description: "AI suggestion has been added to your message."
    });
  };

  return (
    <MainLayout>
      <div className="flex h-screen">
        <div className="w-[400px]">
          <ThreadedConversationList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={setSelectedThreadId}
            onBulkAction={handleBulkAction}
          />
        </div>
        
        {selectedThread ? (
          <div className="flex-1 flex">
            <div className="flex-1">
              <ConversationView
                conversation={{
                  id: selectedThread.id,
                  contact: {
                    name: selectedThread.guest.name,
                    avatarUrl: selectedThread.guest.avatarUrl
                  },
                  lastMessage: {
                    text: selectedThread.messages[selectedThread.messages.length - 1]?.text || "",
                    time: "now",
                    timestamp: selectedThread.lastActivity,
                    isUnread: selectedThread.messages.some(m => !m.isRead),
                    sender: selectedThread.messages[selectedThread.messages.length - 1]?.sender || "contact"
                  },
                  source: selectedThread.messages[0]?.platform || "email",
                  status: selectedThread.messages.some(m => !m.isRead) ? "todo" : "done"
                }}
                onStatusChange={handleStatusChange}
              />
            </div>
            
            {showAIInsights && (
              <AIInsightsPanel
                thread={selectedThread}
                onApplySuggestion={handleApplySuggestion}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
