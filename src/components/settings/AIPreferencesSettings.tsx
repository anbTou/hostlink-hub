
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, ToggleRight, ToggleLeft } from "lucide-react";

export function AIPreferencesSettings() {
  const [aiAutopilotEnabled, setAiAutopilotEnabled] = useState(false);
  const [aiResponseTone, setAiResponseTone] = useState("professional");
  const [aiLanguage, setAiLanguage] = useState("en");
  const [autoResponseDelay, setAutoResponseDelay] = useState([5]);
  const [aiLearningEnabled, setAiLearningEnabled] = useState(true);

  const handleSaveAISettings = () => {
    toast({
      title: "AI Settings saved",
      description: "Your AI preferences have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          AI Preferences
        </CardTitle>
        <CardDescription>
          Configure how AI assists with your guest communications
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
            </p>
          </div>
          <Switch
            checked={aiAutopilotEnabled}
            onCheckedChange={setAiAutopilotEnabled}
            aria-label="Toggle AI Autopilot"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-tone">AI Response Tone</Label>
            <Select value={aiResponseTone} onValueChange={setAiResponseTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-language">AI Language</Label>
            <Select value={aiLanguage} onValueChange={setAiLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Auto-response Delay: {autoResponseDelay[0]} minutes</Label>
          <Slider
            value={autoResponseDelay}
            onValueChange={setAutoResponseDelay}
            max={30}
            min={0}
            step={1}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Delay before AI automatically responds to messages
          </p>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label className="text-base">AI Learning</Label>
            <p className="text-sm text-muted-foreground">
              Allow AI to learn from your corrections and improve responses
            </p>
          </div>
          <Switch
            checked={aiLearningEnabled}
            onCheckedChange={setAiLearningEnabled}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSaveAISettings}>
            Save AI preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
