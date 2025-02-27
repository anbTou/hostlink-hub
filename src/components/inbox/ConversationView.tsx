
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Conversation } from "./ConversationList";
import { format, formatDistanceToNow, parseISO } from "date-fns";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact" | "ai";
  timestamp: string; // ISO string
}

interface ConversationViewProps {
  conversation: Conversation;
  onStatusChange: (id: string, status: Conversation["status"]) => void;
}

export function ConversationView({ conversation, onStatusChange }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: conversation.lastMessage.text,
      sender: "contact",
      timestamp: conversation.lastMessage.timestamp
    },
    {
      id: "2",
      text: "Also, we'll be arriving around 9 PM. Is that too late for check-in?",
      sender: "contact",
      timestamp: parseISO(conversation.lastMessage.timestamp).getTime() - 120000 + "" // 2 minutes before
    },
    {
      id: "3",
      text: "Our AI has suggested a response for you",
      sender: "ai",
      timestamp: parseISO(conversation.lastMessage.timestamp).getTime() - 60000 + "" // 1 minute before
    },
    {
      id: "4",
      text: "Hello! Breakfast is served from 7:30 AM to 10:00 AM in our dining area. As for your arrival time, 9 PM is perfectly fine for check-in. We have a 24-hour reception desk. Is there anything else you'd like to know?",
      sender: "user",
      timestamp: parseISO(conversation.lastMessage.timestamp).getTime() - 30000 + "" // 30 seconds before
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = typeof timestamp === 'string' && timestamp.length > 10 
        ? parseISO(timestamp) 
        : new Date(parseInt(timestamp));
      
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, "MMM d, h:mm a");
      }
    } catch (e) {
      console.error("Error parsing date:", e);
      return "Unknown time";
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate contact response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've noted your message. Is there anything else you'd like to ask about?",
        sender: "contact",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex justify-between">
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
            <h2 className="font-medium">{conversation.contact.name}</h2>
            <div className="flex gap-2">
              <Button 
                variant={conversation.status === "todo" ? "default" : "outline"} 
                size="sm"
                onClick={() => onStatusChange(conversation.id, "todo")}
              >
                Todo
              </Button>
              <Button 
                variant={conversation.status === "followup" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(conversation.id, "followup")}
              >
                Follow-up
              </Button>
              <Button 
                variant={conversation.status === "done" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange(conversation.id, "done")}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : message.sender === "ai"
                  ? "bg-secondary text-secondary-foreground border border-primary/20"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {message.sender === "ai" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">AI Assistant</span>
                </div>
              )}
              <p>{message.text}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {formatMessageTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="relative">
          <Textarea 
            placeholder="Type your message..." 
            className="min-h-[80px] pr-20"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" type="button">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
              type="button"
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
