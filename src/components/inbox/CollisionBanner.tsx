
import { AlertTriangle, User, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AssignmentStatus } from '@/types/assignment';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface CollisionBannerProps {
  assignmentStatus: AssignmentStatus;
  onTakeOver?: () => void;
  canTakeOver?: boolean;
}

export function CollisionBanner({ assignmentStatus, onTakeOver, canTakeOver = false }: CollisionBannerProps) {
  if (!assignmentStatus.isAssigned) {
    return null;
  }

  const timeAgo = assignmentStatus.assignedAt 
    ? formatDistanceToNow(parseISO(assignmentStatus.assignedAt), { addSuffix: true })
    : '';

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>
            Currently assigned to <Badge variant="secondary">{assignmentStatus.assignedTo}</Badge>
          </span>
          {timeAgo && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </div>
          )}
        </div>
        
        {canTakeOver && onTakeOver && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTakeOver}
            className="ml-4"
          >
            Take Over
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
