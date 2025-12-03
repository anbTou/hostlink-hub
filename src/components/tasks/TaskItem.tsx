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
  AlertTriangle,
  Sparkles,
  Wrench,
  LogIn,
  LogOut,
  MessageSquare,
  Search,
  Package,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskType } from "./TaskFormDialog";

const TYPE_CONFIG: Record<TaskType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  cleaning: { label: "Cleaning", icon: Sparkles, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
  check_in: { label: "Check-in", icon: LogIn, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  check_out: { label: "Check-out", icon: LogOut, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  guest_communication: { label: "Guest Comm.", icon: MessageSquare, color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300" },
  inspection: { label: "Inspection", icon: Search, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300" },
  supplies: { label: "Supplies", icon: Package, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  administrative: { label: "Admin", icon: FileText, color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  other: { label: "Other", icon: MoreHorizontal, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  type?: TaskType;
  due_date: string | null;
  created_at: string;
  assigned_to: string | null;
}

interface TaskItemProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) => {
  const [status, setStatus] = useState(task.status);
  
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const createdAt = new Date(task.created_at);
  
  // Calculate days since creation
  const daysSinceCreation = differenceInDays(new Date(), createdAt);
  const isDueDatePast = dueDate && isPast(dueDate) && status !== "done";
  const daysOverdue = isDueDatePast && dueDate ? differenceInDays(new Date(), dueDate) : 0;
  
  // Update task status
  const handleStatusChange = () => {
    const newStatus = status === "todo" ? "done" : "todo";
    setStatus(newStatus);
    onToggleStatus?.();
  };

  const typeConfig = TYPE_CONFIG[task.type || "other"];
  const TypeIcon = typeConfig.icon;
  
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition-all",
        status === "done" ? "bg-muted/30" : "bg-card",
        isDueDatePast && "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950",
        (daysSinceCreation > 7 && status !== "done") && "border-amber-300 dark:border-amber-700",
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
              {/* Type Badge */}
              <Badge 
                variant="secondary"
                className={cn("flex items-center gap-1", typeConfig.color)}
              >
                <TypeIcon className="h-3 w-3" />
                {typeConfig.label}
              </Badge>

              {/* Priority Badge */}
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
                <DropdownMenuContent align="end" className="bg-popover">
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
          
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground pt-1">
            {dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isDueDatePast && "text-red-500 font-medium"
              )}>
                <Calendar className="h-3 w-3" />
                <span>
                  Due: {format(dueDate, "MMM d, yyyy")}
                  {isDueDatePast && daysOverdue > 0 && (
                    <span className="ml-1">
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                      {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
                    </span>
                  )}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created: {format(createdAt, "MMM d, yyyy")}</span>
            </div>
            
            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Assignee: {task.assigned_to}</span>
              </div>
            )}
            
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