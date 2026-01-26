/**
 * useDashboard Hook
 * Fetches and manages dashboard data from the backend
 * Caches data in localStorage to persist across page reloads and rate limits
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDashboard, refreshAndFetchDashboard, DashboardConfig } from '../api';
import type { Startup } from '../types';

const CACHE_KEY = 'dashboard_cache';

interface CachedData {
  startups: Startup[];
  config: DashboardConfig;
}

function loadCache(): CachedData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) { /* ignore */ }
  return null;
}

function saveCache(data: CachedData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

interface UseDashboardResult {
  startups: Startup[];
  config: DashboardConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;  // Quick refresh (just fetch)
  triggerRefresh: () => void;  // Full refresh (trigger backend + fetch)
}

/**
 * Hook to fetch dashboard data with auto-refresh
 * - On initial load: load from cache, then fetch
 * - On button click: use triggerRefresh for full refresh
 * - On auto-refresh: just fetch
 * - On error: keep existing data (don't lose state)
 * @param refreshInterval - Auto-refresh interval in ms (0 to disable)
 */
export function useDashboard(refreshInterval = 0): UseDashboardResult {
  const cached = useRef(loadCache());
  const [startups, setStartups] = useState<Startup[]>(cached.current?.startups ?? []);
  const [config, setConfig] = useState<DashboardConfig | null>(cached.current?.config ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  // Quick fetch - keeps existing data on error
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboard();
      setStartups(data.startups);
      setConfig(data.config);
      saveCache({ startups: data.startups, config: data.config });
    } catch (err) {
      // Keep existing data on error (rate limit, network error, etc.)
      console.warn('Failed to load data, keeping existing state:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Full refresh (trigger backend + fetch) - keeps existing data on error
  const fullRefresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await refreshAndFetchDashboard();
      setStartups(data.startups);
      setConfig(data.config);
      saveCache({ startups: data.startups, config: data.config });
    } catch (err) {
      // Keep existing data on error
      console.warn('Failed to refresh data, keeping existing state:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - just fetch (no backend trigger)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      loadData();
    }
  }, [loadData]);

  // Auto-refresh - just fetch (no backend trigger)
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, loadData]);

  return {
    startups,
    config,
    loading,
    error,
    refresh: loadData,
    triggerRefresh: fullRefresh,
  };
}
