import { MainLayout } from "@/components/layout/MainLayout";
import { InboxContainer } from "@/components/inbox/InboxContainer";

// Sample conversation data for main inbox
const mainInboxConversations = [
  {
    id: "1",
    subject: "Booking Inquiry - Beachfront Villa",
    from: "Sarah Miller <sarah.miller@example.com>",
    date: "2024-01-15T10:30:00Z",
    preview: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing?",
    isRead: false,
    labels: ["urgent", "booking"],
    inboxType: "main" as const,
    messages: [
      {
        id: "msg-1",
        from: "Sarah Miller <sarah.miller@example.com>",
        to: "bookings@property.com",
        date: "2024-01-15T10:30:00Z",
        content: "Hi, I'm interested in booking your beachfront villa for my anniversary trip in September. Could you please provide availability and pricing for September 15-22?",
        isRead: false
      }
    ]
  },
  {
    id: "2",
    subject: "Question about Mountain Cabin",
    from: "John Davis <john.davis@example.com>",
    date: "2024-01-14T14:00:00Z",
    preview: "I have a question about the amenities at the mountain cabin. Does it have a fireplace and is firewood provided?",
    isRead: true,
    labels: ["question"],
    inboxType: "main" as const,
    messages: [
      {
        id: "msg-2",
        from: "John Davis <john.davis@example.com>",
        to: "info@property.com",
        date: "2024-01-14T14:00:00Z",
        content: "I have a question about the amenities at the mountain cabin. Does it have a fireplace and is firewood provided?",
        isRead: true
      }
    ]
  },
  {
    id: "3",
    subject: "Feedback on Lakeside Cottage",
    from: "Maria Rodriguez <maria.r@example.com>",
    date: "2024-01-13T18:45:00Z",
    preview: "We had a wonderful stay at the lakeside cottage! The view was amazing, and we enjoyed the peaceful atmosphere. We'll definitely be back!",
    isRead: true,
    labels: ["feedback", "positive"],
    inboxType: "main" as const,
    messages: [
      {
        id: "msg-3",
        from: "Maria Rodriguez <maria.r@example.com>",
        to: "feedback@property.com",
        date: "2024-01-13T18:45:00Z",
        content: "We had a wonderful stay at the lakeside cottage! The view was amazing, and we enjoyed the peaceful atmosphere. We'll definitely be back!",
        isRead: true
      }
    ]
  }
];

const InboxMain = () => {
  return (
    <MainLayout>
      <InboxContainer 
        inboxType="main"
        sampleConversations={mainInboxConversations}
      />
    </MainLayout>
  );
};

export default InboxMain;
