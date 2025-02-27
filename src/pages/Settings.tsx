
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon,
  MessageSquare,
  Bell,
  User,
  Shield,
  Languages,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

const Settings = () => {
  const [aiAutopilotEnabled, setAiAutopilotEnabled] = useState(false);
  
  const handleSaveAISettings = () => {
    // In a real app, this would save to a database or local storage
    toast({
      title: "Settings saved",
      description: `AI Autopilot has been ${aiAutopilotEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your preferences and application settings
          </p>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">AI Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden md:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden md:inline">Language</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden md:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Autopilot
                </CardTitle>
                <CardDescription>
                  Control whether AI automatically responds to guest messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 bg-background p-4 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium flex items-center gap-2">
                      {aiAutopilotEnabled ? 
                        <ToggleRight className="h-5 w-5 text-primary" /> : 
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      }
                      AI Autopilot
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      AI Autopilot automatically responds to guest messages based on your property information. 
                      When enabled, the AI will handle routine inquiries using details from your Property Info section.
                    </p>
                  </div>
                  <Switch
                    checked={aiAutopilotEnabled}
                    onCheckedChange={setAiAutopilotEnabled}
                    aria-label="Toggle AI Autopilot"
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveAISettings}>
                    Save preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Notification settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Account settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your privacy preferences and data sharing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Privacy settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Appearance settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Settings</CardTitle>
                <CardDescription>
                  Choose your preferred language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Language settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced options for the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Advanced settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
