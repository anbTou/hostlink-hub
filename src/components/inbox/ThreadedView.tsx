
import { useState } from 'react';
import { ChevronDown, ChevronRight, Mail, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EmailActions } from './EmailActions';
import { format, parseISO } from 'date-fns';

interface ThreadMessage {
  id: string;
  subject: string;
  from: string;
  to: string[];
  text: string;
  timestamp: string;
  isRead: boolean;
  isCollapsed?: boolean;
}

interface ThreadedViewProps {
  messages: ThreadMessage[];
  threadId: string;
  isPlainText?: boolean;
}

export function ThreadedView({ messages, threadId, isPlainText = false }: ThreadedViewProps) {
  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(
    new Set(messages.slice(0, -1).map(m => m.id)) // Collapse all but the last message
  );

  const toggleMessageCollapse = (messageId: string) => {
    const newCollapsed = new Set(collapsedMessages);
    if (newCollapsed.has(messageId)) {
      newCollapsed.delete(messageId);
    } else {
      newCollapsed.add(messageId);
    }
    setCollapsedMessages(newCollapsed);
  };

  const formatEmailText = (text: string) => {
    if (isPlainText) {
      return text;
    }
    // Basic formatting for rich text
    return text.replace(/\n/g, '<br />');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {messages[0]?.subject || 'Email Conversation'}
        </h3>
        <Badge variant="secondary">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {messages.map((message, index) => {
          const isCollapsed = collapsedMessages.has(message.id);
          const isLatest = index === messages.length - 1;

          return (
            <Card key={message.id} className={cn(
              "transition-all duration-200",
              isLatest && "ring-2 ring-primary/20",
              !message.isRead && "bg-primary/5"
            )}>
              <div className="p-4">
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMessageCollapse(message.id)}
                      className="p-1 h-6 w-6"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{message.from}</span>
                      {!message.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          Unread
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {format(parseISO(message.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>

                {/* Message Content */}
                {!isCollapsed && (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <div><strong>To:</strong> {message.to.join(', ')}</div>
                      <div><strong>Subject:</strong> {message.subject}</div>
                    </div>
                    
                    <div className={cn(
                      "prose prose-sm max-w-none",
                      isPlainText && "font-mono text-sm whitespace-pre-wrap"
                    )}>
                      {isPlainText ? (
                        <pre className="whitespace-pre-wrap font-inherit">
                          {message.text}
                        </pre>
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: formatEmailText(message.text) 
                          }} 
                        />
                      )}
                    </div>

                    {/* Email Actions */}
                    <div className="pt-3 border-t">
                      <EmailActions
                        messageId={message.id}
                        threadId={threadId}
                        emailDetails={{
                          subject: message.subject,
                          from: message.from,
                          to: message.to
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Collapsed Preview */}
                {isCollapsed && (
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {message.text}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
