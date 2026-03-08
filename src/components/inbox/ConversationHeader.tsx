import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  UserPlus, Tag, Clock, Check, MoreHorizontal, ArrowLeft,
  Archive, Trash2, Star, Flag
} from "lucide-react";
import { mockTeamMembers, TeamMember } from "@/types/team";
import { ConversationSource } from "@/types/inbox";

const TAG_OPTIONS = [
  { label: "Urgent", color: "bg-destructive/10 text-destructive" },
  { label: "VIP", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  { label: "Complaint", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" },
  { label: "Check-in", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { label: "Check-out", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  { label: "Maintenance", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300" },
];

const SNOOZE_OPTIONS = [
  { label: "1 hour", hours: 1 },
  { label: "3 hours", hours: 3 },
  { label: "Tomorrow morning", hours: 14 },
  { label: "Next week", hours: 168 },
];

interface ConversationHeaderProps {
  guestName: string;
  guestAvatarUrl?: string;
  reservationCode?: string;
  propertyName?: string;
  channel: ConversationSource;
  tags: string[];
  onBack: () => void;
  onAssign: (agentId: string) => void;
  onTag: (tag: string) => void;
  onSnooze: (hours: number) => void;
  onResolve: () => void;
}

const channelLabels: Record<ConversationSource, string> = {
  email: "Email",
  airbnb: "Airbnb",
  booking: "Booking",
  whatsapp: "WhatsApp",
  vrbo: "VRBO",
  expedia: "Expedia",
};

export function ConversationHeader({
  guestName,
  guestAvatarUrl,
  reservationCode,
  propertyName,
  channel,
  tags,
  onBack,
  onAssign,
  onTag,
  onSnooze,
  onResolve,
}: ConversationHeaderProps) {
  return (
    <div className="border-b border-border">
      {/* Row 1: Guest info */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-9 w-9 shrink-0">
          {guestAvatarUrl ? (
            <img src={guestAvatarUrl} alt={guestName} />
          ) : (
            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-sm font-semibold">
              {guestName?.charAt(0) || "?"}
            </div>
          )}
        </Avatar>
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="font-semibold text-foreground">{guestName}</span>
          {reservationCode && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground font-mono">#{reservationCode}</span>
            </>
          )}
          {propertyName && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{propertyName}</span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex items-center gap-1 ml-auto">
            {tags.map(tag => {
              const tagOption = TAG_OPTIONS.find(t => t.label.toLowerCase() === tag.toLowerCase());
              return (
                <Badge key={tag} variant="secondary" className={`text-[10px] ${tagOption?.color || ""}`}>
                  {tag}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Row 2: Action bar */}
      <div className="flex items-center gap-1.5 px-5 pb-3">
        {/* Assign dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              Assign to
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {mockTeamMembers.map(member => (
              <DropdownMenuItem key={member.id} onClick={() => onAssign(member.id)}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${member.isOnline ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                  <span>{member.name}</span>
                  <span className="text-muted-foreground text-[10px] ml-auto">{member.role}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tag dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {TAG_OPTIONS.map(tag => (
              <DropdownMenuItem key={tag.label} onClick={() => onTag(tag.label)}>
                <Badge variant="secondary" className={`text-[10px] ${tag.color}`}>{tag.label}</Badge>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Snooze dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Snooze
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {SNOOZE_OPTIONS.map(opt => (
              <DropdownMenuItem key={opt.label} onClick={() => onSnooze(opt.hours)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resolve */}
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={onResolve}>
          <Check className="h-3.5 w-3.5" />
          Resolve
        </Button>

        {/* More */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star className="h-3.5 w-3.5 mr-2" /> Star conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="h-3.5 w-3.5 mr-2" /> Flag for follow-up
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="h-3.5 w-3.5 mr-2" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
