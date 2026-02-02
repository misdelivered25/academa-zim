import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "default" | "sm" | "lg";
}

export const ThemeToggle = ({ className, size = "default" }: ThemeToggleProps) => {
  const { preferences, savePreferences, isLoaded } = useUserPreferences();

  const cycleTheme = () => {
    const themeOrder: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(preferences.theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    savePreferences({ theme: nextTheme });
  };

  const getThemeLabel = () => {
    switch (preferences.theme) {
      case "light": return "Light";
      case "dark": return "Dark";
      case "system": return "System";
    }
  };

  if (!isLoaded) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn(
        "relative overflow-hidden hover:bg-accent group",
        className
      )}
      title={`Theme: ${getThemeLabel()}`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-500 ease-spring",
            preferences.theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          )}
        />
        
        {/* Moon icon */}
        <Moon
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-500 ease-spring",
            preferences.theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : preferences.theme === "light"
                ? "-rotate-90 scale-0 opacity-0"
                : "rotate-90 scale-0 opacity-0"
          )}
        />
        
        {/* Monitor/System icon */}
        <Monitor
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-500 ease-spring",
            preferences.theme === "system"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
      
      {/* Animated ring effect on click */}
      <span className="absolute inset-0 rounded-md bg-primary/10 scale-0 group-active:scale-100 transition-transform duration-200" />
    </Button>
  );
};

export default ThemeToggle;
