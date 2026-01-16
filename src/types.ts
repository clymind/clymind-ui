/**
 * Centralized type definitions for the entire application.
 * This file serves as the single source of truth for shared types
 * used across components, hooks, and utilities.
 */

/**
 * FilterMode: Controls which startups are displayed in the card grid
 * - "all": Show all startups
 * - "risk": Show only startups with 0 to dailyLightHours remaining (at-risk)
 * - "inactive": Show only startups with 0 remaining light
 */
export type FilterMode = "all" | "risk" | "inactive";

/**
 * Startup: Represents a single startup with its current state and metrics
 * @property id - Unique identifier
 * @property name - Display name of the startup
 * @property remainingLightSeconds - Countdown timer in seconds for remaining light hours
 * @property lastNDaysLightHours - Light hours accumulated in the last N days (already multiplied by lightFactor)
 * @property totalLightHoursAbsolute - Total accumulated light hours across all time (already multiplied)
 */
export type Startup = {
  id: string;
  name: string;
  remainingLightSeconds: number;
  lastNDaysLightHours: number;
  totalLightHoursAbsolute: number;
};

/**
 * LeaderboardRow: A single row in a leaderboard ranking
 * @property rank - Position in ranking (handles ties via tie-aware ranking)
 * @property id - Reference to startup ID (for navigation)
 * @property name - Startup name (for display)
 * @property value - Formatted metric value (e.g., "7.5 h")
 */
export type LeaderboardRow = {
  rank: number;
  id: string;
  name: string;
  value: string;
};
