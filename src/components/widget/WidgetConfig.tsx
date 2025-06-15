
import { useState } from 'react';
import { Save, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WidgetConfig as WidgetConfigType } from '@/types/widget';

interface WidgetConfigProps {
  config: WidgetConfigType;
  onConfigChange: (config: WidgetConfigType) => void;
  onSave: () => void;
}

export function WidgetConfig({ config, onConfigChange, onSave }: WidgetConfigProps) {
  const [activeTab, setActiveTab] = useState('appearance');

  const updateConfig = (updates: Partial<WidgetConfigType>) => {
    onConfigChange({ ...config, ...updates });
  };

  const updateAppearance = (updates: Partial<WidgetConfigType['appearance']>) => {
    updateConfig({
      appearance: { ...config.appearance, ...updates }
    });
  };

  const updateRouting = (updates: Partial<WidgetConfigType['routing']>) => {
    updateConfig({
      routing: { ...config.routing, ...updates }
    });
  };

  const updateWhatsApp = (updates: Partial<WidgetConfigType['whatsapp']>) => {
    updateConfig({
      whatsapp: { ...config.whatsapp, ...updates }
    });
  };

  const addCustomButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: 'New Button',
      type: 'routing' as const,
      target: 'general',
      order: config.customButtons.length
    };
    updateConfig({
      customButtons: [...config.customButtons, newButton]
    });
  };

  const updateCustomButton = (buttonId: string, updates: Partial<WidgetConfigType['customButtons'][0]>) => {
    updateConfig({
      customButtons: config.customButtons.map(button =>
        button.id === buttonId ? { ...button, ...updates } : button
      )
    });
  };

  const removeCustomButton = (buttonId: string) => {
    updateConfig({
      customButtons: config.customButtons.filter(button => button.id !== buttonId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Widget Configuration</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="buttons">Custom Buttons</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                />
              </div>

              <div>
                <Label htmlFor="position">Widget Position</Label>
                <Select value={config.appearance.position} onValueChange={(value: any) => updateAppearance({ position: value })}>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="showAvatar"
                  checked={config.appearance.showAvatar}
                  onCheckedChange={(checked) => updateAppearance({ showAvatar: checked })}
                />
                <Label htmlFor="showAvatar">Show Avatar</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Routing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="defaultInbox">Default Inbox</Label>
                <Input
                  id="defaultInbox"
                  value={config.routing.defaultInbox}
                  onChange={(e) => updateRouting({ defaultInbox: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoAssignment"
                  checked={config.routing.autoAssignment}
                  onCheckedChange={(checked) => updateRouting({ autoAssignment: checked })}
                />
                <Label htmlFor="autoAssignment">Auto Assignment</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="whatsappEnabled"
                  checked={config.whatsapp.enabled}
                  onCheckedChange={(checked) => updateWhatsApp({ enabled: checked })}
                />
                <Label htmlFor="whatsappEnabled">Enable WhatsApp</Label>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={config.whatsapp.phoneNumber}
                  onChange={(e) => updateWhatsApp({ phoneNumber: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <Label htmlFor="prefilledMessage">Prefilled Message</Label>
                <Textarea
                  id="prefilledMessage"
                  value={config.whatsapp.prefilledMessage}
                  onChange={(e) => updateWhatsApp({ prefilledMessage: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="redirectToWhatsApp"
                  checked={config.whatsapp.redirectToWhatsApp}
                  onCheckedChange={(checked) => updateWhatsApp({ redirectToWhatsApp: checked })}
                />
                <Label htmlFor="redirectToWhatsApp">Redirect to WhatsApp</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showWhatsAppOption"
                  checked={config.whatsapp.showWhatsAppOption}
                  onCheckedChange={(checked) => updateWhatsApp({ showWhatsAppOption: checked })}
                />
                <Label htmlFor="showWhatsAppOption">Show WhatsApp Option</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Custom Buttons
                <Button onClick={addCustomButton}>Add Button</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.customButtons.map((button) => (
                <div key={button.id} className="border rounded p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Button Text</Label>
                        <Input
                          value={button.text}
                          onChange={(e) => updateCustomButton(button.id, { text: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Target Inbox</Label>
                        <Input
                          value={button.target}
                          onChange={(e) => updateCustomButton(button.id, { target: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icon (emoji)</Label>
                        <Input
                          value={button.icon || ''}
                          onChange={(e) => updateCustomButton(button.id, { icon: e.target.value })}
                          placeholder="👤"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeCustomButton(button.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
