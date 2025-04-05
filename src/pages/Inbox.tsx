
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList, Conversation } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subHours, subDays, formatISO, subMinutes } from "date-fns";

// Format a date into an ISO string for consistent sorting
const toISOString = (date: Date): string => formatISO(date);

// Sample data for conversations
const sampleConversations: Conversation[] = [
  {
    id: "1",
    contact: {
      name: "Sarah Miller",
    },
    lastMessage: {
      text: "Hello! I noticed in your listing that breakfast is included. Could you please let me know what time breakfast is served?",
      time: "2h ago",
      timestamp: toISOString(subHours(new Date(), 2)), // 2 hours ago
      isUnread: true,
      sender: "contact",
    },
    source: "booking",
    status: "todo",
  },
  {
    id: "2",
    contact: {
      name: "John Davis",
    },
    lastMessage: {
      text: "Thank you for the information about the pool hours. We're looking forward to our stay!",
      time: "3h ago",
      timestamp: toISOString(subHours(new Date(), 3)), // 3 hours ago
      isUnread: false,
      sender: "contact",
    },
    source: "airbnb",
    status: "done",
  },
  {
    id: "3",
    contact: {
      name: "Maria Rodriguez",
    },
    lastMessage: {
      text: "Our flight has been delayed. We'll arrive around midnight. Is that okay?",
      time: "5h ago",
      timestamp: toISOString(subHours(new Date(), 5)), // 5 hours ago
      isUnread: true,
      sender: "contact",
    },
    source: "whatsapp",
    status: "todo",
  },
  {
    id: "4",
    contact: {
      name: "Thomas Brown",
    },
    lastMessage: {
      text: "We'll need to arrange a late checkout on Sunday, if possible. Our flight leaves at 8 PM.",
      time: "Yesterday",
      timestamp: toISOString(subDays(new Date(), 1)), // Yesterday
      isUnread: false,
      sender: "contact",
    },
    source: "email",
    status: "followup",
  },
  {
    id: "5",
    contact: {
      name: "Emma Wilson",
    },
    lastMessage: {
      text: "I understand completely. Thank you for being so accommodating with our special requests.",
      time: "2 days ago",
      timestamp: toISOString(subDays(new Date(), 2)), // 2 days ago
      isUnread: false,
      sender: "contact",
    },
    source: "booking",
    status: "done",
  },
  {
    id: "6",
    contact: {
      name: "Michael Chang",
    },
    lastMessage: {
      text: "Is it possible to arrange an airport pickup? Our flight arrives at 3:30 PM on Friday.",
      time: "30m ago",
      timestamp: toISOString(subMinutes(new Date(), 30)), // 30 minutes ago
      isUnread: true,
      sender: "contact",
    },
    source: "vrbo",
    status: "todo",
  },
  {
    id: "7",
    contact: {
      name: "Lisa Montgomery",
    },
    lastMessage: {
      text: "We noticed the hot tub instructions aren't working as described. Can you help?",
      time: "1h ago",
      timestamp: toISOString(subHours(new Date(), 1)), // 1 hour ago
      isUnread: true,
      sender: "contact",
    },
    source: "email",
    status: "todo",
  },
  {
    id: "8",
    contact: {
      name: "Robert Foster",
    },
    lastMessage: {
      text: "We've just arrived and everything looks wonderful! Thank you for the welcome basket.",
      time: "4h ago",
      timestamp: toISOString(subHours(new Date(), 4)), // 4 hours ago
      isUnread: false,
      sender: "contact",
    },
    source: "whatsapp",
    status: "done",
  },
  {
    id: "9",
    contact: {
      name: "Jessica Tan",
    },
    lastMessage: {
      text: "We're planning to bring our small dog. Is that allowed according to your pet policy?",
      time: "3 days ago",
      timestamp: toISOString(subDays(new Date(), 3)), // 3 days ago
      isUnread: false,
      sender: "contact",
    },
    source: "airbnb",
    status: "followup",
  },
  {
    id: "10",
    contact: {
      name: "David Kim",
    },
    lastMessage: {
      text: "The WiFi seems to be down. Is there an alternative network we can use?",
      time: "45m ago",
      timestamp: toISOString(subMinutes(new Date(), 45)), // 45 minutes ago
      isUnread: true,
      sender: "contact",
    },
    source: "whatsapp",
    status: "todo",
  },
];

const InboxPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(conversations[0]?.id);
  const isMobile = useIsMobile();
  const [showList, setShowList] = useState(!isMobile);
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setShowList(false);
    }
    
    // Mark conversation as read when selected
    setConversations(conversations.map(c => 
      c.id === id && c.lastMessage.isUnread 
        ? { ...c, lastMessage: { ...c.lastMessage, isUnread: false } } 
        : c
    ));
  };
  
  const handleStatusChange = (id: string, status: Conversation["status"]) => {
    setConversations(conversations.map(c => 
      c.id === id ? { ...c, status } : c
    ));
  };
  
  const handleComposeNew = () => {
    // In a real application, this would open a new email composition form
    alert("Compose new email feature would open here");
  };
  
  return (
    <MainLayout>
      <div className="h-[calc(100vh-2rem)] bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
        <div className="flex h-full">
          {(showList || !isMobile) && (
            <div className={`${isMobile ? 'w-full' : 'w-1/3'}`}>
              <div className="p-4 border-b border-border">
                <Button 
                  onClick={handleComposeNew}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Compose New
                </Button>
              </div>
              <ConversationList 
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          )}
          
          {(!showList || !isMobile) && selectedConversation && (
            <div className={`${isMobile ? 'w-full' : 'w-2/3'} relative`}>
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="absolute top-4 left-4 z-10"
                  onClick={() => setShowList(true)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <ConversationView 
                conversation={selectedConversation} 
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InboxPage;
