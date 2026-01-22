/**
 * API Configuration
 * URLs for backend services, loaded from environment variables
 */
export const API_CONFIG = {
  DASHBOARD_URL: import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:8084',
  ALERTS_URL: import.meta.env.VITE_ALERTS_URL || 'http://localhost:8083',
};
