
import { Brain, TrendingUp, Clock, MessageCircle, Star, AlertTriangle, Globe, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AIInsight, ConversationThread } from "@/types/inbox";

interface AIInsightsPanelProps {
  thread: ConversationThread;
  onApplySuggestion: (suggestion: string) => void;
}

export function AIInsightsPanel({ thread, onApplySuggestion }: AIInsightsPanelProps) {
  const latestMessage = thread.messages[thread.messages.length - 1];
  const insights = latestMessage?.aiInsights || [];

  const sentimentInsight = insights.find(i => i.type === 'sentiment');
  const urgencyInsight = insights.find(i => i.type === 'urgency');
  const languageInsight = insights.find(i => i.type === 'language');
  const suggestions = insights.filter(i => i.type === 'suggestion');

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-80 border-l border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-medium">AI Insights</h3>
      </div>

      {/* Guest Profile Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Star className="h-4 w-4" />
            Guest Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Stays:</span>
            <span className="font-medium">{thread.guest.totalStays}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Spent:</span>
            <span className="font-medium">${thread.guest.totalSpent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VIP Status:</span>
            <Badge variant={thread.guest.vipStatus === 'none' ? 'outline' : 'default'}>
              {thread.guest.vipStatus}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member Since:</span>
            <span className="font-medium">{thread.guest.memberSince}</span>
          </div>
        </CardContent>
      </Card>

      {/* Message Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Message Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sentimentInsight && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sentiment:</span>
              <Badge className={getSentimentColor(sentimentInsight.value)}>
                {sentimentInsight.value}
              </Badge>
            </div>
          )}
          
          {urgencyInsight && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Urgency:</span>
              <Badge className={getUrgencyColor(urgencyInsight.value)}>
                {urgencyInsight.value}
              </Badge>
            </div>
          )}
          
          {languageInsight && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Language:</span>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span className="text-sm font-medium">{languageInsight.value}</span>
              </div>
            </div>
          )}

          {thread.responseTime && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Response Time:</span>
                <span className="font-medium">{Math.round(thread.responseTime / 60)}m</span>
              </div>
              <Progress value={Math.min(100, (2 * 60 * 60) / thread.responseTime * 100)} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm mb-2">{suggestion.value}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Confidence: {Math.round(suggestion.confidence * 100)}%
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onApplySuggestion(suggestion.value)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thread.satisfactionScore && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Satisfaction:</span>
                <span className="font-medium">{Math.round(thread.satisfactionScore * 100)}%</span>
              </div>
              <Progress value={thread.satisfactionScore * 100} className="h-1" />
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Priority Level:</span>
              <Badge variant={thread.priority === 'urgent' ? 'destructive' : 'outline'}>
                {thread.priority}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
