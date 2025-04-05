
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PlusCircle, Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Badge } from "@/components/ui/badge";

// Combine all sample tasks
const allTasks = [
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
    id: "2",
    title: "Schedule pool cleaning service",
    description: "Regular maintenance",
    priority: "medium",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    assignee: "Jane Smith"
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
  },
  {
    id: "4",
    title: "Order new towels for all units",
    description: "Current inventory is getting worn",
    priority: "low",
    status: "done",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    assignee: "Jane Smith"
  },
  {
    id: "5",
    title: "Update house manual with new WiFi password",
    description: "Password was changed last week",
    priority: "medium",
    status: "done",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    assignee: "John Doe"
  },
  {
    id: "7",
    title: "Research new property management software",
    description: "Evaluate alternatives to current system",
    priority: "low",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    assignee: "Jane Smith"
  },
  {
    id: "8",
    title: "Plan renovations for Unit 5",
    description: "Create budget and timeline for bathroom updates",
    priority: "medium",
    status: "todo",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    assignee: "John Doe"
  }
];

const TasksAll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter tasks based on search query and status filter
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                          (filter === "todo" && task.status === "todo") ||
                          (filter === "done" && task.status === "done");
    
    return matchesSearch && matchesFilter;
  });
  
  // Count tasks by status
  const todoCount = allTasks.filter(task => task.status === "todo").length;
  const doneCount = allTasks.filter(task => task.status === "done").length;
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Tasks</h1>
            <p className="text-muted-foreground">View and manage all your tasks</p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="all" className="flex-1">
              All Tasks <Badge variant="secondary" className="ml-2">{allTasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="todo" className="flex-1">
              To Do <Badge variant="secondary" className="ml-2">{todoCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="done" className="flex-1">
              Completed <Badge variant="secondary" className="ml-2">{doneCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <CheckCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No tasks found</p>
                  {searchQuery && (
                    <p className="text-muted-foreground text-center text-sm mt-1">
                      Try changing your search query
                    </p>
                  )}
                  <Button className="mt-4">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a New Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TasksAll;
