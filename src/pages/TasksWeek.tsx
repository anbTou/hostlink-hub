import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle, Loader2 } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskFormDialog, TaskFormValues } from "@/components/tasks/TaskFormDialog";
import { useTasks } from "@/hooks/useTasks";
import { isWithinInterval, startOfToday, addDays, isToday } from "date-fns";

const TasksWeek = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tasks, isLoading, createTask, deleteTask, toggleTaskStatus } = useTasks();

  // Filter tasks due this week (excluding today)
  const weekTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    // Exclude today's tasks
    if (isToday(dueDate)) return false;
    // Include tasks within next 7 days
    return isWithinInterval(dueDate, {
      start: addDays(startOfToday(), 1),
      end: addDays(startOfToday(), 7),
    });
  });

  const handleCreateTask = async (data: TaskFormValues) => {
    await createTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      type: data.type,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">This Week's Tasks</h1>
            <p className="text-muted-foreground">Tasks due this week</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : weekTasks.length > 0 ? (
            weekTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task}
                onDelete={() => deleteTask(task.id)}
                onToggleStatus={() => toggleTaskStatus(task.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No tasks due this week</p>
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add a New Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateTask}
        initialData={{ dueDate: addDays(new Date(), 3) }}
      />
    </MainLayout>
  );
};

export default TasksWeek;