import React, { useState, useMemo } from 'react';
import { useTeam } from '@/contexts/TeamContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { startOfWeek, addDays, format, isSameDay, parseISO } from 'date-fns';
import { ShiftSchedule, getAgentById } from '@/types/team';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 - 22:00

export function TeamCalendarView() {
  const { allMembers, shifts, setShifts, isSenior, onShiftAgents, currentUser } = useTeam();
  const [weekOffset, setWeekOffset] = useState(0);
  const [shiftDialog, setShiftDialog] = useState<{ open: boolean; date: string; shift?: ShiftSchedule }>({ open: false, date: '' });
  const [formAgent, setFormAgent] = useState('');
  const [formStart, setFormStart] = useState('08:00');
  const [formEnd, setFormEnd] = useState('16:00');

  const weekStart = useMemo(() => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7), [weekOffset]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const weekLabel = `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`;

  const getShiftsForDay = (date: Date) =>
    shifts.filter(s => s.date === format(date, 'yyyy-MM-dd'));

  const handleDayClick = (date: Date) => {
    if (!isSenior) return;
    setFormAgent(allMembers[0].id);
    setFormStart('08:00');
    setFormEnd('16:00');
    setShiftDialog({ open: true, date: format(date, 'yyyy-MM-dd') });
  };

  const handleEditShift = (shift: ShiftSchedule) => {
    if (!isSenior) return;
    setFormAgent(shift.agentId);
    setFormStart(shift.startTime);
    setFormEnd(shift.endTime);
    setShiftDialog({ open: true, date: shift.date, shift });
  };

  const handleSaveShift = () => {
    const { date, shift } = shiftDialog;
    if (shift) {
      setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, agentId: formAgent, startTime: formStart, endTime: formEnd } : s));
    } else {
      setShifts(prev => [...prev, {
        id: `shift-${Date.now()}`,
        agentId: formAgent,
        date,
        startTime: formStart,
        endTime: formEnd,
        repeat: 'none',
      }]);
    }
    setShiftDialog({ open: false, date: '' });
  };

  const handleDeleteShift = () => {
    if (shiftDialog.shift) {
      setShifts(prev => prev.filter(s => s.id !== shiftDialog.shift!.id));
    }
    setShiftDialog({ open: false, date: '' });
  };

  const ROW_H = 28; // px per hour
  const timeToY = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h - 8) + m / 60) * ROW_H;
  };

  return (
    <div className="space-y-3 animate-scale-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Team Calendar</h1>
          <p className="text-xs text-muted-foreground">Manage shift schedules for your team</p>
        </div>
        {!isSenior && (
          <Badge variant="secondary" className="text-xs">Read-only</Badge>
        )}
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setWeekOffset(p => p - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <span className="font-semibold text-sm">{weekLabel}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>This Week</Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(p => p + 1)}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="grid grid-cols-[44px_repeat(7,1fr)]">
            {/* Header row */}
            <div className="border-b border-r border-border p-1" />
            {days.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={i}
                  className={`border-b border-r border-border p-1 text-center cursor-pointer hover:bg-muted/50 transition-colors ${isToday ? 'bg-primary/5' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="text-[10px] text-muted-foreground leading-tight">{format(day, 'EEE')}</div>
                  <div className={`text-sm font-bold leading-tight ${isToday ? 'text-primary' : ''}`}>{format(day, 'd')}</div>
                </div>
              );
            })}

            {/* Time rows */}
            <div className="border-r border-border">
              {HOURS.map(h => (
                <div key={h} style={{ height: ROW_H }} className="flex items-start justify-end pr-1.5 pt-0.5 text-[9px] text-muted-foreground border-b border-border">
                  {`${h}:00`}
                </div>
              ))}
            </div>

            {/* Day columns with shift blocks */}
            {days.map((day, dayIdx) => {
              const dayShifts = getShiftsForDay(day);
              return (
                <div
                  key={dayIdx}
                  className="relative border-r border-border"
                  style={{ height: HOURS.length * ROW_H }}
                  onClick={() => handleDayClick(day)}
                >
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div key={h} style={{ height: ROW_H }} className="border-b border-border" />
                  ))}

                  {/* Shift blocks */}
                  {dayShifts.map(shift => {
                    const agent = getAgentById(shift.agentId);
                    if (!agent) return null;
                    const top = timeToY(shift.startTime);
                    const height = timeToY(shift.endTime) - top;
                    return (
                      <div
                        key={shift.id}
                        className="absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-white text-[9px] leading-tight cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 24)}px`,
                          backgroundColor: agent.avatarColor,
                        }}
                        onClick={(e) => { e.stopPropagation(); handleEditShift(shift); }}
                      >
                        <div className="font-semibold truncate">{agent.name}</div>
                        <div className="opacity-80">{shift.startTime} – {shift.endTime}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Shift Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Today's Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {allMembers.map(member => {
              const todayShifts = shifts.filter(s => s.date === format(new Date(), 'yyyy-MM-dd') && s.agentId === member.id);
              const isOnShift = todayShifts.length > 0;
              return (
                <div key={member.id} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isOnShift ? 'bg-emerald-500' : 'bg-destructive'}`} />
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-sm">{member.name}</span>
                  {todayShifts.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {todayShifts.map(s => `${s.startTime}–${s.endTime}`).join(', ')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Shift Dialog */}
      <Dialog open={shiftDialog.open} onOpenChange={(open) => !open && setShiftDialog({ open: false, date: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{shiftDialog.shift ? 'Edit Shift' : 'Add Shift'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Agent</Label>
              <Select value={formAgent} onValueChange={setFormAgent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allMembers.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: m.avatarColor }} />
                        {m.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input value={shiftDialog.date} disabled className="bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={formStart} onChange={e => setFormStart(e.target.value)} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={formEnd} onChange={e => setFormEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {shiftDialog.shift && (
              <Button variant="destructive" size="sm" onClick={handleDeleteShift} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShiftDialog({ open: false, date: '' })}>Cancel</Button>
              <Button onClick={handleSaveShift}>Save Shift</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
