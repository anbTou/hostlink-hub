
import { Inbox, Users, Star, CheckCircle, Clock, MessageSquare, Flag, Calendar, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ConversationMetrics } from "@/components/dashboard/ConversationMetrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityTasks } from "@/components/dashboard/PriorityTasks";
import { QuickNotes } from "@/components/dashboard/QuickNotes";
import { TaskTimeframes } from "@/components/dashboard/TaskTimeframes";

const recentActivities = [
  {
    id: "1",
    title: "New message from Lisa Johnson",
    description: "Question about check-in process",
    time: "2 hours ago",
    type: "message" as const,
  },
  {
    id: "2",
    title: "Clean pool after storm",
    description: "Task created from guest message",
    time: "Yesterday",
    type: "task" as const,
    status: "pending" as const,
    priority: "high" as const,
  },
  {
    id: "3",
    title: "New review on Airbnb",
    description: "4.8/5 stars from Michael Thompson",
    time: "3 days ago",
    type: "review" as const,
  },
  {
    id: "4",
    title: "Replace towels in upstairs bathroom",
    description: "Task completed by cleaning staff",
    time: "1 week ago",
    type: "task" as const,
    status: "completed" as const,
  },
];

// Sample priority tasks
const priorityTasks = [
  {
    id: "1",
    title: "Fix broken air conditioning in Unit 3",
    priority: "high",
    dueDate: "Today",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: "pending",
  },
  {
    id: "2",
    title: "Respond to guest complaint about noise",
    priority: "high",
    dueDate: "Today",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: "pending",
  },
  {
    id: "3",
    title: "Schedule deep cleaning for Unit 5",
    priority: "medium",
    dueDate: "Tomorrow",
    createdAt: new Date(),
    status: "pending",
  }
];

// Sample notes
const quickNotes = [
  {
    id: "1",
    content: "Call plumber to check water pressure in Unit 2",
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
  },
  {
    id: "2",
    content: "Guest in Unit 4 requested extra blankets",
    timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
  }
];

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your property management.</p>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Conversations"
            value={24}
            description="Last 30 days"
            trend={{ value: 12, isPositive: true }}
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Guests"
            value={6}
            description="Currently staying"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Average Rating"
            value={4.8}
            description="Across all platforms"
            trend={{ value: 0.2, isPositive: true }}
            icon={<Star className="h-4 w-4" />}
          />
          <StatsCard
            title="Response Time"
            value="1.2h"
            description="Average time to respond"
            trend={{ value: 15, isPositive: false }}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover-card-effect">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Priority Tasks</CardTitle>
                <CardDescription>Tasks that need your immediate attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Task</span>
              </Button>
            </CardHeader>
            <CardContent>
              <PriorityTasks tasks={priorityTasks} />
            </CardContent>
          </Card>
          
          <Card className="hover-card-effect">
            <CardHeader>
              <CardTitle>Task Timeframes</CardTitle>
              <CardDescription>Tasks grouped by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskTimeframes />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="hover-card-effect">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Quick Notes</CardTitle>
                <CardDescription>Capture thoughts and convert to tasks</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <QuickNotes notes={quickNotes} />
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2 hover-card-effect">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your conversation metrics over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ConversationMetrics />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover-card-effect">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={recentActivities} />
            </CardContent>
          </Card>
          
          <Card className="hover-card-effect">
            <CardHeader>
              <CardTitle>AI Autopilot Status</CardTitle>
              <CardDescription>Current AI configuration and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mode</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Copilot
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Messages Handled</span>
                  <span>18/24 (75%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Knowledge Blocks</span>
                  <span>12 active</span>
                </div>
              </div>
              
              <Button className="w-full">Configure AI</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
