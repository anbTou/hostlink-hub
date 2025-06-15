import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, MoreHorizontal, ChevronDown, ChevronUp, UserCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Conversation } from "./ConversationList";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ThreadedView } from "./ThreadedView";
import { PlainTextToggle } from "./PlainTextToggle";
import { CollisionBanner } from "./CollisionBanner";
import { useCollisionPrevention } from "@/hooks/useCollisionPrevention";
import { useToast } from "@/hooks/use-toast";

interface EmailDetails {
  to: string[];
  from: string;
  subject: string;
  cc?: string[];
  bcc?: string[];
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact" | "ai";
  timestamp: string; // ISO string
  emailDetails?: EmailDetails;
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
      timestamp: conversation.lastMessage.timestamp,
      emailDetails: {
        from: conversation.contact.name,
        to: ["you@example.com"],
        subject: "Question about breakfast service",
        cc: ["reservations@example.com"]
      }
    },
    {
      id: "2",
      text: "Also, we'll be arriving around 9 PM. Is that too late for check-in?",
      sender: "contact",
      timestamp: parseISO(conversation.lastMessage.timestamp).getTime() - 120000 + "", // 2 minutes before
      emailDetails: {
        from: conversation.contact.name,
        to: ["you@example.com"],
        subject: "Question about breakfast service",
        cc: ["reservations@example.com"]
      }
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
      timestamp: parseISO(conversation.lastMessage.timestamp).getTime() - 30000 + "", // 30 seconds before
      emailDetails: {
        from: "you@example.com",
        to: [conversation.contact.name],
        subject: "Re: Question about breakfast service",
        cc: ["reservations@example.com"]
      }
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isPlainText, setIsPlainText] = useState(false);
  const [useThreadedView, setUseThreadedView] = useState(true);
  const [replyDetails, setReplyDetails] = useState<EmailDetails>({
    from: "you@example.com",
    to: [conversation.contact.name],
    subject: `Re: ${messages[0]?.emailDetails?.subject || "Your inquiry"}`,
    cc: messages[0]?.emailDetails?.cc || [],
    bcc: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    getAssignmentStatus,
    autoAssignOnReply,
    assignMessage,
    releaseMessage,
    currentUser
  } = useCollisionPrevention();

  const assignmentStatus = getAssignmentStatus(conversation.id);
  const isAssignedToCurrentUser = assignmentStatus.isAssigned && assignmentStatus.assignedTo === currentUser;
  const canInteract = !assignmentStatus.isAssigned || isAssignedToCurrentUser;
  
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
    
    // Auto-assign message to current user when they start replying
    const assigned = autoAssignOnReply(conversation.id, Date.now().toString());
    if (!assigned) {
      return; // Assignment failed, don't send message
    }
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
      emailDetails: replyDetails
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    setShowReplyForm(false);
    
    // Simulate contact response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've noted your message. Is there anything else you'd like to ask about?",
        sender: "contact",
        timestamp: new Date().toISOString(),
        emailDetails: {
          from: conversation.contact.name,
          to: ["you@example.com"],
          subject: `Re: ${replyDetails.subject}`,
          cc: replyDetails.cc
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleTakeOver = () => {
    const success = assignMessage(conversation.id, Date.now().toString(), currentUser);
    if (success) {
      toast({
        title: "Conversation taken over",
        description: "You are now handling this conversation"
      });
    }
  };

  const handleAssignToMe = () => {
    const success = assignMessage(conversation.id, Date.now().toString(), currentUser);
    if (success) {
      toast({
        title: "Conversation assigned",
        description: "This conversation has been assigned to you"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };
  
  const updateCcField = (value: string) => {
    setReplyDetails({
      ...replyDetails,
      cc: value.split(',').map(email => email.trim()).filter(email => email !== "")
    });
  };
  
  const updateBccField = (value: string) => {
    setReplyDetails({
      ...replyDetails,
      bcc: value.split(',').map(email => email.trim()).filter(email => email !== "")
    });
  };
  
  const updateToField = (value: string) => {
    setReplyDetails({
      ...replyDetails,
      to: value.split(',').map(email => email.trim()).filter(email => email !== "")
    });
  };

  // Convert messages to threaded format for email view
  const threadedMessages = messages
    .filter(m => m.emailDetails)
    .map(m => ({
      id: m.id,
      subject: m.emailDetails!.subject,
      from: m.emailDetails!.from,
      to: m.emailDetails!.to,
      text: m.text,
      timestamp: m.timestamp,
      isRead: true // Assume read for now
    }));
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-start mb-4">
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
                  disabled={!canInteract}
                >
                  Todo
                </Button>
                <Button 
                  variant={conversation.status === "followup" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(conversation.id, "followup")}
                  disabled={!canInteract}
                >
                  Follow-up
                </Button>
                <Button 
                  variant={conversation.status === "done" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onStatusChange(conversation.id, "done")}
                  disabled={!canInteract}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!assignmentStatus.isAssigned && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAssignToMe}
                className="gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Assign to Me
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Collision Prevention Banner */}
        <CollisionBanner
          assignmentStatus={assignmentStatus}
          onTakeOver={handleTakeOver}
          canTakeOver={assignmentStatus.canTakeOver}
        />

        {/* View Controls */}
        <div className="flex gap-2 items-center">
          <PlainTextToggle 
            isPlainText={isPlainText} 
            onToggle={setIsPlainText} 
          />
          <Button
            variant={useThreadedView ? "default" : "outline"}
            size="sm"
            onClick={() => setUseThreadedView(!useThreadedView)}
          >
            {useThreadedView ? "Standard View" : "Threaded View"}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {useThreadedView && threadedMessages.length > 0 ? (
          <ThreadedView
            messages={threadedMessages}
            threadId={conversation.id}
            isPlainText={isPlainText}
          />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex flex-col",
                  message.sender === "user" ? "items-end" : "items-start"
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
                  {message.emailDetails && (
                    <div className="mb-2 text-xs border-b pb-2 border-primary/20">
                      {message.emailDetails.subject && (
                        <div className="font-bold mb-1">{message.emailDetails.subject}</div>
                      )}
                      <div>
                        <span className="font-semibold">From:</span> {message.emailDetails.from}
                      </div>
                      <div>
                        <span className="font-semibold">To:</span> {message.emailDetails.to.join(", ")}
                      </div>
                      {message.emailDetails.cc && message.emailDetails.cc.length > 0 && (
                        <div>
                          <span className="font-semibold">CC:</span> {message.emailDetails.cc.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {message.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary">AI Assistant</span>
                    </div>
                  )}
                  
                  {isPlainText ? (
                    <pre className="whitespace-pre-wrap font-inherit text-sm">
                      {message.text}
                    </pre>
                  ) : (
                    <p>{message.text}</p>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        {!canInteract && (
          <div className="mb-4 p-3 bg-muted rounded-lg text-center text-muted-foreground">
            This conversation is currently being handled by {assignmentStatus.assignedTo}
          </div>
        )}
        
        {canInteract && !showReplyForm ? (
          <Button 
            onClick={toggleReplyForm} 
            className="w-full mb-4 flex items-center justify-center"
            variant="outline"
          >
            <Send className="h-4 w-4 mr-2" /> Reply
          </Button>
        ) : canInteract && showReplyForm && (
          <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium">To:</span>
                <Input 
                  value={replyDetails.to.join(", ")} 
                  onChange={(e) => updateToField(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium">Subject:</span>
                <Input 
                  value={replyDetails.subject} 
                  onChange={(e) => setReplyDetails({...replyDetails, subject: e.target.value})}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium">CC:</span>
                <Input 
                  value={replyDetails.cc?.join(", ") || ""} 
                  onChange={(e) => updateCcField(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center">
                <span className="w-20 text-sm font-medium">BCC:</span>
                <Input 
                  value={replyDetails.bcc?.join(", ") || ""} 
                  onChange={(e) => updateBccField(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
        
        {canInteract && (
          <div className="relative">
            <Textarea 
              placeholder={showReplyForm ? "Type your reply..." : "Type your message..."} 
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
        )}
      </div>
    </div>
  );
}
