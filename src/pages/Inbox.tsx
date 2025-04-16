import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ConversationList, Conversation } from "@/components/inbox/ConversationList";
import { ConversationView } from "@/components/inbox/ConversationView";
import { ContactList, Contact } from "@/components/inbox/ContactList";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ChevronLeft, ChevronRight, PlusCircle, Send, Users, Mail, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subHours, subDays, formatISO, subMinutes, subMonths, format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
const toISOString = (date: Date): string => formatISO(date);
const sampleConversations: Conversation[] = [{
  id: "1",
  contact: {
    name: "Sarah Miller"
  },
  lastMessage: {
    text: "Hello! I noticed in your listing that breakfast is included. Could you please let me know what time breakfast is served?",
    time: "2h ago",
    timestamp: toISOString(subHours(new Date(), 2)),
    isUnread: true,
    sender: "contact"
  },
  source: "booking",
  status: "todo"
}, {
  id: "2",
  contact: {
    name: "John Davis"
  },
  lastMessage: {
    text: "Thank you for the information about the pool hours. We're looking forward to our stay!",
    time: "3h ago",
    timestamp: toISOString(subHours(new Date(), 3)),
    isUnread: false,
    sender: "contact"
  },
  source: "airbnb",
  status: "done"
}, {
  id: "3",
  contact: {
    name: "Maria Rodriguez"
  },
  lastMessage: {
    text: "Our flight has been delayed. We'll arrive around midnight. Is that okay?",
    time: "5h ago",
    timestamp: toISOString(subHours(new Date(), 5)),
    isUnread: true,
    sender: "contact"
  },
  source: "whatsapp",
  status: "todo"
}, {
  id: "4",
  contact: {
    name: "Thomas Brown"
  },
  lastMessage: {
    text: "We'll need to arrange a late checkout on Sunday, if possible. Our flight leaves at 8 PM.",
    time: "Yesterday",
    timestamp: toISOString(subDays(new Date(), 1)),
    isUnread: false,
    sender: "contact"
  },
  source: "email",
  status: "followup"
}, {
  id: "5",
  contact: {
    name: "Emma Wilson"
  },
  lastMessage: {
    text: "I understand completely. Thank you for being so accommodating with our special requests.",
    time: "2 days ago",
    timestamp: toISOString(subDays(new Date(), 2)),
    isUnread: false,
    sender: "contact"
  },
  source: "booking",
  status: "done"
}, {
  id: "6",
  contact: {
    name: "Michael Chang"
  },
  lastMessage: {
    text: "Is it possible to arrange an airport pickup? Our flight arrives at 3:30 PM on Friday.",
    time: "30m ago",
    timestamp: toISOString(subMinutes(new Date(), 30)),
    isUnread: true,
    sender: "contact"
  },
  source: "vrbo",
  status: "todo"
}, {
  id: "7",
  contact: {
    name: "Lisa Montgomery"
  },
  lastMessage: {
    text: "We noticed the hot tub instructions aren't working as described. Can you help?",
    time: "1h ago",
    timestamp: toISOString(subHours(new Date(), 1)),
    isUnread: true,
    sender: "contact"
  },
  source: "email",
  status: "todo"
}, {
  id: "8",
  contact: {
    name: "Robert Foster"
  },
  lastMessage: {
    text: "We've just arrived and everything looks wonderful! Thank you for the welcome basket.",
    time: "4h ago",
    timestamp: toISOString(subHours(new Date(), 4)),
    isUnread: false,
    sender: "contact"
  },
  source: "whatsapp",
  status: "done"
}, {
  id: "9",
  contact: {
    name: "Jessica Tan"
  },
  lastMessage: {
    text: "We're planning to bring our small dog. Is that allowed according to your pet policy?",
    time: "3 days ago",
    timestamp: toISOString(subDays(new Date(), 3)),
    isUnread: false,
    sender: "contact"
  },
  source: "airbnb",
  status: "followup"
}, {
  id: "10",
  contact: {
    name: "David Kim"
  },
  lastMessage: {
    text: "The WiFi seems to be down. Is there an alternative network we can use?",
    time: "45m ago",
    timestamp: toISOString(subMinutes(new Date(), 45)),
    isUnread: true,
    sender: "contact"
  },
  source: "whatsapp",
  status: "todo"
}];
const sampleContacts: Contact[] = [{
  id: "1",
  name: "Sarah Miller",
  email: "sarah.miller@example.com",
  previousStays: [{
    propertyName: "Beachfront Villa",
    date: toISOString(subMonths(new Date(), 3))
  }, {
    propertyName: "Mountain Cabin",
    date: toISOString(subMonths(new Date(), 8))
  }],
  notes: "Prefers quiet rooms away from elevators. Allergic to feather pillows. Always books for anniversary in September."
}, {
  id: "2",
  name: "John Davis",
  email: "john.davis@example.com",
  previousStays: [{
    propertyName: "Lakeside Cottage",
    date: toISOString(subMonths(new Date(), 2))
  }],
  notes: "Travels for business frequently. Prefers early check-in when available. Member of loyalty program."
}, {
  id: "3",
  name: "Maria Rodriguez",
  email: "maria.r@example.com",
  previousStays: [{
    propertyName: "Beachfront Villa",
    date: toISOString(subMonths(new Date(), 1))
  }, {
    propertyName: "City Apartment",
    date: toISOString(subMonths(new Date(), 5))
  }, {
    propertyName: "Mountain Cabin",
    date: toISOString(subMonths(new Date(), 10))
  }],
  notes: "Travels with small dog. Needs pet-friendly accommodations. Always requests extra towels."
}, {
  id: "4",
  name: "Thomas Brown",
  email: "t.brown@example.com",
  previousStays: [],
  notes: "First-time guest. Mentioned celebrating birthday during stay."
}, {
  id: "5",
  name: "Emma Wilson",
  email: "emma.wilson@example.com",
  previousStays: [{
    propertyName: "Lakeside Cottage",
    date: toISOString(subMonths(new Date(), 4))
  }],
  notes: "Gluten-free diet. Requested restaurant recommendations. Interested in local hiking trails."
}];
const InboxPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(conversations[0]?.id);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>();
  const isMobile = useIsMobile();
  const [showList, setShowList] = useState(!isMobile);
  const [composeOpen, setComposeOpen] = useState(false);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"conversations" | "contacts">("conversations");
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    cc: "",
    bcc: "",
    message: ""
  });
  const {
    toast
  } = useToast();
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    if (isMobile) {
      setShowList(false);
    }
    setConversations(conversations.map(c => c.id === id && c.lastMessage.isUnread ? {
      ...c,
      lastMessage: {
        ...c.lastMessage,
        isUnread: false
      }
    } : c));
  };
  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    if (isMobile) {
      setShowList(false);
    }
  };
  const handleStatusChange = (id: string, status: Conversation["status"]) => {
    setConversations(conversations.map(c => c.id === id ? {
      ...c,
      status
    } : c));
  };
  const handleComposeNew = () => {
    setComposeOpen(true);
  };
  const toggleListCollapse = () => {
    setIsListCollapsed(!isListCollapsed);
  };
  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject) {
      toast({
        title: "Missing information",
        description: "Please fill in the recipient and subject fields.",
        variant: "destructive"
      });
      return;
    }
    const newConversation: Conversation = {
      id: `new-${Date.now()}`,
      contact: {
        name: newEmail.to.split('@')[0] || "New Contact"
      },
      lastMessage: {
        text: newEmail.message,
        time: "Just now",
        timestamp: toISOString(new Date()),
        isUnread: false,
        sender: "user"
      },
      source: "email",
      status: "todo"
    };
    setConversations([newConversation, ...conversations]);
    setSelectedConversationId(newConversation.id);
    setNewEmail({
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      message: ""
    });
    setComposeOpen(false);
    toast({
      title: "Email sent",
      description: "Your message has been sent successfully."
    });
  };
  if (isMobile) {
    return <MainLayout>
        <div className="h-full bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
          <div className="flex h-full">
            {showList && <div className="w-full">
                <div className="p-4 border-b border-border">
                  <Button onClick={handleComposeNew} className="w-full flex items-center justify-center gap-2 mb-4">
                    <PlusCircle className="h-4 w-4" />
                    Compose New
                  </Button>
                  
                  <Tabs value={activeTab} onValueChange={v => setActiveTab(v as "conversations" | "contacts")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="conversations" className="flex-1">Inbox</TabsTrigger>
                      <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversations" className="m-0 h-[calc(100%-76px)]">
                      <ConversationList conversations={conversations} selectedConversationId={selectedConversationId} onSelectConversation={handleSelectConversation} />
                    </TabsContent>
                    
                    <TabsContent value="contacts" className="m-0 h-[calc(100%-76px)]">
                      <ContactList contacts={contacts} selectedContactId={selectedContactId} onSelectContact={handleSelectContact} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>}
            
            {!showList && selectedConversation && <div className="w-full relative">
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10" onClick={() => setShowList(true)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <ConversationView conversation={selectedConversation} onStatusChange={handleStatusChange} />
              </div>}
            
            {!showList && selectedContact && !selectedConversation && <div className="w-full relative p-6">
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10" onClick={() => setShowList(true)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-2xl font-medium">
                        {selectedContact.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold">{selectedContact.name}</h1>
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{selectedContact.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Previous Stays
                      </h2>
                      {selectedContact.previousStays.length > 0 ? <div className="border rounded-md divide-y">
                          {selectedContact.previousStays.map((stay, index) => <div key={index} className="p-3 flex justify-between">
                              <span className="font-medium">{stay.propertyName}</span>
                              <span className="text-muted-foreground">
                                {format(new Date(stay.date), "MMMM d, yyyy")}
                              </span>
                            </div>)}
                        </div> : <p className="text-muted-foreground">No previous stays recorded</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Notes
                      </h2>
                      <div className="border rounded-md p-3">
                        {selectedContact.notes || "No notes available"}
                      </div>
                    </div>
                    
                    <Button onClick={handleComposeNew} className="w-full mt-4">
                      Send Email to {selectedContact.name}
                    </Button>
                  </div>
                </div>
              </div>}
          </div>
        </div>

        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="bcc" className="text-right">
                  Bcc
                </Label>
                <Input id="bcc" value={newEmail.bcc} onChange={e => setNewEmail({
                ...newEmail,
                bcc: e.target.value
              })} className="col-span-3" placeholder="bcc@example.com" />
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
      </MainLayout>;
  }
  return <MainLayout>
      <div className="h-full bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
        <div className="flex h-full">
          <div className={`border-r border-border transition-all duration-300 ${isListCollapsed ? 'w-0' : 'w-1/3'} ${isListCollapsed ? 'overflow-hidden' : ''}`}>
            {!isListCollapsed && <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  
                  
                  <Tabs value={activeTab} onValueChange={v => setActiveTab(v as "conversations" | "contacts")}>
                    <TabsList className="w-full">
                      <TabsTrigger value="conversations" className="flex-1">Inbox</TabsTrigger>
                      <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversations" className="m-0 flex-1 overflow-hidden">
                      <ConversationList conversations={conversations} selectedConversationId={selectedConversationId} onSelectConversation={handleSelectConversation} />
                    </TabsContent>
                    
                    <TabsContent value="contacts" className="m-0 flex-1 overflow-hidden">
                      <ContactList contacts={contacts} selectedContactId={selectedContactId} onSelectContact={handleSelectContact} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>}
          </div>
          <div className={`relative transition-all duration-300 ${isListCollapsed ? 'w-full' : 'w-2/3'}`}>
            <div className="absolute top-0 left-0 h-10 w-10 flex items-center justify-center z-10">
              <Button variant="ghost" size="icon" onClick={toggleListCollapse} className="h-8 w-8">
                {isListCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            
            {selectedConversation ? <ConversationView conversation={selectedConversation} onStatusChange={handleStatusChange} /> : selectedContact ? <div className="p-6 h-full overflow-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-2xl font-medium">
                        {selectedContact.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold">{selectedContact.name}</h1>
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{selectedContact.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Previous Stays
                      </h2>
                      {selectedContact.previousStays.length > 0 ? <div className="border rounded-md divide-y">
                          {selectedContact.previousStays.map((stay, index) => <div key={index} className="p-3 flex justify-between">
                              <span className="font-medium">{stay.propertyName}</span>
                              <span className="text-muted-foreground">
                                {format(new Date(stay.date), "MMMM d, yyyy")}
                              </span>
                            </div>)}
                        </div> : <p className="text-muted-foreground">No previous stays recorded</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Notes
                      </h2>
                      <div className="border rounded-md p-3">
                        {selectedContact.notes || "No notes available"}
                      </div>
                    </div>
                    
                    <Button onClick={() => {
                  setNewEmail(prev => ({
                    ...prev,
                    to: selectedContact.email
                  }));
                  setComposeOpen(true);
                }} className="w-full mt-4">
                      Send Email to {selectedContact.name}
                    </Button>
                  </div>
                </div>
              </div> : <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>Select a conversation or contact to view</p>
              </div>}
          </div>
        </div>
      </div>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="bcc" className="text-right">
                Bcc
              </Label>
              <Input id="bcc" value={newEmail.bcc} onChange={e => setNewEmail({
              ...newEmail,
              bcc: e.target.value
            })} className="col-span-3" placeholder="bcc@example.com" />
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
    </MainLayout>;
};
export default InboxPage;