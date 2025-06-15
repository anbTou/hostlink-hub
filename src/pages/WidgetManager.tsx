
import { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WidgetConfig } from '@/types/widget';
import { WidgetConfig as WidgetConfigComponent } from '@/components/widget/WidgetConfig';

// Mock data
const defaultWidgetConfig: WidgetConfig = {
  id: '1',
  name: 'Main Website Widget',
  isActive: true,
  appearance: {
    theme: 'light',
    primaryColor: '#FF5C38',
    position: 'bottom-right',
    borderRadius: 12,
    showAvatar: true,
    companyName: 'Hostsy Support',
    welcomeMessage: 'Hi! How can we help you today?',
    offlineMessage: 'We\'re currently offline. Leave us a message!'
  },
  routing: {
    defaultInbox: 'general',
    routingRules: [],
    autoAssignment: true
  },
  whatsapp: {
    enabled: true,
    phoneNumber: '+1234567890',
    redirectToWhatsApp: false,
    prefilledMessage: 'Hi! I have a question about your property management services.',
    showWhatsAppOption: true
  },
  customButtons: [
    {
      id: '1',
      text: "I'm a guest",
      type: 'routing',
      target: 'guest-support',
      icon: '🏠',
      order: 0
    },
    {
      id: '2',
      text: 'Interested in management services',
      type: 'routing',
      target: 'homeowner-inbox',
      icon: '🔑',
      order: 1
    },
    {
      id: '3',
      text: 'Book direct',
      type: 'external',
      target: 'https://booking.hostsy.com',
      icon: '📅',
      order: 2
    },
    {
      id: '4',
      text: 'I have a question',
      type: 'routing',
      target: 'general-inquiry',
      icon: '❓',
      order: 3
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function WidgetManager() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([defaultWidgetConfig]);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleCreateWidget = () => {
    const newWidget: WidgetConfig = {
      ...defaultWidgetConfig,
      id: Date.now().toString(),
      name: 'New Widget',
      isActive: false,
      customButtons: []
    };
    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget);
    setIsEditing(true);
  };

  const handleEditWidget = (widget: WidgetConfig) => {
    setSelectedWidget(widget);
    setIsEditing(true);
  };

  const handleSaveWidget = () => {
    if (!selectedWidget) return;

    setWidgets(prev => prev.map(w => 
      w.id === selectedWidget.id 
        ? { ...selectedWidget, updatedAt: new Date().toISOString() }
        : w
    ));

    toast({
      title: "Widget saved",
      description: "Your widget configuration has been saved successfully."
    });

    setIsEditing(false);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Widget deleted",
      description: "The widget has been removed.",
      variant: "destructive"
    });
  };

  const generateEmbedCode = (widget: WidgetConfig) => {
    return `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.hostsy.com/widget.js';
    script.async = true;
    script.setAttribute('data-widget-id', '${widget.id}');
    document.head.appendChild(script);
  })();
</script>`;
  };

  if (isEditing && selectedWidget) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Edit Widget</h1>
              <p className="text-muted-foreground">Configure your communication widget</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Back to List
            </Button>
          </div>

          <WidgetConfigComponent
            config={selectedWidget}
            onConfigChange={setSelectedWidget}
            onSave={handleSaveWidget}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Communication Widgets</h1>
            <p className="text-muted-foreground">
              Manage your website communication widgets with smart routing and WhatsApp integration
            </p>
          </div>
          <Button onClick={handleCreateWidget} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Widget
          </Button>
        </div>

        <div className="grid gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {widget.name}
                      <Badge variant={widget.isActive ? 'default' : 'secondary'}>
                        {widget.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {widget.customButtons.length} custom buttons • 
                      WhatsApp {widget.whatsapp.enabled ? 'enabled' : 'disabled'} • 
                      Position: {widget.appearance.position}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWidget(widget)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWidget(widget.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Custom Buttons:</h4>
                    <div className="flex flex-wrap gap-2">
                      {widget.customButtons.map((button) => (
                        <Badge key={button.id} variant="outline" className="gap-1">
                          <span>{button.icon}</span>
                          {button.text}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Embed Code:</h4>
                    <div className="bg-muted p-3 rounded-lg text-sm font-mono relative">
                      <code>{generateEmbedCode(widget)}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(generateEmbedCode(widget));
                          toast({
                            title: "Copied!",
                            description: "Embed code copied to clipboard."
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      Test Widget
                    </Button>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {widgets.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">No widgets created yet</p>
                <Button onClick={handleCreateWidget} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Widget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
