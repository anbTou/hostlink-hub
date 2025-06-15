
import { useState, useEffect, useCallback } from 'react';
import { MessageAssignment, AssignmentStatus } from '@/types/assignment';
import { useToast } from '@/hooks/use-toast';

export function useCollisionPrevention(currentUser: string = 'current-user') {
  const [assignments, setAssignments] = useState<Map<string, MessageAssignment>>(new Map());
  const { toast } = useToast();

  const assignMessage = useCallback((threadId: string, messageId: string, userId: string) => {
    const assignmentKey = `${threadId}-${messageId}`;
    const existingAssignment = assignments.get(assignmentKey);

    if (existingAssignment && existingAssignment.assignedTo !== userId && existingAssignment.isActive) {
      toast({
        title: "Message already assigned",
        description: `This message is currently being handled by ${existingAssignment.assignedTo}`,
        variant: "destructive"
      });
      return false;
    }

    const newAssignment: MessageAssignment = {
      messageId,
      threadId,
      assignedTo: userId,
      assignedAt: new Date().toISOString(),
      isActive: true
    };

    setAssignments(prev => new Map(prev).set(assignmentKey, newAssignment));
    
    if (userId === currentUser) {
      toast({
        title: "Message assigned to you",
        description: "You are now handling this conversation"
      });
    }

    return true;
  }, [assignments, currentUser, toast]);

  const releaseMessage = useCallback((threadId: string, messageId: string) => {
    const assignmentKey = `${threadId}-${messageId}`;
    setAssignments(prev => {
      const newMap = new Map(prev);
      const assignment = newMap.get(assignmentKey);
      if (assignment) {
        newMap.set(assignmentKey, { ...assignment, isActive: false });
      }
      return newMap;
    });
  }, []);

  const getAssignmentStatus = useCallback((threadId: string): AssignmentStatus => {
    // Check if any message in this thread is assigned
    for (const [key, assignment] of assignments) {
      if (assignment.threadId === threadId && assignment.isActive) {
        return {
          isAssigned: true,
          assignedTo: assignment.assignedTo,
          assignedAt: assignment.assignedAt,
          canTakeOver: assignment.assignedTo !== currentUser
        };
      }
    }

    return {
      isAssigned: false,
      canTakeOver: false
    };
  }, [assignments, currentUser]);

  const autoAssignOnReply = useCallback((threadId: string, messageId: string) => {
    return assignMessage(threadId, messageId, currentUser);
  }, [assignMessage, currentUser]);

  // Auto-release assignments after 30 minutes of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000;

      setAssignments(prev => {
        const newMap = new Map();
        for (const [key, assignment] of prev) {
          const assignedTime = new Date(assignment.assignedAt).getTime();
          if (now - assignedTime < thirtyMinutes) {
            newMap.set(key, assignment);
          }
        }
        return newMap;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    assignments,
    assignMessage,
    releaseMessage,
    getAssignmentStatus,
    autoAssignOnReply,
    currentUser
  };
}
