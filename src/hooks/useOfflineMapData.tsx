import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "campus_map_data_v1";
const CACHE_TIMESTAMP_KEY = "campus_map_cache_timestamp";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface Building {
  name: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
}

interface UniversityData {
  name: string;
  center: { lat: number; lng: number };
  buildings: Building[];
}

interface CachedData {
  universities: { [key: string]: UniversityData };
  lastUpdated: number;
}

export function useOfflineMapData() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState<CachedData | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load cached data on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp, 10);
        if (cacheAge < CACHE_DURATION) {
          setCachedData(JSON.parse(cached));
        }
      }
    } catch (error) {
      console.error("Error loading cached map data:", error);
    }
  }, []);

  // Cache data function
  const cacheMapData = useCallback((universities: { [key: string]: UniversityData }) => {
    try {
      const data: CachedData = {
        universities,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      setCachedData(data);
    } catch (error) {
      console.error("Error caching map data:", error);
    }
  }, []);

  // Get cache age in human-readable format
  const getCacheAge = useCallback(() => {
    if (!cachedData) return null;
    const age = Date.now() - cachedData.lastUpdated;
    const hours = Math.floor(age / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  }, [cachedData]);

  return {
    isOnline,
    cachedData,
    cacheMapData,
    getCacheAge,
    hasCachedData: !!cachedData,
  };
}
