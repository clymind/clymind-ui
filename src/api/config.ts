/**
 * API Configuration
 * URLs for backend services, loaded from environment variables
 */
export const API_CONFIG = {
  DASHBOARD_URL: import.meta.env.VITE_DASHBOARD_URL || '',
  ALERTS_URL: import.meta.env.VITE_ALERTS_URL || '',
};
