/**
 * Alerts API Service
 * Fetches alert data from light-manager service
 */
import { API_CONFIG } from './config';

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface AlertSummary {
  total: number;
  unresolved: number;
  alerts: Alert[];
}

/**
 * Fetch alert summary from backend
 */
export async function fetchAlertSummary(): Promise<AlertSummary> {
  const response = await fetch(`${API_CONFIG.ALERTS_URL}/api/alerts/summary`);

  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all alerts
 */
export async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_CONFIG.ALERTS_URL}/api/alerts`);

  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.status}`);
  }

  return response.json();
}
