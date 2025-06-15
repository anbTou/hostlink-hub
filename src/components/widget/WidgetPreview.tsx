
import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WidgetConfig, WidgetPreviewState } from '@/types/widget';
import { CommunicationWidget } from './CommunicationWidget';
import { cn } from '@/lib/utils';

interface WidgetPreviewProps {
  config: WidgetConfig;
  onMessageSend?: (message: string, routingContext?: any) => void;
}

export function WidgetPreview({ config, onMessageSend }: WidgetPreviewProps) {
  const [previewState, setPreviewState] = useState<WidgetPreviewState>({
    view: 'desktop',
    state: 'closed'
  });

  const handleMessageSend = (message: string, routingContext?: any) => {
    console.log('Preview message:', message, routingContext);
    onMessageSend?.(message, routingContext);
  };

  return (
    <div className="space-y-4">
      {/* Preview Controls */}
      <div className="flex gap-2">
        <Button
          variant={previewState.view === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewState(prev => ({ ...prev, view: 'desktop' }))}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
        <Button
          variant={previewState.view === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPreviewState(prev => ({ ...prev, view: 'mobile' }))}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
      </div>

      {/* Preview Container */}
      <Card className="relative overflow-hidden">
        <div
          className={cn(
            "bg-gradient-to-br from-blue-50 to-indigo-100 relative",
            previewState.view === 'desktop' ? "h-96 w-full" : "h-[600px] w-80 mx-auto"
          )}
        >
          {/* Mockup Background */}
          <div className="absolute inset-4 bg-white/50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              {previewState.view === 'desktop' ? 'Desktop Website' : 'Mobile Website'}
              <br />
              <span className="text-sm">Widget preview</span>
            </p>
          </div>

          {/* Widget Component */}
          <CommunicationWidget
            config={config}
            onMessageSend={handleMessageSend}
            className="relative"
          />
        </div>
      </Card>

      {/* Preview Info */}
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Preview Mode:</strong> {previewState.view} • 
          <strong> Position:</strong> {config.appearance.position} • 
          <strong> Status:</strong> {config.isActive ? 'Active' : 'Inactive'}
        </p>
      </div>
    </div>
  );
}
