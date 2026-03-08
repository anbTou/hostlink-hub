import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Lock, Mail, Home, MessageSquare, Globe, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ConversationSource } from "@/types/inbox";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "guest" | "team" | "internal";
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  channel: ConversationSource;
  isRead: boolean;
}

interface ChatMessageThreadProps {
  messages: ChatMessage[];
  typingAgent?: string;
  viewingAgent?: string;
}

const channelIcons: Record<ConversationSource, { icon: React.ReactNode; label: string }> = {
  email: { icon: <Mail className="h-3 w-3" />, label: "Email" },
  airbnb: { icon: <Home className="h-3 w-3" />, label: "Airbnb" },
  booking: { icon: <FileText className="h-3 w-3" />, label: "Booking" },
  whatsapp: { icon: <MessageSquare className="h-3 w-3" />, label: "WhatsApp" },
  vrbo: { icon: <Globe className="h-3 w-3" />, label: "VRBO" },
  expedia: { icon: <Globe className="h-3 w-3" />, label: "Expedia" },
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isGuest = message.sender === "guest";
  const isInternal = message.sender === "internal";
  const channelInfo = channelIcons[message.channel];
  const time = format(parseISO(message.timestamp), "h:mm a");

  if (isInternal) {
    return (
      <div className="mx-5 my-3">
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Internal note — not visible to guest
            </span>
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-100">{message.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">{message.senderName}</span>
            <span className="text-[10px] text-amber-500 dark:text-amber-500">{time}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2.5 mx-5 my-3", isGuest ? "justify-start" : "justify-end")}>
      {/* Guest avatar on left */}
      {isGuest && (
        <Avatar className="h-7 w-7 shrink-0 mt-1">
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt={message.senderName} />
          ) : (
            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-[10px] font-semibold">
              {message.senderName.charAt(0)}
            </div>
          )}
        </Avatar>
      )}

      <div className={cn("max-w-[70%] min-w-[200px]", isGuest ? "items-start" : "items-end")}>
        {/* Sender name */}
        <div className={cn("flex items-center gap-1.5 mb-1", !isGuest && "justify-end")}>
          <span className="text-[11px] font-medium text-muted-foreground">{message.senderName}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/70">
            {channelInfo.icon}
            {channelInfo.label}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm leading-relaxed",
            isGuest
              ? "bg-muted text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={cn("mt-1", !isGuest && "text-right")}>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
      </div>

      {/* Team avatar on right */}
      {!isGuest && (
        <Avatar className="h-7 w-7 shrink-0 mt-1">
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt={message.senderName} />
          ) : (
            <div className="bg-primary h-full w-full flex items-center justify-center text-primary-foreground text-[10px] font-semibold">
              {message.senderName.charAt(0)}
            </div>
          )}
        </Avatar>
      )}
    </div>
  );
}

export function ChatMessageThread({ messages, typingAgent, viewingAgent }: ChatMessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAgent]);

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {/* Collision banner */}
      {viewingAgent && (
        <div className="mx-5 mb-3 flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          {viewingAgent} is viewing this conversation
        </div>
      )}

      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Typing indicator */}
      {typingAgent && (
        <div className="flex items-center gap-2 mx-5 my-3 text-muted-foreground">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs">{typingAgent} is typing...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
