
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";

// Sample task data for later
const laterTasks = [
  {
    id: "7",
    title: "Research new property management software",
    description: "Evaluate alternatives to current system",
    priority: "low" as "low",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    assignee: "Jane Smith"
  },
  {
    id: "8",
    title: "Plan renovations for Unit 5",
    description: "Create budget and timeline for bathroom updates",
    priority: "medium" as "medium",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    assignee: "John Doe"
  }
];

const TasksLater = () => {
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Upcoming Tasks</h1>
            <p className="text-muted-foreground">Tasks scheduled for later</p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {laterTasks.length > 0 ? (
            laterTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No upcoming tasks</p>
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

export default TasksLater;
