
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Index";
import Inbox from "./pages/Inbox";
import InboxMain from "./pages/InboxMain";
import InboxPrivate from "./pages/InboxPrivate";
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
import WidgetManager from "./pages/WidgetManager";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => (
  <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/inbox/main" element={<ProtectedRoute><InboxMain /></ProtectedRoute>} />
          <Route path="/inbox/private" element={<ProtectedRoute><InboxPrivate /></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><Knowledge /></ProtectedRoute>} />
          <Route path="/property" element={<ProtectedRoute><PropertyInfo /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
          
          {/* Tasks routes */}
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/tasks/today" element={<ProtectedRoute><TasksToday /></ProtectedRoute>} />
          <Route path="/tasks/week" element={<ProtectedRoute><TasksWeek /></ProtectedRoute>} />
          <Route path="/tasks/later" element={<ProtectedRoute><TasksLater /></ProtectedRoute>} />
          <Route path="/tasks/all" element={<ProtectedRoute><TasksAll /></ProtectedRoute>} />
          
          {/* Notes route */}
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          
          {/* Widget management route */}
          <Route path="/widgets" element={<ProtectedRoute><WidgetManager /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </TooltipProvider>
);

export default App;
