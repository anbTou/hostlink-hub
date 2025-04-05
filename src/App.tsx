
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Index";
import Inbox from "./pages/Inbox";
import Knowledge from "./pages/Knowledge";
import PropertyInfo from "./pages/PropertyInfo";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks";
import TasksToday from "./pages/TasksToday";
import TasksWeek from "./pages/TasksWeek";
import TasksLater from "./pages/TasksLater";
import TasksAll from "./pages/TasksAll";
import Notes from "./pages/Notes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/property" element={<PropertyInfo />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Tasks routes */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/today" element={<TasksToday />} />
          <Route path="/tasks/week" element={<TasksWeek />} />
          <Route path="/tasks/later" element={<TasksLater />} />
          <Route path="/tasks/all" element={<TasksAll />} />
          
          {/* Notes route */}
          <Route path="/notes" element={<Notes />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
