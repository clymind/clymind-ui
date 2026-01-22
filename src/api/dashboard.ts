/**
 * Dashboard API Service
 * Fetches dashboard data from ui-backend and maps to frontend format
 */
import { API_CONFIG } from './config';
import type { Startup } from '../types';

/** Backend response format */
interface BackendStartup {
  id: string;
  name: string;
  remainingLightSeconds: number;
  recentAccumulatedHours: number;
  totalAccumulatedHours: number;
}

interface BackendDashboardResponse {
  startups: BackendStartup[];
  lightFactor: number;
  packageExpiryDays: number;
  dailyConsumptionHours: number;
}

/** Frontend format */
export interface DashboardConfig {
  expiryDays: number;
  lightFactor: number;
  dailyLightHours: number;
}

export interface DashboardData {
  startups: Startup[];
  config: DashboardConfig;
}

/**
 * Fetch dashboard data from backend and map to frontend format
 */
export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_CONFIG.DASHBOARD_URL}/api/dashboard`);

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.status}`);
  }

  const data: BackendDashboardResponse = await response.json();

  // Map backend field names to frontend field names
  return {
    startups: data.startups.map((s) => ({
      id: s.id,
      name: s.name,
      remainingLightSeconds: s.remainingLightSeconds,
      lastNDaysLightHours: s.recentAccumulatedHours,
      totalLightHoursAbsolute: s.totalAccumulatedHours,
    })),
    config: {
      expiryDays: data.packageExpiryDays,
      lightFactor: data.lightFactor,
      dailyLightHours: data.dailyConsumptionHours,
    },
  };
}
