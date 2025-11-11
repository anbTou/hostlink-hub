
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar, 
  Clock, 
  Flag, 
  MoreVertical, 
  User,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "done";
  dueDate: Date;
  createdAt: Date;
  assignee: string;
}

interface TaskItemProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) => {
  const [status, setStatus] = useState(task.status);
  
  // Calculate days since creation
  const daysSinceCreation = differenceInDays(new Date(), task.createdAt);
  const isDueDatePast = isPast(task.dueDate) && status !== "done";
  const daysOverdue = isDueDatePast ? differenceInDays(new Date(), task.dueDate) : 0;
  
  // Update task status
  const handleStatusChange = () => {
    const newStatus = status === "todo" ? "done" : "todo";
    setStatus(newStatus);
    onToggleStatus?.();
  };
  
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition-all",
        status === "done" ? "bg-muted/30" : "bg-card",
        isDueDatePast && "border-red-300 bg-red-50",
        (daysSinceCreation > 7 && status !== "done") && "border-amber-300",
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={status === "done"} 
          onCheckedChange={handleStatusChange}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 
              className={cn(
                "font-medium transition-all",
                status === "done" && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  task.priority === "urgent" || task.priority === "high" ? "destructive" : 
                  task.priority === "medium" ? "default" : 
                  "secondary"
                }
                className="flex items-center gap-1"
              >
                <Flag className="h-3 w-3" />
                {task.priority}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{task.description}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground pt-1">
            <div className={cn(
              "flex items-center gap-1",
              isDueDatePast && "text-red-500 font-medium"
            )}>
              <Calendar className="h-3 w-3" />
              <span>
                Due: {format(task.dueDate, "MMM d, yyyy")}
                {isDueDatePast && daysOverdue > 0 && (
                  <span className="ml-1">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created: {format(task.createdAt, "MMM d, yyyy")}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Assignee: {task.assignee}</span>
            </div>
            
            {daysSinceCreation > 0 && status !== "done" && (
              <div className={cn(
                "flex items-center gap-1",
                daysSinceCreation > 7 ? "text-amber-500 font-medium" : ""
              )}>
                <Clock className="h-3 w-3" />
                <span>Age: {daysSinceCreation} {daysSinceCreation === 1 ? "day" : "days"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
