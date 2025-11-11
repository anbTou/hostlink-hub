
import { useState, useEffect } from "react";
import { Search, User, Calendar, Clock, Star, AlertTriangle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { ConversationThread, FilterOptions, BulkAction } from "@/types/inbox";
import { SmartFilters } from "./SmartFilters";
import { BulkActionBar } from "./BulkActionBar";

interface ThreadedConversationListProps {
  threads: ConversationThread[];
  selectedThreadId?: string;
  onSelectThread: (id: string) => void;
  onBulkAction: (action: BulkAction, threadIds: string[]) => void;
}

export function ThreadedConversationList({
  threads,
  selectedThreadId,
  onSelectThread,
  onBulkAction
}: ThreadedConversationListProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    platforms: [],
    dateRange: {},
    priority: [],
    tags: [],
    teams: [],
    properties: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Filter and search threads
  const filteredThreads = threads.filter(thread => {
    // Platform filter
    if (filters.platforms.length > 0) {
      const threadPlatforms = [...new Set(thread.messages.map(m => m.platform))];
      if (!threadPlatforms.some(p => filters.platforms.includes(p))) return false;
    }

    // Priority filter
    if (filters.priority.length > 0) {
      if (!filters.priority.includes(thread.priority)) return false;
    }

    // Search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesGuest = thread.guest.name.toLowerCase().includes(searchLower) ||
                          thread.guest.email.toLowerCase().includes(searchLower);
      const matchesMessage = thread.messages.some(m => 
        m.text.toLowerCase().includes(searchLower)
      );
      if (!matchesGuest && !matchesMessage) return false;
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const threadDate = new Date(thread.lastActivity);
      if (filters.dateRange.start && threadDate < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange.end && threadDate > new Date(filters.dateRange.end)) return false;
    }

    return true;
  });

  // Sort threads by priority and last activity
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  // Group threads by day
  const groupedThreads: { [key: string]: ConversationThread[] } = {};
  sortedThreads.forEach(thread => {
    const date = parseISO(thread.lastActivity);
    let groupKey = '';
    if (isToday(date)) {
      groupKey = 'Today';
    } else if (isYesterday(date)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(date)) {
      groupKey = format(date, 'EEEE');
    } else {
      groupKey = format(date, 'MMM d, yyyy');
    }
    
    if (!groupedThreads[groupKey]) {
      groupedThreads[groupKey] = [];
    }
    groupedThreads[groupKey].push(thread);
  });

  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedThreadIds(sortedThreads.map(t => t.id));
    } else {
      setSelectedThreadIds([]);
    }
  };

  const handleSelectThread = (threadId: string, checked: boolean) => {
    if (checked) {
      setSelectedThreadIds([...selectedThreadIds, threadId]);
    } else {
      setSelectedThreadIds(selectedThreadIds.filter(id => id !== threadId));
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'high': return <AlertTriangle className="h-3 w-3 text-orange-500" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-500" />;
      default: return null;
    }
  };

  const getUnreadCount = (thread: ConversationThread) => {
    return thread.messages.filter(m => !m.isRead && m.sender === "contact").length;
  };

  return (
    <div className="h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Conversations</h2>
          <div className="flex items-center gap-2">
            {sortedThreads.length > 0 && (
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            )}
          </div>
        </div>

        <SmartFilters
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {selectedThreadIds.length > 0 && (
        <BulkActionBar
          selectedCount={selectedThreadIds.length}
          onAction={(action) => {
            onBulkAction(action, selectedThreadIds);
            setSelectedThreadIds([]);
            setSelectAll(false);
          }}
          onClear={() => {
            setSelectedThreadIds([]);
            setSelectAll(false);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedThreads).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>No conversations found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedThreads).map(([dayLabel, dayThreads]) => (
              <div key={dayLabel}>
                <div className="sticky top-0 bg-background/90 backdrop-blur-sm px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  {dayLabel} ({dayThreads.length})
                </div>
                <ul>
                  {dayThreads.map(thread => {
                    const unreadCount = getUnreadCount(thread);
                    const isSelected = selectedThreadIds.includes(thread.id);
                    
                    return (
                      <li
                        key={thread.id}
                        className={cn(
                          "p-4 border-b border-border cursor-pointer transition-colors",
                          selectedThreadId === thread.id ? "bg-accent" : "hover:bg-muted/50",
                          unreadCount > 0 && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectThread(thread.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => onSelectThread(thread.id)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {thread.guest.avatarUrl ? (
                                    <img src={thread.guest.avatarUrl} alt={thread.guest.name} />
                                  ) : (
                                    <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                                      {thread.guest.name.charAt(0)}
                                    </div>
                                  )}
                                </Avatar>
                                
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium truncate">{thread.guest.name}</h3>
                                    {thread.guest.vipStatus !== 'none' && (
                                      <Star className="h-3 w-3 text-yellow-500" />
                                    )}
                                    {getPriorityIcon(thread.priority)}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {thread.guest.email}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {format(parseISO(thread.lastActivity), 'h:mm a')}
                                </span>
                                {unreadCount > 0 && (
                                  <Badge variant="default" className="text-xs">
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              {[...new Set(thread.messages.map(m => m.platform))].map(platform => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            
                            <p className={cn(
                              "text-sm line-clamp-2",
                              unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"
                            )}>
                              {thread.messages[thread.messages.length - 1]?.text}
                            </p>
                            
                            {thread.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {thread.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
