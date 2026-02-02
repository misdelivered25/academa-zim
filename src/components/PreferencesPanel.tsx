import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserPreferences, ColorTheme } from "@/hooks/useUserPreferences";
import { Settings, Monitor, Moon, Sun, Type, Zap, Layout, RotateCcw, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const COLOR_THEMES: { value: ColorTheme; label: string; color: string }[] = [
  { value: "purple", label: "Galaxy Purple", color: "hsl(270, 91%, 55%)" },
  { value: "blue", label: "Ocean Blue", color: "hsl(217, 91%, 55%)" },
  { value: "green", label: "Forest Green", color: "hsl(142, 76%, 42%)" },
  { value: "orange", label: "Sunset Orange", color: "hsl(25, 95%, 53%)" },
  { value: "rose", label: "Rose Pink", color: "hsl(346, 77%, 55%)" },
  { value: "cyan", label: "Teal Cyan", color: "hsl(186, 94%, 42%)" },
];

export const PreferencesPanel = () => {
  const { preferences, savePreferences, resetPreferences, isLoaded } = useUserPreferences();
  const { toast } = useToast();

  if (!isLoaded) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleReset = () => {
    resetPreferences();
    toast({
      title: "Preferences Reset",
      description: "All preferences have been reset to defaults.",
    });
  };

  return (
    <Card className="glass-card border-border/30">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Display Preferences
        </CardTitle>
        <CardDescription>
          Customize your experience. Preferences are saved automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Theme */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            {preferences.theme === "dark" ? <Moon className="h-4 w-4" /> : 
             preferences.theme === "light" ? <Sun className="h-4 w-4" /> :
             <Monitor className="h-4 w-4" />}
            Theme Mode
          </Label>
          <Select
            value={preferences.theme}
            onValueChange={(value: "light" | "dark" | "system") => 
              savePreferences({ theme: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Theme */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Palette className="h-4 w-4" />
            Color Theme
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.value}
                onClick={() => savePreferences({ colorTheme: theme.value })}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-300",
                  "hover:scale-105 hover:shadow-md",
                  preferences.colorTheme === theme.value
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-inner transition-transform duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.color}, ${theme.color.replace('55%', '65%')})`,
                    transform: preferences.colorTheme === theme.value ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {theme.label.split(' ')[0]}
                </span>
                {preferences.colorTheme === theme.value && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Type className="h-4 w-4" />
            Font Size
          </Label>
          <Select
            value={preferences.fontSize}
            onValueChange={(value: "small" | "medium" | "large") => 
              savePreferences({ fontSize: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <Zap className="h-4 w-4" />
              Reduced Motion
            </Label>
            <Switch
              checked={preferences.reducedMotion}
              onCheckedChange={(checked) => savePreferences({ reducedMotion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <Layout className="h-4 w-4" />
              Compact Mode
            </Label>
            <Switch
              checked={preferences.compactMode}
              onCheckedChange={(checked) => savePreferences({ compactMode: checked })}
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-full mt-4"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreferencesPanel;
