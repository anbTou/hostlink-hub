
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

export function PrivacySettings() {
  const [analyticsSharing, setAnalyticsSharing] = useState(true);
  const [performanceMonitoring, setPerformanceMonitoring] = useState(true);
  const [dataRetention, setDataRetention] = useState("2years");
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [channelManagerSharing, setChannelManagerSharing] = useState(true);
  const [communicationLogging, setCommunicationLogging] = useState(true);

  const handleSave = () => {
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data export will be available for download shortly.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control your privacy preferences and data sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Data Sharing</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Share Usage Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve the platform by sharing anonymous usage data
                </p>
              </div>
              <Switch checked={analyticsSharing} onCheckedChange={setAnalyticsSharing} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Performance Monitoring</Label>
                <p className="text-sm text-muted-foreground">
                  Monitor app performance for better user experience
                </p>
              </div>
              <Switch checked={performanceMonitoring} onCheckedChange={setPerformanceMonitoring} />
            </div>

            <div className="space-y-2">
              <Label>Guest Data Retention Period</Label>
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4">Communication Privacy</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Allow Marketing Emails</Label>
              <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Share Data with Channel Managers</Label>
              <Switch checked={channelManagerSharing} onCheckedChange={setChannelManagerSharing} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Guest Communication Logging</Label>
              <Switch checked={communicationLogging} onCheckedChange={setCommunicationLogging} />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-4">Data Management</h4>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              Export Personal Data
            </Button>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save privacy settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
