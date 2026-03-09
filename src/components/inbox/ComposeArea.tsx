import { useState, useRef, useEffect, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send, Paperclip, FileText, Globe, ChevronDown, Lock,
  Mail, Home, MessageSquare, Building2, Plane, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationSource } from "@/types/inbox";
import { TemplatesPanel } from "./TemplatesPanel";

interface ComposeAreaProps {
  defaultChannel: ConversationSource;
  onSend: (content: string, channel: ConversationSource, isInternal: boolean) => void;
  guestName?: string;
  guestEmail?: string;
  propertyName?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

const channelOptions: { value: ConversationSource; label: string; icon: React.ReactNode }[] = [
  { value: "booking", label: "Booking.com", icon: <Building2 className="h-3.5 w-3.5" /> },
  { value: "airbnb", label: "Airbnb", icon: <Home className="h-3.5 w-3.5" /> },
  { value: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { value: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  { value: "vrbo", label: "VRBO", icon: <Home className="h-3.5 w-3.5" /> },
  { value: "expedia", label: "Expedia", icon: <Plane className="h-3.5 w-3.5" /> },
];

function EmailChipInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (raw: string) => {
    const email = raw.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !value.includes(email)) {
      onChange([...value, email]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addEmail(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addEmail(inputValue);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1 min-h-[28px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((email) => (
        <Badge
          key={email}
          variant="secondary"
          className="h-5 text-[10px] gap-1 px-1.5 font-normal"
        >
          {email}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((v) => v !== email));
            }}
            className="ml-0.5 hover:text-destructive"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] bg-transparent border-0 outline-none text-[11px] text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

export function ComposeArea({
  defaultChannel,
  onSend,
  guestName = "",
  guestEmail = "",
  propertyName = "",
  checkInDate = "",
  checkOutDate = "",
}: ComposeAreaProps) {
  const [content, setContent] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<ConversationSource>(defaultChannel);
  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [showTemplates, setShowTemplates] = useState(false);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [showBcc, setShowBcc] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSelectedChannel(defaultChannel);
  }, [defaultChannel]);

  const isNote = mode === "note";
  const isEmail = selectedChannel === "email";
  const selectedOption = channelOptions.find(c => c.value === selectedChannel);

  const handleSend = () => {
    if (!content.trim()) return;
    onSend(content, selectedChannel, isNote);
    setContent("");
    setCcEmails([]);
    setBccEmails([]);
    setShowBcc(false);
  };

  const handleTemplateInsert = (template: string) => {
    const resolved = template
      .replace(/\{\{guest_name\}\}/g, guestName)
      .replace(/\{\{property_name\}\}/g, propertyName)
      .replace(/\{\{checkin_date\}\}/g, checkInDate)
      .replace(/\{\{checkout_date\}\}/g, checkOutDate);
    setContent(prev => prev + resolved);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {showTemplates && (
        <TemplatesPanel
          onSelect={handleTemplateInsert}
          onClose={() => setShowTemplates(false)}
        />
      )}
      <div className={cn(
        "border-t border-border",
        isNote && "bg-amber-50/50 dark:bg-amber-950/20"
      )}>
        {/* Mode tabs */}
        <div className="flex items-center border-b border-border">
          <button
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors relative",
              !isNote ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setMode("reply")}
          >
            Reply
            {!isNote && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors relative flex items-center gap-1.5",
              isNote ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setMode("note")}
          >
            <Lock className="h-3 w-3" />
            Internal Note
            {isNote && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
          </button>
        </div>

        {/* Channel selector (only in reply mode) */}
        {!isNote && (
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <span className="text-[11px] text-muted-foreground">Replying via:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1.5 px-2.5 bg-card border-border">
                  {selectedOption?.icon}
                  {selectedOption?.label}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px] bg-card border-border shadow-lg">
                {channelOptions.map(ch => (
                  <DropdownMenuItem key={ch.value} onClick={() => setSelectedChannel(ch.value)} className="gap-2 text-xs">
                    {ch.icon}
                    {ch.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Email fields: To, CC, BCC */}
        {!isNote && isEmail && (
          <div className="px-4 pt-1 space-y-0">
            {/* To field */}
            <div className="flex items-center gap-2 py-1.5 border-b border-border">
              <span className="text-[11px] text-muted-foreground w-8 shrink-0">To:</span>
              <span className="text-[11px] text-foreground">{guestEmail || "—"}</span>
            </div>
            {/* CC field */}
            <div className="flex items-center gap-2 py-1.5 border-b border-border">
              <span className="text-[11px] text-muted-foreground w-8 shrink-0">CC:</span>
              <div className="flex-1">
                <EmailChipInput
                  value={ccEmails}
                  onChange={setCcEmails}
                  placeholder="Add CC addresses..."
                />
              </div>
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  + BCC
                </button>
              )}
            </div>
            {/* BCC field */}
            {showBcc && (
              <div className="flex items-center gap-2 py-1.5 border-b border-border">
                <span className="text-[11px] text-muted-foreground w-8 shrink-0">BCC:</span>
                <div className="flex-1">
                  <EmailChipInput
                    value={bccEmails}
                    onChange={setBccEmails}
                    placeholder="Add BCC addresses..."
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {isNote && (
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              This note is only visible to your team
            </span>
          </div>
        )}

        {/* Text area */}
        <div className="px-4 py-2">
          <Textarea
            ref={textareaRef}
            placeholder={isNote ? "Write an internal note..." : "Type your reply..."}
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[80px] max-h-[200px] resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-sm",
              isNote && "placeholder:text-amber-400"
            )}
            rows={3}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              Attach
            </Button>
            {!isNote && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Templates
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground" title="Phase 2 — AI Translate">
                  <Globe className="h-3.5 w-3.5" />
                  Translate
                </Button>
              </>
            )}
          </div>
          <Button
            size="sm"
            className={cn("h-8 gap-1.5", isNote && "bg-amber-600 hover:bg-amber-700")}
            onClick={handleSend}
            disabled={!content.trim()}
          >
            <Send className="h-3.5 w-3.5" />
            {isNote ? "Add Note" : "Send"}
          </Button>
        </div>
      </div>
    </>
  );
}
