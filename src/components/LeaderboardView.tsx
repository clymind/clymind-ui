/**
 * LeaderboardView: Complete leaderboard visualization component
 *
 * Combines:
 * - Toggle buttons to switch between "Last N days" and "Overall" metrics
 * - Filtered leaderboard rows sorted by the selected metric
 * - Mean marker (green line) showing the average value
 *
 * The component is metric-agnostic: it receives pre-computed rows and mean,
 * making it reusable for different leaderboard types.
 *
 * Key features:
 * - Tie-aware ranking displayed in badges
 * - Zero-state styling for rows with 0 hours
 * - Mean marker positioned after the last row >= mean
 * - Keyboard accessible (role="button", tabIndex)
 * - Responsive layout adapts to screen size
 */

import React from "react";
import { LeaderboardRow, MeanBlock } from "../components";
import { formatHoursWithSuffix } from "../lib/format";
import { SETTINGS } from "../config/settings";
import { Startup, LeaderboardRow as LeaderboardRowType } from "../types";
import { useI18n } from "../i18n";

/**
 * Props for LeaderboardView component
 */
interface LeaderboardViewProps {
  /** Current leaderboard mode: "last" (N days) or "overall" (all-time) */
  mode: "last" | "overall";
  /** Callback to change leaderboard mode */
  onModeChange: (mode: "last" | "overall") => void;
  /** Rows to display (already filtered and ranked) */
  rows: LeaderboardRowType[];
  /** Mean value across the full dataset (not just filtered rows) */
  mean: number;
  /** Position where the mean marker should be inserted */
  meanInsertPos: number;
  /** Map of startup ID → Startup for zero-state detection */
  startupsById: Map<string, Startup>;
  /** Which metric is being displayed (for zero-state check) */
  metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute";
  /** Callback when a row is clicked (typically navigate to detail page) */
  onRowClick: (id: string) => void;
}

/**
 * LeaderboardView: Renders a complete leaderboard with toggle and mean marker
 *
 * Layout:
 * 1. Toggle buttons (Last N days / Overall) — centered with pill styling
 * 2. Leaderboard rows — sorted by metric, with zero-state styling where applicable
 * 3. Mean marker — positioned after the last row >= mean, green color matching refresh button
 *
 * @param props - Configuration and data
 *
 * @example
 * const leaderboard = useLeaderboardData({...}, "lastNDaysWorkHours");
 * <LeaderboardView
 *   mode="last"
 *   onModeChange={setMode}
 *   rows={leaderboard.viewRows}
 *   mean={leaderboard.mean}
 *   meanInsertPos={leaderboard.meanInsertPos}
 *   startupsById={byId}
 *   metricKey="lastNDaysWorkHours"
 *   onRowClick={(id) => navigate(`/startup/${id}`)}
 * />
 */
export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  mode,
  onModeChange,
  rows,
  mean,
  meanInsertPos,
  startupsById,
  metricKey,
  onRowClick,
}) => {
  const { t } = useI18n();
  // Build the rendered leaderboard by:
  // 1. Creating LeaderboardRow for each row (with zero-state detection)
  // 2. Inserting MeanBlock at the correct position
  const renderedRows: React.ReactNode[] = [];

  rows.forEach((row) => {
    const s = startupsById.get(row.id)!;
    // Check if this startup's metric value is zero
    const isZero = s[metricKey] <= 0;
    renderedRows.push(
      <LeaderboardRow
        key={row.id}
        rank={row.rank}
        name={row.name}
        value={row.value}
        isZero={isZero}
        onClick={() => onRowClick(row.id)}
      />
    );
  });

  // Insert the mean marker at the computed position
  renderedRows.splice(
    meanInsertPos,
    0,
    <MeanBlock
      key={`mean-${mode}`}
      value={formatHoursWithSuffix(mean * SETTINGS.lightFactor)}
    />
  );

  return (
    <>
      {/* Toggle buttons: Last N days / Overall */}
      <div className="text-center mb-3">
        <div className="d-flex justify-content-center">
          <div className="btn-group leaderboard-toggle" role="group" aria-label={t("leaderboardMode")}>
            {/* Last N days button */}
            <button
              type="button"
              className={`btn ${
                mode === "last" ? "btn-success" : "btn-outline-light"
              } rounded-pill px-4 py-2 me-3`}
              onClick={() => onModeChange("last")}
              style={{ minWidth: 160 }}
            >
              {t("lastNDays", { d: SETTINGS.expiryDays })}
            </button>
            {/* Overall button */}
            <button
              type="button"
              className={`btn ${
                mode === "overall" ? "btn-success" : "btn-outline-light"
              } rounded-pill px-4 py-2`}
              onClick={() => onModeChange("overall")}
              style={{ minWidth: 120 }}
            >
              {t("overall")}
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard rows with mean marker */}
      <div className="d-flex flex-column gap-2">{renderedRows}</div>
    </>
  );
};
