
import { useState } from "react";
import { Search, Filter, User, Calendar, Edit, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Types
export type ConversationStatus = "todo" | "followup" | "done";

export interface Conversation {
  id: string;
  contact: {
    name: string;
    avatarUrl?: string;
  };
  lastMessage: {
    text: string;
    time: string;
    isUnread: boolean;
    sender: "user" | "contact" | "ai";
  };
  source: "email" | "booking" | "airbnb" | "whatsapp";
  status: ConversationStatus;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}: ConversationListProps) {
  const [filter, setFilter] = useState<ConversationStatus | "all">("todo");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = conversations.filter(conversation => {
    const matchesFilter = filter === "all" || conversation.status === filter;
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const todoCount = conversations.filter(c => c.status === "todo").length;
  
  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Inbox</h2>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-hide">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "todo" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("todo")}
            className="flex gap-2 items-center"
          >
            Todo
            {todoCount > 0 && (
              <Badge variant="secondary" className="ml-1">{todoCount}</Badge>
            )}
          </Button>
          <Button 
            variant={filter === "followup" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("followup")}
          >
            Follow-up
          </Button>
          <Button 
            variant={filter === "done" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("done")}
          >
            Done
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>No conversations found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <ul>
            {filteredConversations.map((conversation) => (
              <li 
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "p-4 border-b border-border cursor-pointer transition-colors",
                  selectedConversationId === conversation.id ? "bg-accent" : "hover:bg-muted/50",
                  conversation.lastMessage.isUnread && "bg-primary/5"
                )}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {conversation.contact.avatarUrl ? (
                        <img src={conversation.contact.avatarUrl} alt={conversation.contact.name} />
                      ) : (
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                          {conversation.contact.name.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {conversation.contact.name}
                        </h3>
                        <SourceBadge source={conversation.source} />
                      </div>
                      <p className={cn(
                        "text-sm line-clamp-1",
                        conversation.lastMessage.isUnread ? "font-medium text-foreground" : "text-muted-foreground"
                      )}>
                        {conversation.lastMessage.sender === "user" && "You: "}
                        {conversation.lastMessage.sender === "ai" && "AI: "}
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage.time}
                    </span>
                    <div className="mt-1">
                      <StatusBadge status={conversation.status} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SourceBadge({ source }: { source: Conversation["source"] }) {
  const sourceConfig = {
    email: { label: "Email", color: "bg-blue-100 text-blue-800" },
    booking: { label: "Booking", color: "bg-blue-100 text-blue-800" },
    airbnb: { label: "Airbnb", color: "bg-red-100 text-red-800" },
    whatsapp: { label: "WhatsApp", color: "bg-green-100 text-green-800" },
  };

  const config = sourceConfig[source];

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded-sm ${config.color} dark:bg-opacity-20`}>
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ConversationStatus }) {
  if (status === "todo") {
    return <span className="status-badge-todo">Todo</span>;
  }
  if (status === "followup") {
    return <span className="status-badge-followup">Follow-up</span>;
  }
  return <span className="status-badge-done">Done</span>;
}
