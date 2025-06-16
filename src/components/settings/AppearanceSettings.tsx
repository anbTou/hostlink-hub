
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [colorScheme, setColorScheme] = useState("blue");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);
  const [fontSize, setFontSize] = useState([16]);
  const [animationEffects, setAnimationEffects] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const handleSave = () => {
    toast({
      title: "Appearance settings saved",
      description: "Your appearance preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Appearance Settings
        </CardTitle>
        <CardDescription>
          Customize the look and feel of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Theme</h4>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select value={colorScheme} onValueChange={setColorScheme}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium mb-4">Layout Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sidebar Collapsed by Default</Label>
              <Switch checked={sidebarCollapsed} onCheckedChange={setSidebarCollapsed} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Compact View</Label>
              <Switch checked={compactView} onCheckedChange={setCompactView} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Tooltips</Label>
              <Switch checked={showTooltips} onCheckedChange={setShowTooltips} />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Display Settings</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={2}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Animation Effects</Label>
              <Switch checked={animationEffects} onCheckedChange={setAnimationEffects} />
            </div>

            <div className="flex items-center justify-between">
              <Label>High Contrast Mode</Label>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save appearance settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
