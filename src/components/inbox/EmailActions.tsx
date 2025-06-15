
import { useState } from 'react';
import { ExternalLink, AlertTriangle, MessageSquare, MoreHorizontal, Reply, Forward, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface EmailActionsProps {
  conversation: {
    id: string;
    subject: string;
    from: string;
    messages: Array<{
      id: string;
      from: string;
      to: string;
      date: string;
      content: string;
      isRead: boolean;
    }>;
  };
  onReply: () => void;
  onForward: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMarkAsSpam: () => void;
  onOpenInNewTab: () => void;
}

export function EmailActions({ 
  conversation, 
  onReply, 
  onForward, 
  onArchive, 
  onDelete, 
  onMarkAsSpam, 
  onOpenInNewTab 
}: EmailActionsProps) {
  const [isSpamDialogOpen, setIsSpamDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenInNewTab = () => {
    // Create a URL for the email view
    const emailUrl = `/inbox/email/${conversation.id}`;
    window.open(emailUrl, '_blank');
    
    toast({
      title: "Email opened in new tab",
      description: "You can now respond directly from the new tab."
    });
    
    onOpenInNewTab();
  };

  const handleMarkAsSpam = () => {
    // Implement spam marking logic
    console.log('Marking conversation as spam:', conversation.id);
    
    toast({
      title: "Marked as spam",
      description: "This message has been moved to spam folder.",
      variant: "destructive"
    });
    
    setIsSpamDialogOpen(false);
    onMarkAsSpam();
  };

  const handleDirectReply = () => {
    // Create mailto link for direct email response
    const subject = encodeURIComponent(`Re: ${conversation.subject}`);
    const to = encodeURIComponent(conversation.from);
    const mailtoLink = `mailto:${to}?subject=${subject}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email client",
      description: "Your default email client will open for direct response."
    });
  };

  const handleArchive = () => {
    console.log('Archiving thread:', conversation.id);
    
    toast({
      title: "Conversation archived",
      description: "This conversation has been moved to archives."
    });
    
    onArchive();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenInNewTab}
        className="gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Open in New Tab
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDirectReply}
        className="gap-2"
      >
        <Reply className="h-4 w-4" />
        Direct Reply
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSpamDialogOpen(true)}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Mark as Spam
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onForward}>
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSpamDialogOpen} onOpenChange={setIsSpamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Spam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to mark this message as spam? This will move it to the spam folder and help improve our filtering.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSpamDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleMarkAsSpam}>
                Mark as Spam
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
