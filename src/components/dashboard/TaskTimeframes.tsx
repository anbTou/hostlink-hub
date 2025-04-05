
import { useState } from "react";
import { Clock, Calendar, FileText, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const mockTasks = {
  today: [
    { id: "t1", title: "Call plumber", priority: "high" },
    { id: "t2", title: "Send invoice to guest", priority: "medium" },
  ],
  week: [
    { id: "w1", title: "Schedule cleaning service", priority: "medium" },
    { id: "w2", title: "Restock supplies", priority: "low" },
    { id: "w3", title: "Check HVAC in all units", priority: "medium" },
  ],
  later: [
    { id: "l1", title: "Plan garden renovation", priority: "low" },
    { id: "l2", title: "Research new software", priority: "low" },
  ],
};

export function TaskTimeframes() {
  const [activeTab, setActiveTab] = useState("today");
  
  // This would handle drag-and-drop functionality in a real app
  const handleDragEnd = (result: any) => {
    console.log("Task moved:", result);
  };

  return (
    <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="today" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Today</span>
          <Badge variant="secondary" className="ml-1">
            {mockTasks.today.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="week" className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Week</span>
          <Badge variant="secondary" className="ml-1">
            {mockTasks.week.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="later" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>Later</span>
          <Badge variant="secondary" className="ml-1">
            {mockTasks.later.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="today" className="mt-0">
        <div className="space-y-2">
          {mockTasks.today.map(task => (
            <div key={task.id} className="p-2 bg-white rounded-md border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                  className="w-1 h-4 p-0"
                />
                <span className="text-sm">{task.title}</span>
              </div>
              <CheckSquare className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="week" className="mt-0">
        <div className="space-y-2">
          {mockTasks.week.map(task => (
            <div key={task.id} className="p-2 bg-white rounded-md border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                  className="w-1 h-4 p-0"
                />
                <span className="text-sm">{task.title}</span>
              </div>
              <CheckSquare className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="later" className="mt-0">
        <div className="space-y-2">
          {mockTasks.later.map(task => (
            <div key={task.id} className="p-2 bg-white rounded-md border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                  className="w-1 h-4 p-0"
                />
                <span className="text-sm">{task.title}</span>
              </div>
              <CheckSquare className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
