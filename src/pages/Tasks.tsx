import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, PlusCircle, Search, Filter, SortAsc, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TaskItem } from "@/components/tasks/TaskItem";
import { Badge } from "@/components/ui/badge";
import { TaskFormDialog, TaskFormValues } from "@/components/tasks/TaskFormDialog";
import { useTasks } from "@/hooks/useTasks";

const Tasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  
  // Filter tasks based on search query and status filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                          (filter === "todo" && task.status === "todo") ||
                          (filter === "done" && task.status === "done");
    
    return matchesSearch && matchesFilter;
  });
  
  // Count tasks by status
  const todoCount = tasks.filter(task => task.status === "todo").length;
  const doneCount = tasks.filter(task => task.status === "done").length;

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

  const handleEditTask = async (data: TaskFormValues) => {
    if (!editingTask) return;
    
    await updateTask({
      id: editingTask.id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      type: data.type,
      dueDate: data.dueDate,
      assignedTo: data.assignedTo,
    });
    
    setEditingTask(null);
  };

  const handleOpenEditDialog = (task: any) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tasks</h1>
            <p className="text-muted-foreground">Manage and track all your property management tasks</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
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
              All Tasks <Badge variant="secondary" className="ml-2">{tasks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="todo" className="flex-1">
              To Do <Badge variant="secondary" className="ml-2">{todoCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="done" className="flex-1">
              Completed <Badge variant="secondary" className="ml-2">{doneCount}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  onEdit={() => handleOpenEditDialog(task)}
                  onDelete={() => deleteTask(task.id)}
                  onToggleStatus={() => toggleTaskStatus(task.id)}
                />
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
                  <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a New Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Tabs>

        <TaskFormDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description || "",
            priority: editingTask.priority,
            status: editingTask.status,
            type: editingTask.type || "other",
            dueDate: editingTask.due_date ? new Date(editingTask.due_date) : undefined,
            assignedTo: editingTask.assigned_to || "",
          } : undefined}
          mode={editingTask ? "edit" : "create"}
        />
      </div>
    </MainLayout>
  );
};

export default Tasks;