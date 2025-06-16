
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export function AdvancedSettings() {
  const [syncFrequency, setSyncFrequency] = useState("realtime");
  const [offlineMode, setOfflineMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [errorReporting, setErrorReporting] = useState("detailed");
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleSave = () => {
    toast({
      title: "Advanced settings saved",
      description: "Your advanced configuration has been updated.",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache cleared",
      description: "Application cache has been successfully cleared.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Settings
        </CardTitle>
        <CardDescription>
          Configure advanced options for the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">System Integration</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Channel Manager Sync Frequency</Label>
              <Select value={syncFrequency} onValueChange={setSyncFrequency}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                  <SelectItem value="15min">Every 15 minutes</SelectItem>
                  <SelectItem value="30min">Every 30 minutes</SelectItem>
                  <SelectItem value="1hour">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Access Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-webhook-url.com"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4">Performance</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Cache Management</Label>
                <p className="text-sm text-muted-foreground">
                  Clear application cache to free up storage
                </p>
              </div>
              <Button variant="outline" onClick={handleClearCache}>
                Clear Cache
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Offline Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Allow limited functionality when offline
                </p>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4">Developer Options</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed logging for troubleshooting
                </p>
              </div>
              <Switch checked={debugMode} onCheckedChange={setDebugMode} />
            </div>

            <div className="space-y-2">
              <Label>Error Reporting Level</Label>
              <Select value={errorReporting} onValueChange={setErrorReporting}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="verbose">Verbose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save advanced settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
