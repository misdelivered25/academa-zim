import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  reducedMotion: boolean;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  defaultTab: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  lastVisitedPage: string;
  preferredUniversity: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  fontSize: "medium",
  reducedMotion: false,
  compactMode: false,
  sidebarCollapsed: false,
  defaultTab: "overview",
  notificationsEnabled: true,
  soundEnabled: true,
  lastVisitedPage: "/",
  preferredUniversity: "",
};

const COOKIE_NAME = "zimuni_user_prefs";
const COOKIE_EXPIRY = 365; // days

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from cookies/localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        // Try cookies first
        const cookieData = Cookies.get(COOKIE_NAME);
        if (cookieData) {
          const parsed = JSON.parse(cookieData);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
          setIsLoaded(true);
          return;
        }

        // Fall back to localStorage
        const localData = localStorage.getItem(COOKIE_NAME);
        if (localData) {
          const parsed = JSON.parse(localData);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
      } catch (error) {
        console.warn("Failed to load user preferences:", error);
      }
      setIsLoaded(true);
    };

    loadPreferences();
  }, []);

  // Apply preferences to DOM
  useEffect(() => {
    if (!isLoaded) return;

    // Apply theme
    const root = document.documentElement;
    
    if (preferences.theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", preferences.theme === "dark");
    }

    // Apply font size
    const fontSizes = { small: "14px", medium: "16px", large: "18px" };
    root.style.fontSize = fontSizes[preferences.fontSize];

    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Apply compact mode
    if (preferences.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }
  }, [preferences, isLoaded]);

  // Save preferences to both cookies and localStorage
  const savePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      
      try {
        const jsonData = JSON.stringify(updated);
        
        // Save to cookies (for server-side access if needed)
        Cookies.set(COOKIE_NAME, jsonData, { 
          expires: COOKIE_EXPIRY,
          sameSite: "lax",
          secure: window.location.protocol === "https:"
        });
        
        // Save to localStorage as backup
        localStorage.setItem(COOKIE_NAME, jsonData);
      } catch (error) {
        console.warn("Failed to save user preferences:", error);
      }
      
      return updated;
    });
  }, []);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    Cookies.remove(COOKIE_NAME);
    localStorage.removeItem(COOKIE_NAME);
  }, []);

  // Track page visits
  const trackPageVisit = useCallback((page: string) => {
    savePreferences({ lastVisitedPage: page });
  }, [savePreferences]);

  return {
    preferences,
    isLoaded,
    savePreferences,
    resetPreferences,
    trackPageVisit,
  };
};

export default useUserPreferences;
