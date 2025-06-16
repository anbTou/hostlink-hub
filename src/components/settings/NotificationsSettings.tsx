
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export function NotificationsSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState("immediate");
  const [messageAlerts, setMessageAlerts] = useState("immediate");
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [syncAlerts, setSyncAlerts] = useState(false);
  const [notificationSound, setNotificationSound] = useState("default");

  const handleSave = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">General Notifications</h4>
            
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Push Notifications</Label>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Review Notifications</Label>
              <Switch checked={reviewNotifications} onCheckedChange={setReviewNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Maintenance Reminders</Label>
              <Switch checked={maintenanceReminders} onCheckedChange={setMaintenanceReminders} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Channel Manager Sync Alerts</Label>
              <Switch checked={syncAlerts} onCheckedChange={setSyncAlerts} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Alert Frequency</h4>
            
            <div className="space-y-2">
              <Label>New Booking Alerts</Label>
              <Select value={bookingAlerts} onValueChange={setBookingAlerts}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Guest Message Alerts</Label>
              <Select value={messageAlerts} onValueChange={setMessageAlerts}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notification Sound</Label>
              <Select value={notificationSound} onValueChange={setNotificationSound}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save notification settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
