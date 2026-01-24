import { useState, useEffect, useCallback } from 'react';

const CACHE_PREFIX = 'zimuni_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export function useOfflineCache<T>(key: string, fetcher: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const cacheKey = `${CACHE_PREFIX}${key}`;

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load from cache
  const loadFromCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is still valid
        if (now - entry.timestamp < entry.expiry) {
          return entry.data;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (e) {
      console.warn('Error reading from cache:', e);
    }
    return null;
  }, [cacheKey]);

  // Save to cache
  const saveToCache = useCallback((data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry: CACHE_EXPIRY,
      };
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (e) {
      console.warn('Error saving to cache:', e);
      // If localStorage is full, try to clear old entries
      clearExpiredCache();
    }
  }, [cacheKey]);

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (now - entry.timestamp >= entry.expiry) {
              keysToRemove.push(key);
            }
          }
        } catch {
          keysToRemove.push(key!);
        }
      }
    }

    keysToRemove.forEach(k => localStorage.removeItem(k));
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If offline, try to load from cache first
    if (isOffline) {
      const cachedData = loadFromCache();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
      setError(new Error('You are offline and no cached data is available'));
      setLoading(false);
      return;
    }

    try {
      const freshData = await fetcher();
      setData(freshData);
      saveToCache(freshData);
    } catch (e) {
      const cachedData = loadFromCache();
      if (cachedData) {
        setData(cachedData);
        console.log('Using cached data due to fetch error');
      } else {
        setError(e instanceof Error ? e : new Error('Failed to fetch data'));
      }
    } finally {
      setLoading(false);
    }
  }, [isOffline, fetcher, loadFromCache, saveToCache]);

  // Trigger fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    if (!isOffline) {
      await fetchData();
    }
  }, [isOffline, fetchData]);

  // Manual cache invalidation
  const invalidateCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    isOffline,
    refresh,
    invalidateCache,
  };
}

// Utility function to cache specific data manually
export function cacheData<T>(key: string, data: T, expiryMs: number = CACHE_EXPIRY) {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: expiryMs,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (e) {
    console.warn('Error caching data:', e);
  }
}

// Utility function to get cached data
export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      
      if (now - entry.timestamp < entry.expiry) {
        return entry.data;
      }
    }
  } catch (e) {
    console.warn('Error reading cached data:', e);
  }
  return null;
}

// Utility function to clear all app cache
export function clearAllCache() {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

export default useOfflineCache;
