
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";

// Sample task data for this week
const weekTasks = [
  {
    id: "2",
    title: "Schedule pool cleaning service",
    description: "Regular maintenance",
    priority: "medium" as "medium",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    assignee: "Jane Smith"
  },
  {
    id: "6",
    title: "Review booking requests for next weekend",
    description: "Accept or decline pending requests",
    priority: "medium" as "medium",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    assignee: "John Doe"
  }
];

const TasksWeek = () => {
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">This Week's Tasks</h1>
            <p className="text-muted-foreground">Tasks due this week</p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {weekTasks.length > 0 ? (
            weekTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No tasks due this week</p>
                <Button className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add a New Task
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TasksWeek;
