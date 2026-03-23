export type TeamRole = 'senior' | 'support';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatarColor: string;
  isOnline: boolean;
}

export interface ShiftSchedule {
  id: string;
  agentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  repeat: 'none' | 'daily' | 'weekly' | 'custom';
}

export interface RoundRobinState {
  enabled: boolean;
  assignmentPool: string[]; // agent IDs included in rotation
  maxConversationsPerAgent: number;
  currentPositionIndex: number; // index into the sorted on-shift pool
}

// 7 team members as specified
export const teamMembers: TeamMember[] = [
  {
    id: "agent-ana",
    name: "Ana Costa",
    email: "ana.costa@hostsy.com",
    role: "senior",
    avatarColor: "#6366F1", // indigo
    isOnline: true,
  },
  {
    id: "agent-pedro",
    name: "Pedro Almeida",
    email: "pedro.almeida@hostsy.com",
    role: "senior",
    avatarColor: "#8B5CF6", // violet
    isOnline: true,
  },
  {
    id: "agent-sofia",
    name: "Sofia Martins",
    email: "sofia.martins@hostsy.com",
    role: "support",
    avatarColor: "#F59E0B", // amber
    isOnline: true,
  },
  {
    id: "agent-joao",
    name: "João Ferreira",
    email: "joao.ferreira@hostsy.com",
    role: "support",
    avatarColor: "#10B981", // emerald
    isOnline: true,
  },
  {
    id: "agent-mariana",
    name: "Mariana Silva",
    email: "mariana.silva@hostsy.com",
    role: "support",
    avatarColor: "#EC4899", // pink
    isOnline: false,
  },
  {
    id: "agent-tiago",
    name: "Tiago Santos",
    email: "tiago.santos@hostsy.com",
    role: "support",
    avatarColor: "#3B82F6", // blue
    isOnline: true,
  },
  {
    id: "agent-carolina",
    name: "Carolina Oliveira",
    email: "carolina.oliveira@hostsy.com",
    role: "support",
    avatarColor: "#F97316", // orange
    isOnline: false,
  },
];

// Keep backward compat
export const mockTeamMembers = teamMembers;

export const getCurrentUser = (): TeamMember => {
  // Will be overridden by TeamContext in runtime
  return teamMembers[0]; // Ana Costa
};

// Helper: get on-shift agents sorted alphabetically
export const getOnShiftAgents = (): TeamMember[] =>
  teamMembers.filter(m => m.isOnline).sort((a, b) => a.name.localeCompare(b.name));

// Helper: get agent by id
export const getAgentById = (id: string): TeamMember | undefined =>
  teamMembers.find(m => m.id === id);
