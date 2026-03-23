import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/contexts/TeamContext";
import { Info, RefreshCw } from "lucide-react";

export function RoundRobinSettings() {
  const { roundRobin, setRoundRobin, allMembers, onShiftAgents, getNextRoundRobinAgent, isSenior } = useTeam();

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
          <Label>Assignment Pool</Label>
          <div className="space-y-2">
            {allMembers.map(member => {
              const isOnShift = member.isOnline;
              const isInPool = roundRobin.assignmentPool.includes(member.id);
              return (
                <div key={member.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`pool-${member.id}`}
                    checked={isInPool}
                    onCheckedChange={() => toggleAgentInPool(member.id)}
                    disabled={!isOnShift}
                  />
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ backgroundColor: member.avatarColor, opacity: isOnShift ? 1 : 0.4 }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <Label htmlFor={`pool-${member.id}`} className={!isOnShift ? "text-muted-foreground" : ""}>
                    {member.name}
                    <span className="text-[10px] text-muted-foreground ml-1 capitalize">({member.role})</span>
                  </Label>
                  <span className="ml-auto text-[10px]">
                    {isOnShift ? (
                      <Badge variant="secondary" className="text-[9px] bg-emerald-100 text-emerald-700">On-shift ✓</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px] bg-destructive/10 text-destructive">Off-shift ✗</Badge>
                    )}
                  </span>
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
