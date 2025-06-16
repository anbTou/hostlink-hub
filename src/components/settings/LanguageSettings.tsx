
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export function LanguageSettings() {
  const [interfaceLanguage, setInterfaceLanguage] = useState("en");
  const [communicationLanguage, setCommunicationLanguage] = useState("en");
  const [dateTimeByRegion, setDateTimeByRegion] = useState(true);
  const [currencyFormat, setCurrencyFormat] = useState("symbol");
  const [numberFormat, setNumberFormat] = useState("comma");
  const [rtlSupport, setRtlSupport] = useState(false);

  const handleSave = () => {
    toast({
      title: "Language settings saved",
      description: "Your language preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Language Settings
        </CardTitle>
        <CardDescription>
          Choose your preferred language and regional settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Interface Language</Label>
            <Select value={interfaceLanguage} onValueChange={setInterfaceLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                <SelectItem value="fr">🇫🇷 French</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
                <SelectItem value="it">🇮🇹 Italian</SelectItem>
                <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Guest Communication Language</Label>
            <Select value={communicationLanguage} onValueChange={setCommunicationLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                <SelectItem value="fr">🇫🇷 French</SelectItem>
                <SelectItem value="de">🇩🇪 German</SelectItem>
                <SelectItem value="it">🇮🇹 Italian</SelectItem>
                <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Date/Time Format by Region</Label>
              <p className="text-sm text-muted-foreground">
                Automatically format dates and times based on selected language
              </p>
            </div>
            <Switch checked={dateTimeByRegion} onCheckedChange={setDateTimeByRegion} />
          </div>

          <div className="space-y-2">
            <Label>Currency Display Format</Label>
            <Select value={currencyFormat} onValueChange={setCurrencyFormat}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="symbol">Symbol ($100)</SelectItem>
                <SelectItem value="code">Code (USD 100)</SelectItem>
                <SelectItem value="name">Name (100 Dollars)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number Format</Label>
            <Select value={numberFormat} onValueChange={setNumberFormat}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comma">Comma (1,000.50)</SelectItem>
                <SelectItem value="period">Period (1.000,50)</SelectItem>
                <SelectItem value="space">Space (1 000,50)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>RTL Text Support</Label>
              <p className="text-sm text-muted-foreground">
                Enable right-to-left text support for Arabic and Hebrew
              </p>
            </div>
            <Switch checked={rtlSupport} onCheckedChange={setRtlSupport} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save language settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
