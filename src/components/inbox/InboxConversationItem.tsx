import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Check, UserPlus, Mail, MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ConversationSource } from "@/types/inbox";

export interface InboxConversation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestAvatarUrl?: string;
  channel: ConversationSource;
  preview: string;
  timestamp: string;
  propertyName?: string;
  tags: string[];
  isUnread: boolean;
  isStarred: boolean;
  isSnoozed: boolean;
  snoozeUntil?: string;
  isResolved: boolean;
  assignedTo?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  isAssignedToMe: boolean;
}

interface InboxConversationItemProps {
  conversation: InboxConversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onSnooze: (id: string) => void;
  onResolve: (id: string) => void;
  onAssign: (id: string) => void;
}

const channelConfig: Record<ConversationSource, { label: string; color: string }> = {
  email: { label: "Email", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  airbnb: { label: "Airbnb", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  booking: { label: "Booking", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
  whatsapp: { label: "WhatsApp", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  vrbo: { label: "VRBO", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  expedia: { label: "Expedia", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
};

export function InboxConversationItem({
  conversation,
  isSelected,
  onSelect,
  onSnooze,
  onResolve,
  onAssign,
}: InboxConversationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const channel = channelConfig[conversation.channel];
  const time = format(parseISO(conversation.timestamp), "h:mm a");

  return (
    <div
      className={cn(
        "relative px-4 py-3.5 cursor-pointer transition-colors border-b border-border group",
        isSelected && "bg-accent",
        !isSelected && "hover:bg-muted/50",
        conversation.isUnread && !isSelected && "bg-primary/[0.04]",
        conversation.isAssignedToMe && "border-l-2 border-l-primary"
      )}
      onClick={() => onSelect(conversation.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-9 w-9 shrink-0 mt-0.5">
          {conversation.guestAvatarUrl ? (
            <img src={conversation.guestAvatarUrl} alt={conversation.guestName} />
          ) : (
            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-sm font-medium">
              {conversation.guestName.charAt(0)}
            </div>
          )}
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Name + channel + timestamp */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={cn("text-sm truncate", conversation.isUnread ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                {conversation.guestName}
              </span>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-sm shrink-0", channel.color)}>
                {channel.label}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
          </div>

          {/* Row 2: Preview */}
          <p className={cn(
            "text-xs line-clamp-1 mt-0.5",
            conversation.isUnread ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {conversation.isSnoozed && (
              <span className="inline-flex items-center gap-0.5 text-muted-foreground mr-1">
                <Clock className="h-3 w-3" />
                {conversation.snoozeUntil && format(parseISO(conversation.snoozeUntil), "MMM d")}
              </span>
            )}
            {conversation.preview}
          </p>

          {/* Row 3: Property + tags + agent */}
          <div className="flex items-center justify-between mt-1 gap-2">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              {conversation.propertyName && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                  {conversation.propertyName}
                </span>
              )}
              {conversation.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-[9px] h-4 px-1.5 shrink-0">
                  {tag}
                </Badge>
              ))}
            </div>
            {conversation.assignedTo && (
              <Avatar className="h-5 w-5 shrink-0">
                {conversation.assignedToAvatar ? (
                  <img src={conversation.assignedToAvatar} alt={conversation.assignedToName} />
                ) : (
                  <div className="bg-muted h-full w-full flex items-center justify-center text-muted-foreground text-[9px] font-medium">
                    {conversation.assignedToName?.charAt(0) || "?"}
                  </div>
                )}
              </Avatar>
            )}
          </div>
        </div>
      </div>

      {/* Hover actions */}
      {isHovered && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-background/95 border border-border rounded-md shadow-sm p-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSnooze(conversation.id)} title="Snooze">
            <Clock className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onResolve(conversation.id)} title="Mark as resolved">
            <Check className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAssign(conversation.id)} title="Assign">
            <UserPlus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
