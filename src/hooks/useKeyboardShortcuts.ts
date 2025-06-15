
import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const key = event.key.toLowerCase();
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    // Handle single key shortcuts
    if (!isCtrlOrCmd && shortcuts[key]) {
      event.preventDefault();
      shortcuts[key]();
      return;
    }
    
    // Handle Ctrl/Cmd combinations
    if (isCtrlOrCmd) {
      const combo = `ctrl+${key}`;
      if (shortcuts[combo]) {
        event.preventDefault();
        shortcuts[combo]();
      }
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

// Hook specifically for inbox navigation
export function useInboxShortcuts({
  onNextConversation,
  onPreviousConversation,
  onArchive,
  onMarkRead,
  onReply,
  onCompose,
  enabled = true
}: {
  onNextConversation: () => void;
  onPreviousConversation: () => void;
  onArchive: () => void;
  onMarkRead: () => void;
  onReply: () => void;
  onCompose: () => void;
  enabled?: boolean;
}) {
  const shortcuts = {
    'j': onNextConversation,
    'k': onPreviousConversation,
    'e': onArchive,
    'shift+i': onMarkRead,
    'r': onReply,
    'c': onCompose,
    'ctrl+enter': onReply,
  };

  useKeyboardShortcuts(shortcuts, enabled);
}
