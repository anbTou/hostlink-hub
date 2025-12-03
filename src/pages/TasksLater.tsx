import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle, Loader2 } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskFormDialog, TaskFormValues } from "@/components/tasks/TaskFormDialog";
import { useTasks } from "@/hooks/useTasks";
import { isAfter, addDays, startOfToday } from "date-fns";

const TasksLater = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { tasks, isLoading, createTask, deleteTask, toggleTaskStatus } = useTasks();

  // Filter tasks due later (after this week)
  const laterTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return isAfter(dueDate, addDays(startOfToday(), 7));
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
            <h1 className="text-4xl font-bold mb-2">Upcoming Tasks</h1>
            <p className="text-muted-foreground">Tasks scheduled for later</p>
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
          ) : laterTasks.length > 0 ? (
            laterTasks.map(task => (
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
                <p className="text-muted-foreground text-center">No upcoming tasks</p>
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
        initialData={{ dueDate: addDays(new Date(), 14) }}
      />
    </MainLayout>
  );
};

export default TasksLater;