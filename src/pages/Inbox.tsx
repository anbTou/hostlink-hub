
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList, Conversation } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      isUnread: false,
      sender: "contact",
    },
    source: "booking",
    status: "done",
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
  };
  
  const handleStatusChange = (id: string, status: Conversation["status"]) => {
    setConversations(conversations.map(c => 
      c.id === id ? { ...c, status } : c
    ));
  };
  
  return (
    <MainLayout>
      <div className="h-[calc(100vh-2rem)] bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
        <div className="flex h-full">
          {(showList || !isMobile) && (
            <div className={`${isMobile ? 'w-full' : 'w-1/3'}`}>
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
