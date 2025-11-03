import { MainLayout } from "@/components/layout/MainLayout";
import { InboxContainer } from "@/components/inbox/InboxContainer";
import { getCurrentUser } from "@/types/team";

// Get current user for filtering
const currentUser = getCurrentUser();

// Sample conversation data for private inbox
const privateInboxConversations = [
  {
    id: "4",
    subject: "Direct Inquiry - City Apartment",
    from: "Thomas Brown <t.brown@example.com>",
    date: "2024-01-12T09:15:00Z",
    preview: "Hi John, I was referred to you specifically. I'm interested in renting the city apartment for a week in February. Could you tell me more about the parking situation?",
    isRead: false,
    labels: ["inquiry", "parking"],
    inboxType: "private" as const,
    assignedToUser: currentUser.id,
    messages: [
      {
        id: "msg-4",
        from: "Thomas Brown <t.brown@example.com>",
        to: "john.smith@property.com",
        date: "2024-01-12T09:15:00Z",
        content: "Hi John, I was referred to you specifically. I'm interested in renting the city apartment for a week in February. Could you tell me more about the parking situation?",
        isRead: false
      }
    ]
  },
  {
    id: "5",
    subject: "Personal Restaurant Recommendations",
    from: "Emma Wilson <emma.wilson@example.com>",
    date: "2024-01-11T16:20:00Z",
    preview: "Hi John, we're staying at the luxury suite next month and would love your personal recommendations for local restaurants. We're particularly interested in Italian cuisine.",
    isRead: true,
    labels: ["recommendation", "restaurant"],
    inboxType: "private" as const,
    assignedToUser: currentUser.id,
    messages: [
      {
        id: "msg-5",
        from: "Emma Wilson <emma.wilson@example.com>",
        to: "john.smith@property.com",
        date: "2024-01-11T16:20:00Z",
        content: "Hi John, we're staying at the luxury suite next month and would love your personal recommendations for local restaurants. We're particularly interested in Italian cuisine.",
        isRead: true
      }
    ]
  },
  {
    id: "6",
    subject: "Follow-up on Special Request",
    from: "David Lee <david.lee@example.com>",
    date: "2024-01-10T11:30:00Z",
    preview: "John, thank you for accommodating our early check-in request last time. We'd like to book again with similar arrangements if possible.",
    isRead: true,
    labels: ["follow-up", "special-request"],
    inboxType: "private" as const,
    assignedToUser: currentUser.id,
    messages: [
      {
        id: "msg-6",
        from: "David Lee <david.lee@example.com>",
        to: "john.smith@property.com",
        date: "2024-01-10T11:30:00Z",
        content: "John, thank you for accommodating our early check-in request last time. We'd like to book again with similar arrangements if possible.",
        isRead: true
      }
    ]
  }
];

const InboxPrivate = () => {
  return (
    <MainLayout>
      <InboxContainer 
        inboxType="private"
        sampleConversations={privateInboxConversations}
      />
    </MainLayout>
  );
};

export default InboxPrivate;
