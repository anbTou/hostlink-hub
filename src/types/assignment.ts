
export interface MessageAssignment {
  messageId: string;
  threadId: string;
  assignedTo: string;
  assignedAt: string;
  isActive: boolean;
}

export interface AssignmentStatus {
  isAssigned: boolean;
  assignedTo?: string;
  assignedAt?: string;
  canTakeOver?: boolean;
}

export interface CollisionPreventionContext {
  assignments: Map<string, MessageAssignment>;
  currentUser: string;
  onAssignMessage: (threadId: string, messageId: string, userId: string) => void;
  onReleaseMessage: (threadId: string, messageId: string) => void;
  getAssignmentStatus: (threadId: string) => AssignmentStatus;
}
