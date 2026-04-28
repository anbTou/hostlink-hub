import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/contexts/TeamContext";
import { ShiftSchedule } from "@/types/team";
import { startOfWeek, addDays, format } from "date-fns";
import { Info, RefreshCw, ChevronDown, ChevronUp, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";

const DAYS = [
  { key: 0, label: "Mon" },
  { key: 1, label: "Tue" },
  { key: 2, label: "Wed" },
  { key: 3, label: "Thu" },
  { key: 4, label: "Fri" },
  { key: 5, label: "Sat" },
  { key: 6, label: "Sun" },
];

export function RoundRobinSettings() {
  const { roundRobin, setRoundRobin, allMembers, isSenior, getNextRoundRobinAgent, shifts, setShifts } = useTeam();
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = DAYS.map((_, i) => addDays(weekStart, i));

  const getAgentShifts = (agentId: string) =>
    shifts
      .filter(s => s.agentId === agentId && weekDates.some(d => format(d, "yyyy-MM-dd") === s.date))
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const updateShift = (id: string, patch: Partial<ShiftSchedule>) => {
    setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const addShift = (agentId: string, dayOffset: number) => {
    const date = format(addDays(weekStart, dayOffset), "yyyy-MM-dd");
    setShifts(prev => [
      ...prev,
      {
        id: `shift-${agentId}-${date}-${Date.now()}`,
        agentId,
        date,
        startTime: "09:00",
        endTime: "17:00",
        repeat: "none",
      },
    ]);
  };

  if (!isSenior) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Round Robin
          </CardTitle>
          <CardDescription>Only seniors can modify these settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Round Robin is currently {roundRobin.enabled ? "enabled" : "disabled"}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const nextAgent = getNextRoundRobinAgent();

  const toggleAgentInPool = (agentId: string) => {
    setRoundRobin(prev => ({
      ...prev,
      assignmentPool: prev.assignmentPool.includes(agentId)
        ? prev.assignmentPool.filter(id => id !== agentId)
        : [...prev.assignmentPool, agentId],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Round Robin Settings
        </CardTitle>
        <CardDescription>Configure automatic conversation assignment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Round Robin</Label>
            <p className="text-xs text-muted-foreground">Auto-assign new conversations to on-shift agents</p>
          </div>
          <Switch
            checked={roundRobin.enabled}
            onCheckedChange={(checked) => setRoundRobin(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {/* Assignment Pool */}
        <div className="space-y-3">
          <Label>Assignment Pool & Schedule</Label>
          <div className="space-y-2">
            {allMembers.map(member => {
              const isOnShift = member.isOnline;
              const isInPool = roundRobin.assignmentPool.includes(member.id);
              const isExpanded = expandedAgent === member.id;
              const memberShifts = getAgentShifts(member.id);

              return (
                <div key={member.id} className="rounded-lg border border-border">
                  <div className="flex items-center gap-3 p-3">
                    <Checkbox
                      id={`pool-${member.id}`}
                      checked={isInPool}
                      onCheckedChange={() => toggleAgentInPool(member.id)}
                      disabled={!isOnShift}
                    />
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: member.avatarColor, opacity: isOnShift ? 1 : 0.4 }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`pool-${member.id}`} className={!isOnShift ? "text-muted-foreground" : ""}>
                        {member.name}
                        <span className="text-[10px] text-muted-foreground ml-1 capitalize">({member.role})</span>
                      </Label>
                      <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {memberShifts.length === 0
                          ? "No shifts scheduled this week"
                          : `${memberShifts.length} shift${memberShifts.length > 1 ? "s" : ""} this week`}
                      </div>
                    </div>
                    {isOnShift ? (
                      <Badge variant="secondary" className="text-[9px] bg-emerald-100 text-emerald-700">On-shift ✓</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px] bg-destructive/10 text-destructive">Off-shift ✗</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setExpandedAgent(isExpanded ? null : member.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border p-3 bg-muted/30 space-y-2">
                      <div className="text-[11px] font-medium text-muted-foreground mb-1">
                        Schedule for week of {format(weekStart, "MMM d")}
                      </div>
                      {DAYS.map((day, idx) => {
                        const date = format(addDays(weekStart, idx), "yyyy-MM-dd");
                        const dayShifts = memberShifts.filter(s => s.date === date);
                        return (
                          <div key={day.key} className="flex items-center gap-2">
                            <div className="w-10 text-[11px] font-medium text-muted-foreground">{day.label}</div>
                            <div className="flex-1 flex flex-wrap items-center gap-2">
                              {dayShifts.length === 0 && (
                                <span className="text-[11px] text-muted-foreground italic">Off</span>
                              )}
                              {dayShifts.map(shift => (
                                <div key={shift.id} className="flex items-center gap-1 bg-background border border-border rounded px-1.5 py-0.5">
                                  <Input
                                    type="time"
                                    value={shift.startTime}
                                    onChange={e => updateShift(shift.id, { startTime: e.target.value })}
                                    className="h-6 w-[90px] text-[11px] px-1 border-0 focus-visible:ring-0"
                                  />
                                  <span className="text-[11px] text-muted-foreground">–</span>
                                  <Input
                                    type="time"
                                    value={shift.endTime}
                                    onChange={e => updateShift(shift.id, { endTime: e.target.value })}
                                    className="h-6 w-[90px] text-[11px] px-1 border-0 focus-visible:ring-0"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                                    onClick={() => deleteShift(shift.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                                onClick={() => addShift(member.id, idx)}
                              >
                                <Plus className="h-3 w-3 mr-0.5" /> Add
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Max conversations */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Max conversations per agent</Label>
            <p className="text-xs text-muted-foreground">Agent is skipped when they hit this limit</p>
          </div>
          <Select
            value={String(roundRobin.maxConversationsPerAgent)}
            onValueChange={(v) => setRoundRobin(prev => ({ ...prev, maxConversationsPerAgent: Number(v) }))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25].map(n => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current position */}
        {nextAgent && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Current rotation position: →{" "}
              <strong className="text-foreground">{nextAgent.name}</strong> (next)
            </span>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Round Robin only assigns to agents who are currently on-shift and have not reached their max conversation limit.
        </p>
      </CardContent>
    </Card>
  );
}
