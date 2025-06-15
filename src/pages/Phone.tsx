
import { useState } from "react";
import { ContactList, Contact } from "@/components/inbox/ContactList";
import { ArrowLeft, Mail, Calendar, FileText, Phone as PhoneIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";
import { subMonths, formatISO } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Helper function to create ISO date strings
const toISOString = (date: Date): string => formatISO(date);

// Sample contact data
const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    previousStays: [
      { propertyName: "Beachfront Villa", date: toISOString(subMonths(new Date(), 3)) },
      { propertyName: "Mountain Cabin", date: toISOString(subMonths(new Date(), 8)) }
    ],
    notes: "Prefers quiet rooms away from elevators. Allergic to feather pillows. Always books for anniversary in September.",
    createdAt: toISOString(subMonths(new Date(), 12))
  },
  {
    id: "2",
    name: "John Davis",
    email: "john.davis@example.com",
    previousStays: [
      { propertyName: "Lakeside Cottage", date: toISOString(subMonths(new Date(), 2)) }
    ],
    notes: "Travels for business frequently. Prefers early check-in when available. Member of loyalty program.",
    createdAt: toISOString(subMonths(new Date(), 8))
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    email: "maria.r@example.com",
    previousStays: [
      { propertyName: "Beachfront Villa", date: toISOString(subMonths(new Date(), 1)) },
      { propertyName: "City Apartment", date: toISOString(subMonths(new Date(), 5)) },
      { propertyName: "Mountain Cabin", date: toISOString(subMonths(new Date(), 10)) }
    ],
    notes: "Travels with small dog. Needs pet-friendly accommodations. Always requests extra towels.",
    createdAt: toISOString(subMonths(new Date(), 15))
  },
  {
    id: "4",
    name: "Thomas Brown",
    email: "t.brown@example.com",
    previousStays: [],
    notes: "First-time guest. Mentioned celebrating birthday during stay.",
    createdAt: toISOString(subMonths(new Date(), 1))
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    previousStays: [
      { propertyName: "Lakeside Cottage", date: toISOString(subMonths(new Date(), 4)) }
    ],
    notes: "Gluten-free diet. Requested restaurant recommendations. Interested in local hiking trails.",
    createdAt: toISOString(subMonths(new Date(), 6))
  }
];

const PhonePage = () => {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>();
  const [showList, setShowList] = useState(true);
  const [activeTab, setActiveTab] = useState<"contacts" | "recent">("contacts");
  
  const selectedContact = contacts.find(c => c.id === selectedContactId);
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setShowList(false);
  };

  return (
    <MainLayout>
      <div className="h-full bg-card rounded-lg border border-border overflow-hidden animate-scale-in">
        <div className="flex h-full">
          {showList && (
            <div className="w-full">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h1 className="text-xl font-bold flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Contacts
                </h1>
              </div>
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "contacts" | "recent")}>
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="contacts" className="flex-1">All Contacts</TabsTrigger>
                  <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contacts" className="m-0 h-[calc(100vh-140px)]">
                  <ContactList 
                    contacts={contacts}
                    selectedContactId={selectedContactId}
                    onSelectContact={handleSelectContact}
                  />
                </TabsContent>
                
                <TabsContent value="recent" className="m-0 h-[calc(100vh-140px)]">
                  <ContactList 
                    contacts={contacts.slice(0, 3)}
                    selectedContactId={selectedContactId}
                    onSelectContact={handleSelectContact}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {!showList && selectedContact && (
            <div className="w-full relative p-6">
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 left-4 z-10"
                onClick={() => setShowList(true)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6 pt-8">
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
                    {selectedContact.previousStays.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {selectedContact.previousStays.map((stay, index) => (
                          <div key={index} className="p-3 flex justify-between">
                            <span className="font-medium">{stay.propertyName}</span>
                            <span className="text-muted-foreground">
                              {format(new Date(stay.date), "MMMM d, yyyy")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No previous stays recorded</p>
                    )}
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
                  
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Call
                    </Button>
                    <Button className="flex-1 gap-2" variant="outline">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PhonePage;
