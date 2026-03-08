import React, { useState } from 'react';
import { ConversationHeader } from './ConversationHeader';
import { ChatMessageThread, ChatMessage } from './ChatMessageThread';
import { ComposeArea } from './ComposeArea';
import { ConversationSource } from '@/types/inbox';
import { getCurrentUser } from '@/types/team';
import { useToast } from '@/hooks/use-toast';

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
  guestName: string;
  guestAvatarUrl?: string;
  channel: ConversationSource;
  reservationCode?: string;
  propertyName?: string;
  tags: string[];
  onBack: () => void;
  onReply?: (content: string) => void;
  onAssign?: (agentId: string) => void;
  onTag?: (tag: string) => void;
  onSnooze?: (hours: number) => void;
  onResolve?: () => void;
}

export function ConversationView({
  conversation,
  guestName,
  guestAvatarUrl,
  channel,
  reservationCode,
  propertyName,
  tags,
  onBack,
  onReply,
  onAssign,
  onTag,
  onSnooze,
  onResolve,
}: ConversationViewProps) {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    conversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: "guest" as const,
      senderName: guestName,
      senderAvatar: guestAvatarUrl,
      timestamp: msg.date,
      channel,
      isRead: msg.isRead,
    }))
  );

  const handleSend = (content: string, sendChannel: ConversationSource, isInternal: boolean) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: isInternal ? "internal" : "team",
      senderName: currentUser.name,
      timestamp: new Date().toISOString(),
      channel: sendChannel,
      isRead: true,
    };
    setChatMessages(prev => [...prev, newMsg]);

    if (!isInternal) {
      onReply?.(content);
      toast({ title: `Reply sent via ${sendChannel}` });
    } else {
      toast({ title: "Internal note added" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ConversationHeader
        guestName={guestName}
        guestAvatarUrl={guestAvatarUrl}
        reservationCode={reservationCode}
        propertyName={propertyName}
        channel={channel}
        tags={tags}
        onBack={onBack}
        onAssign={(agentId) => {
          onAssign?.(agentId);
          toast({ title: "Conversation assigned" });
        }}
        onTag={(tag) => {
          onTag?.(tag);
          toast({ title: `Tag "${tag}" added` });
        }}
        onSnooze={(hours) => {
          onSnooze?.(hours);
          toast({ title: `Snoozed for ${hours} hours` });
        }}
        onResolve={() => {
          onResolve?.();
          toast({ title: "Conversation resolved" });
        }}
      />

      <ChatMessageThread
        messages={chatMessages}
        // Mock: show typing/viewing indicators for demo
        // typingAgent="João"
        // viewingAgent="Ana"
      />

      <ComposeArea
        defaultChannel={channel}
        onSend={handleSend}
        guestName={guestName}
        propertyName={propertyName}
      />
    </div>
  );
}
