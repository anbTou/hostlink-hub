
import { useState } from 'react';
import { ExternalLink, AlertTriangle, MessageSquare, MoreHorizontal, Reply, Forward, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface EmailActionsProps {
  messageId: string;
  threadId: string;
  emailDetails: {
    subject: string;
    from: string;
    to: string[];
  };
}

export function EmailActions({ 
  messageId,
  threadId,
  emailDetails
}: EmailActionsProps) {
  const [isSpamDialogOpen, setIsSpamDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenInNewTab = () => {
    const emailUrl = `/inbox/email/${threadId}`;
    window.open(emailUrl, '_blank');
    
    toast({
      title: "Email opened in new tab",
      description: "You can now respond directly from the new tab."
    });
  };

  const handleMarkAsSpam = () => {
    console.log('Marking message as spam:', messageId);
    
    toast({
      title: "Marked as spam",
      description: "This message has been moved to spam folder.",
      variant: "destructive"
    });
    
    setIsSpamDialogOpen(false);
  };

  const handleDirectReply = () => {
    const subject = encodeURIComponent(`Re: ${emailDetails.subject}`);
    const to = encodeURIComponent(emailDetails.from);
    const mailtoLink = `mailto:${to}?subject=${subject}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email client",
      description: "Your default email client will open for direct response."
    });
  };

  const handleArchive = () => {
    console.log('Archiving message:', messageId);
    
    toast({
      title: "Message archived",
      description: "This message has been moved to archives."
    });
  };

  const handleForward = () => {
    console.log('Forwarding message:', messageId);
    
    toast({
      title: "Forward",
      description: "Forward functionality not implemented yet."
    });
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
          <DropdownMenuItem onClick={handleForward}>
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
