
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon,
  MessageSquare,
  Bell,
  User,
  Shield,
  Languages,
} from "lucide-react";

// Import the new settings components
import { AIPreferencesSettings } from "@/components/settings/AIPreferencesSettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { AdvancedSettings } from "@/components/settings/AdvancedSettings";

const Settings = () => {
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
            <AIPreferencesSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <NotificationsSettings />
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-6">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 mt-6">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-6">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-6">
            <LanguageSettings />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-6">
            <AdvancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
