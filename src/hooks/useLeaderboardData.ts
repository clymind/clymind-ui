/**
 * Custom React hook to encapsulate leaderboard data logic.
 *
 * This hook handles the complex logic of:
 * - Generating full leaderboards (all startups, tie-aware ranked)
 * - Filtering leaderboards by search query and filter mode
 * - Computing the mean across the entire dataset
 * - Finding where the mean marker should be inserted in the filtered view
 *
 * By separating this logic into a custom hook, it becomes:
 * - Reusable across multiple leaderboard types (Last N days, Overall)
 * - Easier to test
 * - Easier to maintain and modify
 *
 * @param props - Configuration object with data, query, filterMode, and filter function
 * @param metricKey - Which metric to rank by ("lastNDaysLightHours" or "totalLightHoursAbsolute")
 * @returns Object containing fullRows, viewRows, mean, and meanInsertPos
 *
 * @example
 * const leaderboard = useLeaderboardData(
 *   {
 *     data: STARTUPS,
 *     query: searchQuery,
 *     filterMode: "all",
 *     passesFilter: (s) => s.remainingLightSeconds > 0
 *   },
 *   "lastNDaysLightHours"
 * );
 * // Returns: { fullRows: [...], viewRows: [...], mean: 4.5, meanInsertPos: 3 }
 */

import { useMemo } from "react";
import { Startup, FilterMode, LeaderboardRow } from "../types";
import {
  getLeaderboardRows,
  computeMean,
  findMeanInsertPosition,
} from "../lib/calculations";

/**
 * Props for useLeaderboardData hook
 */
interface UseLeaderboardDataProps {
  /** Array of all startups to rank */
  data: Startup[];
  /** Current search query (for filtering by name) */
  query: string;
  /** Current filter mode (all, risk, or inactive) */
  filterMode: FilterMode;
  /** Function to check if a startup passes the current filter */
  passesFilter: (s: Startup) => boolean;
}

/**
 * Return value from useLeaderboardData hook
 */
interface LeaderboardData {
  /** Leaderboard with all startups, sorted and ranked */
  fullRows: LeaderboardRow[];
  /** Leaderboard filtered by query and filterMode */
  viewRows: LeaderboardRow[];
  /** Mean value of the metric across the FULL dataset (not just filtered rows) */
  mean: number;
  /** Position where the mean marker should be inserted in viewRows */
  meanInsertPos: number;
}

/**
 * Hook that manages leaderboard state and calculations for a specific metric
 *
 * Key design decisions:
 * 1. Mean is computed on the FULL dataset, not the filtered view
 *    - This ensures the mean marker stays in a consistent position even when filtering
 *    - Provides a stable reference point for comparing different filter views
 *
 * 2. View rows are computed from full rows and then filtered
 *    - This avoids duplicate ranking logic
 *    - Ensures consistent rank numbers across views
 *
 * 3. Mean insertion position is computed based on the VIEW rows
 *    - The mean marker only appears in the displayed leaderboard
 *    - Position adapts when filtering changes
 *
 * @param props - Configuration (data, query, filterMode, passesFilter)
 * @param metricKey - The metric to rank by
 * @returns LeaderboardData with fullRows, viewRows, mean, and meanInsertPos
 */
export function useLeaderboardData(
  props: UseLeaderboardDataProps,
  metricKey: "lastNDaysLightHours" | "totalLightHoursAbsolute"
): LeaderboardData {
  const { data, query, filterMode, passesFilter } = props;
  const q = query.trim().toLowerCase();

  // Create a Map for O(1) startup lookups by ID
  const byId = useMemo(() => {
    const map = new Map<string, Startup>();
    data.forEach((s) => map.set(s.id, s));
    return map;
  }, [data]);

  // Generate the full leaderboard (all startups, no filtering)
  // This is memoized to avoid recomputation unless data or metric changes
  const fullRows = useMemo(() => {
    return getLeaderboardRows(data, metricKey);
  }, [data, metricKey]);

  // Filter the full leaderboard based on query and filterMode
  // A row passes if:
  // 1. The name matches the search query (starts with query string), AND
  // 2. The startup passes the current filter (passesFilter function)
  const viewRows = useMemo(() => {
    return fullRows.filter((row) => {
      const s = byId.get(row.id)!;
      const nameOk = !q || row.name.toLowerCase().startsWith(q);
      const filterOk = passesFilter(s);
      return nameOk && filterOk;
    });
  }, [fullRows, byId, q, filterMode, passesFilter]);

  // Compute mean on the FULL dataset (not the filtered view)
  // This ensures the mean reference point remains stable when filtering
  const mean = useMemo(() => {
    return computeMean(data, metricKey);
  }, [data, metricKey]);

  // Determine where to insert the mean marker in the filtered view
  // The marker goes after the last startup whose value >= mean
  const meanInsertPos = useMemo(() => {
    return findMeanInsertPosition(viewRows, byId, mean, metricKey);
  }, [viewRows, byId, mean, metricKey]);

  return {
    fullRows,
    viewRows,
    mean,
    meanInsertPos,
  };
}
