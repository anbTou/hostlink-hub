
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Bell,
  User,
  Shield,
  Languages,
} from "lucide-react";

const Settings = () => {
  const [aiAnswerPreference, setAiAnswerPreference] = useState("automatic");
  
  const handleSaveAISettings = () => {
    // In a real app, this would save to a database or local storage
    toast({
      title: "Settings saved",
      description: "Your AI answer preferences have been updated.",
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
                  AI Answer Preferences
                </CardTitle>
                <CardDescription>
                  Control how the AI assistant interacts with your conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <RadioGroup 
                    value={aiAnswerPreference} 
                    onValueChange={setAiAnswerPreference}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-2 bg-background p-4 rounded-lg border">
                      <RadioGroupItem value="automatic" id="ai-automatic" className="mt-1" />
                      <div className="space-y-1.5">
                        <Label 
                          htmlFor="ai-automatic" 
                          className="font-medium flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-primary" />
                          Allow AI answers automatic mode
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          AI will automatically respond to guest messages based on your property information. You'll be notified of all responses.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 bg-background p-4 rounded-lg border">
                      <RadioGroupItem value="suggestions" id="ai-suggestions" className="mt-1" />
                      <div className="space-y-1.5">
                        <Label 
                          htmlFor="ai-suggestions" 
                          className="font-medium flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4 text-primary" />
                          Allow AI suggestions on chat
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          AI will suggest responses to guest messages, but you'll need to approve them before they're sent.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 bg-background p-4 rounded-lg border">
                      <RadioGroupItem value="disabled" id="ai-disabled" className="mt-1" />
                      <div className="space-y-1.5">
                        <Label 
                          htmlFor="ai-disabled" 
                          className="font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          Do not allow AI answers neither suggestions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          All AI assistance will be disabled. You'll respond to all guest messages manually.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
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
