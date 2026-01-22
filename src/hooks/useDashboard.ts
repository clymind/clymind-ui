/**
 * useDashboard Hook
 * Fetches and manages dashboard data from the backend
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchDashboard, DashboardData, DashboardConfig } from '../api';
import type { Startup } from '../types';

interface UseDashboardResult {
  startups: Startup[];
  config: DashboardConfig | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch dashboard data with auto-refresh
 * @param refreshInterval - Auto-refresh interval in ms (0 to disable)
 */
export function useDashboard(refreshInterval = 0): UseDashboardResult {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboard();
      setStartups(data.startups);
      setConfig(data.config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh
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
  };
}
