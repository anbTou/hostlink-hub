
import { useState } from "react";
import { Search, User, Mail, Calendar, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Types
export type ConversationStatus = "todo" | "followup" | "done";
export type ConversationSource = "email" | "booking" | "airbnb" | "whatsapp" | "vrbo";
export interface Conversation {
  id: string;
  contact: {
    name: string;
    avatarUrl?: string;
  };
  lastMessage: {
    text: string;
    time: string;
    timestamp: string; // ISO string for consistent sorting
    isUnread: boolean;
    sender: "user" | "contact" | "ai";
  };
  source: ConversationSource;
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
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("todo");
  const [sourceFilters, setSourceFilters] = useState<ConversationSource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState({
    from: "me@example.com",
    to: "",
    cc: "",
    subject: "",
    message: ""
  });
  const {
    toast
  } = useToast();

  // Toggle a source filter on/off
  const toggleSourceFilter = (source: ConversationSource) => {
    if (sourceFilters.includes(source)) {
      setSourceFilters(sourceFilters.filter(s => s !== source));
    } else {
      setSourceFilters([...sourceFilters, source]);
    }
  };

  // Sort conversations by timestamp (most recent first)
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  // Apply all filters
  const filteredConversations = sortedConversations.filter(conversation => {
    // Status filter
    const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;

    // Source filter (if any are selected)
    const matchesSource = sourceFilters.length === 0 || sourceFilters.includes(conversation.source);

    // Search query
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || conversation.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSource && matchesSearch;
  });
  const handleComposeNew = () => {
    setComposeOpen(true);
  };
  const handleSendEmail = () => {
    // Validate required fields
    if (!newEmail.to || !newEmail.subject) {
      toast({
        title: "Missing information",
        description: "Please fill in the recipient and subject fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the email through an API
    // For our demo, we'll notify the user
    toast({
      title: "Email sent",
      description: `Your message to ${newEmail.to} has been sent successfully.`
    });

    // Reset form and close dialog
    setNewEmail({
      from: "me@example.com",
      to: "",
      cc: "",
      subject: "",
      message: ""
    });
    setComposeOpen(false);
  };

  // Count totals for badges
  const todoCount = conversations.filter(c => c.status === "todo").length;
  const followupCount = conversations.filter(c => c.status === "followup").length;
  const doneCount = conversations.filter(c => c.status === "done").length;

  // Count by source
  const sourceCounts = {
    email: conversations.filter(c => c.source === "email").length,
    booking: conversations.filter(c => c.source === "booking").length,
    airbnb: conversations.filter(c => c.source === "airbnb").length,
    whatsapp: conversations.filter(c => c.source === "whatsapp").length,
    vrbo: conversations.filter(c => c.source === "vrbo").length
  };

  // Group conversations by day
  const groupedConversations: {
    [key: string]: Conversation[];
  } = {};
  filteredConversations.forEach(conv => {
    const date = parseISO(conv.lastMessage.timestamp);
    let groupKey = '';
    if (isToday(date)) {
      groupKey = 'Today';
    } else if (isYesterday(date)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(date)) {
      groupKey = format(date, 'EEEE'); // Day name
    } else {
      groupKey = format(date, 'MMM d, yyyy');
    }
    if (!groupedConversations[groupKey]) {
      groupedConversations[groupKey] = [];
    }
    groupedConversations[groupKey].push(conv);
  });
  return <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Inbox</h2>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        
        {/* Compose Button - THIS IS THE SELECTED BUTTON */}
        <Button onClick={handleComposeNew} className="w-full flex items-center justify-center gap-2 mb-4">
          <Send className="h-4 w-4" />
          Compose New
        </Button>
        
        {/* Status Filters */}
        <div className="flex space-x-2 overflow-x-auto py-1 mb-3 scrollbar-hide">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>
            All
          </Button>
          <Button variant={statusFilter === "todo" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("todo")} className="flex gap-2 items-center">
            Todo
            {todoCount > 0 && <Badge variant="secondary" className="ml-1">{todoCount}</Badge>}
          </Button>
          <Button variant={statusFilter === "followup" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("followup")} className="flex gap-2 items-center">
            Follow-up
            {followupCount > 0 && <Badge variant="secondary" className="ml-1">{followupCount}</Badge>}
          </Button>
          <Button variant={statusFilter === "done" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("done")} className="flex gap-2 items-center">
            Done
            {doneCount > 0 && <Badge variant="secondary" className="ml-1">{doneCount}</Badge>}
          </Button>
        </div>
        
        {/* Source Filters */}
        <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-hide">
          <Button variant={sourceFilters.includes("email") ? "default" : "outline"} size="sm" onClick={() => toggleSourceFilter("email")} className="flex gap-2 items-center">
            <Mail className="h-3.5 w-3.5" />
            <span>Email</span>
            {sourceCounts.email > 0 && <Badge variant="secondary" className="ml-1">{sourceCounts.email}</Badge>}
          </Button>
          <Button variant={sourceFilters.includes("airbnb") ? "default" : "outline"} size="sm" onClick={() => toggleSourceFilter("airbnb")} className="flex gap-2 items-center">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5v9h2v-9h-2z" />
            </svg>
            <span>Airbnb</span>
            {sourceCounts.airbnb > 0 && <Badge variant="secondary" className="ml-1">{sourceCounts.airbnb}</Badge>}
          </Button>
          <Button variant={sourceFilters.includes("booking") ? "default" : "outline"} size="sm" onClick={() => toggleSourceFilter("booking")} className="flex gap-2 items-center">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7h-8V9h6c1.1 0 2 .9 2 2v3z" />
            </svg>
            <span>Booking</span>
            {sourceCounts.booking > 0 && <Badge variant="secondary" className="ml-1">{sourceCounts.booking}</Badge>}
          </Button>
          <Button variant={sourceFilters.includes("vrbo") ? "default" : "outline"} size="sm" onClick={() => toggleSourceFilter("vrbo")} className="flex gap-2 items-center">
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L1 12h3v9h7v-6h2v6h7v-9h3L12 2z" />
            </svg>
            <span>VRBO</span>
            {sourceCounts.vrbo > 0 && <Badge variant="secondary" className="ml-1">{sourceCounts.vrbo}</Badge>}
          </Button>
          <Button variant={sourceFilters.includes("whatsapp") ? "default" : "outline"} size="sm" onClick={() => toggleSourceFilter("whatsapp")} className="flex gap-2 items-center">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
            {sourceCounts.whatsapp > 0 && <Badge variant="secondary" className="ml-1">{sourceCounts.whatsapp}</Badge>}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedConversations).length === 0 ? <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <User className="h-12 w-12 mb-4 opacity-20" />
            <p>No conversations found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div> : <div>
            {Object.entries(groupedConversations).map(([dayLabel, dayConversations]) => <div key={dayLabel}>
                <div className="sticky top-0 bg-background/90 backdrop-blur-sm px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  {dayLabel}
                </div>
                <ul>
                  {dayConversations.map(conversation => <li key={conversation.id} onClick={() => onSelectConversation(conversation.id)} className={cn("p-4 border-b border-border cursor-pointer transition-colors", selectedConversationId === conversation.id ? "bg-accent" : "hover:bg-muted/50", conversation.lastMessage.isUnread && "bg-primary/5")}>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {conversation.contact.avatarUrl ? <img src={conversation.contact.avatarUrl} alt={conversation.contact.name} /> : <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                                {conversation.contact.name.charAt(0)}
                              </div>}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {conversation.contact.name}
                              </h3>
                              <SourceBadge source={conversation.source} />
                            </div>
                            <p className={cn("text-sm line-clamp-1", conversation.lastMessage.isUnread ? "font-medium text-foreground" : "text-muted-foreground")}>
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
                    </li>)}
                </ul>
              </div>)}
          </div>}
      </div>

      {/* Compose Email Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from" className="text-right">
                From
              </Label>
              <Input id="from" value={newEmail.from} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to" className="text-right">
                To
              </Label>
              <Input id="to" value={newEmail.to} onChange={e => setNewEmail({
              ...newEmail,
              to: e.target.value
            })} className="col-span-3" placeholder="recipient@example.com" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cc" className="text-right">
                Cc
              </Label>
              <Input id="cc" value={newEmail.cc} onChange={e => setNewEmail({
              ...newEmail,
              cc: e.target.value
            })} className="col-span-3" placeholder="cc@example.com" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input id="subject" value={newEmail.subject} onChange={e => setNewEmail({
              ...newEmail,
              subject: e.target.value
            })} className="col-span-3" placeholder="Email subject" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="message" className="text-right self-start mt-2">
                Message
              </Label>
              <Textarea id="message" value={newEmail.message} onChange={e => setNewEmail({
              ...newEmail,
              message: e.target.value
            })} className="col-span-3" rows={8} placeholder="Type your message here" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSendEmail} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
function SourceBadge({
  source
}: {
  source: ConversationSource;
}) {
  const sourceConfig = {
    email: {
      label: "Email",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: <Mail className="h-3 w-3 mr-1" />
    },
    booking: {
      label: "Booking",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: <svg className="h-3 w-3 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 7h-8v7H3V5H1v15h2v-3h18v3h2V11c0-2.21-1.79-4-4-4zm2 7h-8V9h6c1.1 0 2 .9 2 2v3z" />
      </svg>
    },
    airbnb: {
      label: "Airbnb",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <svg className="h-3 w-3 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13.5v9h2v-9h-2z" />
      </svg>
    },
    whatsapp: {
      label: "WhatsApp",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <MessageSquare className="h-3 w-3 mr-1" />
    },
    vrbo: {
      label: "VRBO",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: <svg className="h-3 w-3 mr-1 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L1 12h3v9h7v-6h2v6h7v-9h3L12 2z" />
      </svg>
    }
  };
  const config = sourceConfig[source];
  return <span className={`text-xs px-1.5 py-0.5 rounded-sm flex items-center ${config.color}`}>
      {config.icon}
      {config.label}
    </span>;
}
function StatusBadge({
  status
}: {
  status: ConversationStatus;
}) {
  if (status === "todo") {
    return <span className="status-badge-todo">Todo</span>;
  }
  if (status === "followup") {
    return <span className="status-badge-followup">Follow-up</span>;
  }
  return <span className="status-badge-done">Done</span>;
}
