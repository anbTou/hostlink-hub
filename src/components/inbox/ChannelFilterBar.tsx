import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare } from "lucide-react";
import { ConversationSource } from "@/types/inbox";
import { InboxConversation } from "./InboxConversationItem";

interface ChannelFilterBarProps {
  conversations: InboxConversation[];
  activeChannels: ConversationSource[];
  onToggleChannel: (channel: ConversationSource) => void;
}

const channels: { value: ConversationSource; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "airbnb", label: "Airbnb" },
  { value: "booking", label: "Booking" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "vrbo", label: "VRBO" },
  { value: "expedia", label: "Expedia" },
];

export function ChannelFilterBar({ conversations, activeChannels, onToggleChannel }: ChannelFilterBarProps) {
  const getUnreadCount = (channel: ConversationSource) =>
    conversations.filter(c => c.channel === channel && c.isUnread).length;

  return (
    <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-border scrollbar-hide">
      {channels.map(ch => {
        const unread = getUnreadCount(ch.value);
        const isActive = activeChannels.includes(ch.value);
        return (
          <Button
            key={ch.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs px-2.5 shrink-0 gap-1.5"
            onClick={() => onToggleChannel(ch.value)}
          >
            {ch.label}
            {unread > 0 && (
              <Badge variant={isActive ? "secondary" : "outline"} className="text-[9px] h-4 px-1 min-w-[16px]">
                {unread}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
