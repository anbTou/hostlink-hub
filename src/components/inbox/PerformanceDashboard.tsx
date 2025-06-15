
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, MessageSquare, Star, Users, Target } from "lucide-react";

interface PerformanceDashboardProps {
  data: {
    responseTimeData: Array<{ date: string; avgTime: number; target: number }>;
    satisfactionData: Array<{ platform: string; score: number; count: number }>;
    volumeData: Array<{ date: string; messages: number; resolved: number }>;
    platformDistribution: Array<{ name: string; value: number; color: string }>;
    teamStats: Array<{ name: string; responseTime: number; satisfaction: number; volume: number }>;
  };
}

export function PerformanceDashboard({ data }: PerformanceDashboardProps) {
  const {
    responseTimeData,
    satisfactionData,
    volumeData,
    platformDistribution,
    teamStats
  } = data;

  const avgResponseTime = responseTimeData.reduce((acc, curr) => acc + curr.avgTime, 0) / responseTimeData.length;
  const avgSatisfaction = satisfactionData.reduce((acc, curr) => acc + curr.score, 0) / satisfactionData.length;
  const totalMessages = volumeData.reduce((acc, curr) => acc + curr.messages, 0);
  const totalResolved = volumeData.reduce((acc, curr) => acc + curr.resolved, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgResponseTime)}m</div>
            <p className="text-xs text-muted-foreground">
              Target: 30m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgSatisfaction * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalResolved / totalMessages) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalResolved} of {totalMessages} resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgTime" stroke="#8884d8" name="Avg Time (min)" />
                <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Message Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily Message Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#8884d8" name="Received" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Satisfaction by Platform */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Satisfaction by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Satisfaction']} />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamStats.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{member.responseTime}m</div>
                    <div className="text-muted-foreground">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{(member.satisfaction * 100).toFixed(0)}%</div>
                    <div className="text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{member.volume}</div>
                    <div className="text-muted-foreground">Messages</div>
                  </div>
                  <Badge variant={member.responseTime <= 30 ? "default" : "destructive"}>
                    {member.responseTime <= 30 ? "On Target" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
