
import { useState } from 'react';
import { Save, Plus, Trash2, Palette, MessageSquare, Settings, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WidgetConfig, CustomButton } from '@/types/widget';
import { WidgetPreview } from './WidgetPreview';

interface WidgetConfigProps {
  config: WidgetConfig;
  onConfigChange: (config: WidgetConfig) => void;
  onSave: () => void;
}

export function WidgetConfig({ config, onConfigChange, onSave }: WidgetConfigProps) {
  const [newButton, setNewButton] = useState<Partial<CustomButton>>({
    text: '',
    type: 'routing',
    target: '',
    icon: '💬'
  });

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const updateAppearance = (updates: Partial<WidgetConfig['appearance']>) => {
    onConfigChange({
      ...config,
      appearance: { ...config.appearance, ...updates }
    });
  };

  const updateWhatsApp = (updates: Partial<WidgetConfig['whatsapp']>) => {
    onConfigChange({
      ...config,
      whatsapp: { ...config.whatsapp, ...updates }
    });
  };

  const addCustomButton = () => {
    if (!newButton.text || !newButton.target) return;

    const button: CustomButton = {
      id: Date.now().toString(),
      text: newButton.text,
      type: newButton.type || 'routing',
      target: newButton.target,
      icon: newButton.icon,
      order: config.customButtons.length
    };

    onConfigChange({
      ...config,
      customButtons: [...config.customButtons, button]
    });

    setNewButton({ text: '', type: 'routing', target: '', icon: '💬' });
  };

  const removeButton = (buttonId: string) => {
    onConfigChange({
      ...config,
      customButtons: config.customButtons.filter(b => b.id !== buttonId)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Widget Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appearance" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="buttons">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Buttons
                </TabsTrigger>
                <TabsTrigger value="whatsapp">
                  <Smartphone className="h-4 w-4 mr-1" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={config.appearance.companyName}
                      onChange={(e) => updateAppearance({ companyName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.appearance.primaryColor}
                      onChange={(e) => updateAppearance({ primaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={config.appearance.welcomeMessage}
                    onChange={(e) => updateAppearance({ welcomeMessage: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="position">Widget Position</Label>
                  <Select
                    value={config.appearance.position}
                    onValueChange={(value: any) => updateAppearance({ position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="buttons" className="space-y-4">
                <div className="space-y-3">
                  <Label>Custom Routing Buttons</Label>
                  
                  {config.customButtons.map((button, index) => (
                    <div key={button.id} className="flex items-center gap-2 p-3 border rounded-lg">
                      <span className="text-lg">{button.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{button.text}</p>
                        <p className="text-sm text-muted-foreground">{button.target}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeButton(button.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 space-y-3">
                    <Label>Add New Button</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Button text"
                        value={newButton.text}
                        onChange={(e) => setNewButton(prev => ({ ...prev, text: e.target.value }))}
                      />
                      <Input
                        placeholder="Target inbox/URL"
                        value={newButton.target}
                        onChange={(e) => setNewButton(prev => ({ ...prev, target: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Icon (emoji)"
                        value={newButton.icon}
                        onChange={(e) => setNewButton(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-20"
                      />
                      <Select
                        value={newButton.type}
                        onValueChange={(value: any) => setNewButton(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routing">Route to Inbox</SelectItem>
                          <SelectItem value="external">External Link</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addCustomButton} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whatsapp-enabled"
                    checked={config.whatsapp.enabled}
                    onCheckedChange={(checked) => updateWhatsApp({ enabled: checked })}
                  />
                  <Label htmlFor="whatsapp-enabled">Enable WhatsApp Integration</Label>
                </div>

                {config.whatsapp.enabled && (
                  <>
                    <div>
                      <Label htmlFor="phone">WhatsApp Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={config.whatsapp.phoneNumber}
                        onChange={(e) => updateWhatsApp({ phoneNumber: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="prefilled">Prefilled Message</Label>
                      <Textarea
                        id="prefilled"
                        placeholder="Hi! I have a question about..."
                        value={config.whatsapp.prefilledMessage}
                        onChange={(e) => updateWhatsApp({ prefilledMessage: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="redirect-whatsapp"
                        checked={config.whatsapp.redirectToWhatsApp}
                        onCheckedChange={(checked) => updateWhatsApp({ redirectToWhatsApp: checked })}
                      />
                      <Label htmlFor="redirect-whatsapp">Redirect to WhatsApp (vs. internal chat)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-whatsapp"
                        checked={config.whatsapp.showWhatsAppOption}
                        onCheckedChange={(checked) => updateWhatsApp({ showWhatsAppOption: checked })}
                      />
                      <Label htmlFor="show-whatsapp">Show WhatsApp option in widget</Label>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="general" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="widget-active"
                    checked={config.isActive}
                    onCheckedChange={(checked) => updateConfig({ isActive: checked })}
                  />
                  <Label htmlFor="widget-active">Widget Active</Label>
                </div>

                <div>
                  <Label htmlFor="widget-name">Widget Name</Label>
                  <Input
                    id="widget-name"
                    value={config.name}
                    onChange={(e) => updateConfig({ name: e.target.value })}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4">
              <Button onClick={onSave} className="w-full gap-2">
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <WidgetPreview config={config} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
