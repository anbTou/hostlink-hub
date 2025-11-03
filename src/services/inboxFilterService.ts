import { ConversationThread, InboxType } from "@/types/inbox";
import { getCurrentUser } from "@/types/team";

/**
 * Filter conversations by inbox type
 */
export const filterByInboxType = (
  conversations: ConversationThread[],
  inboxType: InboxType
): ConversationThread[] => {
  const currentUser = getCurrentUser();
  
  if (inboxType === 'main') {
    // Main inbox: show all conversations marked as 'main'
    return conversations.filter(conv => conv.inboxType === 'main');
  } else {
    // Private inbox: show only conversations assigned to current user
    return conversations.filter(conv => 
      conv.inboxType === 'private' && conv.assignedToUser === currentUser.id
    );
  }
};

/**
 * Assign conversation to a specific user (moves to their private inbox)
 */
export const assignToUser = (
  conversation: ConversationThread,
  userId: string
): ConversationThread => {
  return {
    ...conversation,
    assignedToUser: userId,
    inboxType: 'private'
  };
};

/**
 * Move conversation to main inbox (unassign from user)
 */
export const moveToMainInbox = (
  conversation: ConversationThread
): ConversationThread => {
  return {
    ...conversation,
    assignedToUser: undefined,
    inboxType: 'main'
  };
};

/**
 * Check if conversation is accessible by current user
 */
export const isAccessibleByUser = (
  conversation: ConversationThread,
  userId: string
): boolean => {
  // Main inbox conversations are accessible by everyone
  if (conversation.inboxType === 'main') {
    return true;
  }
  
  // Private inbox conversations are only accessible by assigned user
  return conversation.assignedToUser === userId;
};
