/**
 * Shared calculation utilities for leaderboard generation and ranking.
 *
 * This module centralizes the logic for:
 * - Sorting startups by metrics with tie-aware ranking
 * - Computing averages across datasets
 * - Finding positions for mean markers in filtered views
 *
 * This eliminates duplication between different leaderboard types (Last N days vs. Overall)
 * and makes the logic easily testable and reusable.
 */

import { Startup, LeaderboardRow } from "../types";
import { formatHoursWithSuffix } from "./format";

/**
 * getLeaderboardRows: Sorts startups by a given metric and computes tie-aware ranks
 *
 * Handles ties correctly: if two startups have the same metric value, they receive
 * the same rank, and the next rank accounts for the skipped positions.
 * Example: [100, 90, 90, 80] → ranks [1, 2, 2, 4]
 *
 * @param startups - Array of startups to rank
 * @param metricKey - The metric to sort by:
 *                   "lastNDaysWorkHours" - work hours in the last N days
 *                   "totalWorkHoursAbsolute" - all-time accumulated work hours
 * @returns Sorted array of leaderboard rows with tie-aware ranks and formatted values
 *
 * @example
 * const rows = getLeaderboardRows(STARTUPS, "lastNDaysWorkHours");
 * // returns: [
 * //   { rank: 1, id: "1", name: "Company A", value: "8 h" },
 * //   { rank: 2, id: "2", name: "Company B", value: "7.5 h" },
 * //   ...
 * // ]
 */
export function getLeaderboardRows(
  startups: Startup[],
  metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute",
  options?: { displayMultiplier?: number }
): LeaderboardRow[] {
  // Sort in descending order by the specified metric
  const sorted = [...startups].sort((a, b) => b[metricKey] - a[metricKey]);
  const rows: LeaderboardRow[] = [];
  let prevValue: number | null = null;
  let prevRank = 0;
  let itemsWithPrevRank = 0;
  const multiplier = options?.displayMultiplier ?? 1;

  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    const val = s[metricKey];
    let rank: number;

    if (prevValue === null) {
      // First item always gets rank 1
      rank = 1;
      itemsWithPrevRank = 1;
    } else if (val === prevValue) {
      // Same value as previous → same rank, increment count
      rank = prevRank;
      itemsWithPrevRank++;
    } else {
      // Different value → compute new rank accounting for skipped positions
      rank = prevRank + itemsWithPrevRank;
      itemsWithPrevRank = 1;
    }

    rows.push({
      rank,
      id: s.id,
      name: s.name,
      value: formatHoursWithSuffix(val * multiplier),
    });

    prevValue = val;
    prevRank = rank;
  }

  return rows;
}

/**
 * computeMean: Calculates the mean (average) of a specific metric across startups
 *
 * Always computed over the entire dataset (not filtered views) to ensure the mean
 * marker stays in a consistent position even when applying search/filter filters.
 * This provides a stable reference point for comparing filtered results.
 *
 * @param startups - Array of startups to average
 * @param metricKey - The metric to average:
 *                   "lastNDaysWorkHours" - average work hours in last N days
 *                   "totalWorkHoursAbsolute" - average all-time work hours
 * @returns Mean value; returns 0 if array is empty
 *
 * @example
 * const meanLastN = computeMean(STARTUPS, "lastNDaysWorkHours");
 * // returns: 4.25 (if sum of all lastNDaysWorkHours is 85 and there are 20 startups)
 */
export function computeMean(
  startups: Startup[],
  metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute"
): number {
  if (!startups.length) return 0;
  const sum = startups.reduce((acc, s) => acc + s[metricKey], 0);
  return sum / startups.length;
}

/**
 * findMeanInsertPosition: Determines where to insert the mean marker in a leaderboard view
 *
 * The mean line is inserted AFTER the last startup whose value is >= the mean.
 * This visually separates startups above/at the mean from those below it.
 *
 * If no startup reaches the mean (all below), the position is 0 (insert at top).
 * If all startups are above the mean, the position is at the end.
 *
 * @param leaderboardRows - The (possibly filtered) leaderboard rows being displayed
 * @param startupsById - Map of startup ID → Startup for metric lookup
 * @param mean - The mean value to compare against
 * @param metricKey - The metric being compared
 * @returns Index position where mean should be inserted (0-based)
 *
 * @example
 * // If rows are [100, 90, 80] and mean is 85:
 * // Returns 1 (insert after row 0, since 100 >= 85 but 90 < 85)
 * const pos = findMeanInsertPosition(rows, byId, 85, "lastNDaysWorkHours");
 */
export function findMeanInsertPosition(
  leaderboardRows: LeaderboardRow[],
  startupsById: Map<string, Startup>,
  mean: number,
  metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute"
): number {
  let boundaryIdx = -1;
  for (let i = 0; i < leaderboardRows.length; i++) {
    const s = startupsById.get(leaderboardRows[i].id)!;
    const val = s[metricKey];
    // Track the index of the last row whose value >= mean
    if (val >= mean) boundaryIdx = i;
  }
  // Return the index after the boundary (or 0 if no boundary found)
  return boundaryIdx >= 0 ? boundaryIdx + 1 : 0;
}
