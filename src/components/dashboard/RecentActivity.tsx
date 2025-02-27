
import { ArrowUpRight, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "message" | "task" | "review";
  status?: "completed" | "pending";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex group">
          <div className="mr-4">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              activity.type === "message" ? "bg-primary/10 text-primary" :
              activity.type === "task" && activity.status === "completed" ? "bg-green-100 text-green-700" :
              activity.type === "task" ? "bg-yellow-100 text-yellow-700" :
              "bg-blue-100 text-blue-700"
            )}>
              {activity.type === "message" && <MessageSquare className="h-5 w-5" />}
              {activity.type === "task" && activity.status === "completed" && <CheckCircle className="h-5 w-5" />}
              {activity.type === "task" && activity.status !== "completed" && <Clock className="h-5 w-5" />}
              {activity.type === "review" && <ArrowUpRight className="h-5 w-5" />}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{activity.title}</h3>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
