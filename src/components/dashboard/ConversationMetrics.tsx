
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Mon", conversations: 4, resolved: 3 },
  { name: "Tue", conversations: 6, resolved: 4 },
  { name: "Wed", conversations: 8, resolved: 7 },
  { name: "Thu", conversations: 10, resolved: 8 },
  { name: "Fri", conversations: 7, resolved: 6 },
  { name: "Sat", conversations: 5, resolved: 4 },
  { name: "Sun", conversations: 3, resolved: 3 },
];

export function ConversationMetrics() {
  return (
    <Card className="w-full hover-card-effect">
      <CardHeader>
        <CardTitle>Conversation Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="hsl(var(--accent-foreground))"
                fill="hsl(var(--accent))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
