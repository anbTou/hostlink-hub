
import { Flag, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: Date;
  status: "pending" | "completed";
}

interface PriorityTasksProps {
  tasks: Task[];
}

export function PriorityTasks({ tasks }: PriorityTasksProps) {
  // Calculate days since creation
  const getDaysSinceCreation = (createdAt: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const daysSinceCreation = getDaysSinceCreation(task.createdAt);
        return (
          <div 
            key={task.id} 
            className={cn(
              "flex items-start gap-4 p-3 rounded-lg border transition-all",
              daysSinceCreation >= 2 ? "border-red-200 bg-red-50" : "border-border",
              "hover:shadow-sm"
            )}
          >
            <Checkbox id={`task-${task.id}`} />
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start gap-2">
                <label 
                  htmlFor={`task-${task.id}`} 
                  className={cn(
                    "font-medium cursor-pointer",
                    task.status === "completed" && "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={task.priority === "high" ? "destructive" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <Flag className="h-3 w-3" />
                    {task.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Due: {task.dueDate}</span>
                </div>
                {daysSinceCreation > 0 && (
                  <div className={cn(
                    "flex items-center gap-1",
                    daysSinceCreation >= 2 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {daysSinceCreation >= 2 && <AlertTriangle className="h-3 w-3" />}
                    <span>Age: {daysSinceCreation} {daysSinceCreation === 1 ? "day" : "days"}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button size="sm" variant="ghost">View</Button>
          </div>
        );
      })}
    </div>
  );
}
