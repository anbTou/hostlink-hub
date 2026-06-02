import { Card, CardContent } from "@/components/ui/card";

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-muted animate-pulse ${className}`} />;
}

export function TabSkeleton() {
  return (
    <div className="space-y-5">
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <Bar className="h-4 w-40" />
          <Bar className="h-3 w-full" />
          <Bar className="h-3 w-5/6" />
          <Bar className="h-3 w-2/3" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Bar className="h-12" />
            <Bar className="h-12" />
            <Bar className="h-12" />
            <Bar className="h-12" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-3">
          <Bar className="h-4 w-32" />
          <div className="flex gap-2">
            <Bar className="h-7 w-20" />
            <Bar className="h-7 w-24" />
            <Bar className="h-7 w-16" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
