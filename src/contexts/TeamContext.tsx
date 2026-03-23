import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { TeamMember, TeamRole, RoundRobinState, ShiftSchedule, teamMembers, getOnShiftAgents } from '@/types/team';
import { startOfWeek, addDays, format } from 'date-fns';

interface TeamContextType {
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  allMembers: TeamMember[];
  isSenior: boolean;
  onShiftAgents: TeamMember[];
  roundRobin: RoundRobinState;
  setRoundRobin: React.Dispatch<React.SetStateAction<RoundRobinState>>;
  getNextRoundRobinAgent: () => TeamMember | null;
  advanceRoundRobin: () => void;
  shifts: ShiftSchedule[];
  setShifts: React.Dispatch<React.SetStateAction<ShiftSchedule[]>>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

// Generate default shifts for current week
function generateDefaultShifts(): ShiftSchedule[] {
  const shifts: ShiftSchedule[] = [];
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

  const scheduleMap: Record<string, { weekday: string; weekend: string | null }> = {
    'agent-ana': { weekday: '08:00-16:00', weekend: '10:00-18:00' },
    'agent-pedro': { weekday: '14:00-22:00', weekend: null },
    'agent-sofia': { weekday: '08:00-16:00', weekend: '08:00-16:00' },
    'agent-joao': { weekday: '08:00-16:00', weekend: null },
    'agent-mariana': { weekday: '', weekend: '10:00-22:00' },
    'agent-tiago': { weekday: '14:00-22:00', weekend: '14:00-22:00' },
    'agent-carolina': { weekday: '', weekend: '08:00-16:00' },
  };

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = addDays(weekStart, dayOffset);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isWeekend = dayOffset >= 5; // Sat=5, Sun=6

    Object.entries(scheduleMap).forEach(([agentId, schedule]) => {
      const timeRange = isWeekend ? schedule.weekend : schedule.weekday;
      if (!timeRange) return;

      const [start, end] = timeRange.split('-');
      shifts.push({
        id: `shift-${agentId}-${dateStr}`,
        agentId,
        date: dateStr,
        startTime: start,
        endTime: end,
        repeat: 'none',
      });
    });
  }

  return shifts;
}

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<TeamMember>(teamMembers[0]); // Ana Costa
  const [shifts, setShifts] = useState<ShiftSchedule[]>(generateDefaultShifts);

  const onShiftAgents = useMemo(() => getOnShiftAgents(), []);

  const [roundRobin, setRoundRobin] = useState<RoundRobinState>({
    enabled: true,
    assignmentPool: teamMembers.map(m => m.id),
    maxConversationsPerAgent: 10,
    currentPositionIndex: 0,
  });

  const getEligibleAgents = useCallback(() => {
    return onShiftAgents.filter(a => roundRobin.assignmentPool.includes(a.id));
  }, [onShiftAgents, roundRobin.assignmentPool]);

  const getNextRoundRobinAgent = useCallback((): TeamMember | null => {
    if (!roundRobin.enabled) return null;
    const eligible = getEligibleAgents();
    if (eligible.length === 0) return null;
    const idx = roundRobin.currentPositionIndex % eligible.length;
    return eligible[idx];
  }, [roundRobin, getEligibleAgents]);

  const advanceRoundRobin = useCallback(() => {
    const eligible = getEligibleAgents();
    if (eligible.length === 0) return;
    setRoundRobin(prev => ({
      ...prev,
      currentPositionIndex: (prev.currentPositionIndex + 1) % eligible.length,
    }));
  }, [getEligibleAgents]);

  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
    allMembers: teamMembers,
    isSenior: currentUser.role === 'senior',
    onShiftAgents,
    roundRobin,
    setRoundRobin,
    getNextRoundRobinAgent,
    advanceRoundRobin,
    shifts,
    setShifts,
  }), [currentUser, onShiftAgents, roundRobin, getNextRoundRobinAgent, advanceRoundRobin, shifts]);

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamProvider');
  return ctx;
}
