
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";
import { TaskItem } from "@/components/tasks/TaskItem";

// Sample task data for today
const todayTasks = [
  {
    id: "1",
    title: "Fix broken air conditioning in Unit 3",
    description: "Guest reported that the A/C is not cooling properly",
    priority: "high",
    status: "todo",
    dueDate: new Date(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    assignee: "John Doe"
  },
  {
    id: "3",
    title: "Respond to guest inquiry about early check-in",
    description: "Guest arriving tomorrow, asking about 1pm check-in",
    priority: "high",
    status: "todo",
    dueDate: new Date(),
    createdAt: new Date(new Date().setHours(new Date().getHours() - 5)),
    assignee: "John Doe"
  }
];

const TasksToday = () => {
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Today's Tasks</h1>
            <p className="text-muted-foreground">Tasks due today that need your attention</p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No tasks due today</p>
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

export default TasksToday;
