
import { useState } from 'react';
import { Type, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PlainTextToggleProps {
  isPlainText: boolean;
  onToggle: (isPlainText: boolean) => void;
}

export function PlainTextToggle({ isPlainText, onToggle }: PlainTextToggleProps) {
  const { toast } = useToast();

  const handleToggle = () => {
    const newMode = !isPlainText;
    onToggle(newMode);
    
    toast({
      title: `Switched to ${newMode ? 'plain text' : 'formatted'} view`,
      description: newMode 
        ? "Emails will now display without formatting" 
        : "Emails will now display with rich formatting"
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="gap-2"
    >
      {isPlainText ? (
        <>
          <FileText className="h-4 w-4" />
          Switch to Rich Text
        </>
      ) : (
        <>
          <Type className="h-4 w-4" />
          Switch to Plain Text
        </>
      )}
    </Button>
  );
}
