export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  avatar?: string;
  isOnline: boolean;
}

// Mock team members for demonstration
export const mockTeamMembers: TeamMember[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@property.com",
    role: "manager",
    isOnline: true
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah.johnson@property.com",
    role: "agent",
    isOnline: true
  },
  {
    id: "user-3",
    name: "Michael Chen",
    email: "michael.chen@property.com",
    role: "agent",
    isOnline: false
  },
  {
    id: "user-4",
    name: "Emma Davis",
    email: "emma.davis@property.com",
    role: "admin",
    isOnline: true
  }
];

// Mock current user (in real app, this would come from auth context)
export const getCurrentUser = (): TeamMember => {
  return mockTeamMembers[0]; // Default to John Smith
};
