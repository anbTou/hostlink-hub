
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Reply, Forward, Archive, Trash2 } from 'lucide-react';
import { EmailActions } from './EmailActions';
import { PlainTextToggle } from './PlainTextToggle';
import { ThreadedView } from './ThreadedView';
import { CollisionBanner } from './CollisionBanner';
import { BookingInfoPanel } from './BookingInfoPanel';
import { adaptMessagesToThreadFormat } from './MessageAdapter';
import { useCollisionPrevention } from '@/hooks/useCollisionPrevention';

interface ConversationViewProps {
  conversation: {
    id: string;
    subject: string;
    from: string;
    date: string;
    preview: string;
    isRead: boolean;
    labels: string[];
    messages: Array<{
      id: string;
      from: string;
      to: string;
      date: string;
      content: string;
      isRead: boolean;
    }>;
  };
  onBack: () => void;
  onReply?: (content: string) => void;
}

export function ConversationView({ conversation, onBack, onReply }: ConversationViewProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isPlainText, setIsPlainText] = useState(false);
  const { getAssignmentStatus, autoAssignOnReply } = useCollisionPrevention();
  
  const assignmentStatus = getAssignmentStatus(conversation.id);

  const handleReply = () => {
    if (replyContent.trim()) {
      const assigned = autoAssignOnReply(conversation.id, `reply-${Date.now()}`);
      
      if (assigned && onReply) {
        onReply(replyContent);
        setReplyContent('');
      }
    }
  };

  const handleTakeOver = () => {
    autoAssignOnReply(conversation.id, `takeover-${Date.now()}`);
  };

  // Adapt messages to the format expected by ThreadedView
  const adaptedMessages = adaptMessagesToThreadFormat(conversation.messages, conversation.subject);

  // Mock booking data based on conversation - in a real app, this would come from channel manager API
  const mockBooking = {
    id: `booking-${conversation.id}`,
    propertyId: 'prop-beach-villa-001',
    guestId: conversation.id,
    checkIn: '2024-09-15T15:00:00Z',
    checkOut: '2024-09-22T11:00:00Z',
    status: 'upcoming' as const,
    platform: 'airbnb' as const,
    totalAmount: 2800,
    currency: 'USD'
  };

  const mockGuest = {
    id: conversation.id,
    name: conversation.from.split('<')[0].trim(),
    email: conversation.from,
    phone: '+1 (555) 123-4567',
    totalStays: 3,
    totalSpent: 8500,
    memberSince: '2023-01-15',
    preferredLanguage: 'en',
    vipStatus: 'silver' as const
  };

  return (
    <div className="h-full flex">
      {/* Main conversation content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="font-semibold">{conversation.subject}</h2>
              <p className="text-sm text-muted-foreground">{conversation.from}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <PlainTextToggle isPlainText={isPlainText} onToggle={setIsPlainText} />
          </div>
        </div>

        <CollisionBanner 
          assignmentStatus={assignmentStatus}
          onTakeOver={handleTakeOver}
          canTakeOver={assignmentStatus.canTakeOver}
        />

        <div className="flex-1 overflow-auto">
          <ThreadedView 
            messages={adaptedMessages} 
            threadId={conversation.id}
            isPlainText={isPlainText}
          />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1"
              rows={3}
            />
            <Button onClick={handleReply} disabled={!replyContent.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Information Panel */}
      <BookingInfoPanel 
        booking={mockBooking}
        guest={mockGuest}
        onViewFullBooking={() => console.log('View full booking details')}
      />
    </div>
  );
}
