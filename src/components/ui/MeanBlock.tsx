/**
 * MeanBlock: Visual marker component for displaying the mean (average) in leaderboards
 *
 * This component renders a horizontal line with a label and value, visually separating
 * startups that are above/at the mean from those below it. The styling matches the
 * refresh button color (Bootstrap success) to create a unified design language.
 *
 * Layout:
 * - A horizontal line spanning the full width
 * - Below the line: "mean" label on the left, formatted value on the right
 * - Aligned with LeaderboardRow columns for consistency
 */

import React from "react";

/** Bootstrap success color used for the mean marker to match refresh button */
const MEAN_COLOR = "var(--bs-success)";

/**
 * MeanBlock: Renders a mean marker in leaderboards
 *
 * Displays a horizontal green line with "mean" label and the computed average value.
 * Positioned to visually separate startups above/at the mean from those below.
 *
 * @param value - Formatted string representation of the mean (e.g., "4.5 h")
 *
 * @example
 * <MeanBlock value="4.5 h" />
 * // Renders:
 * // ───────────────────────────────────
 * // mean                         4.5 h
 */
export const MeanBlock: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div
      className="my-2"
      style={{
        // Grid layout to align with LeaderboardRow:
        // [56px rank] | [flexible line] | [110px value]
        display: "grid",
        gridTemplateColumns: "56px 1fr 110px",
        alignItems: "center",
        width: `calc(100% - 2 * 13px)`, // Account for row padding
        rowGap: "5px",
        marginInline: "13px",
      }}
    >
      {/* Horizontal line spanning all columns */}
      <div
        style={{
          gridColumn: "1 / -1",
          borderTop: `2px solid ${MEAN_COLOR}`,
          width: "100%",
        }}
      />

      {/* Row below the line: "mean" label on left, value on right */}
      <div className="text-start fw-semibold" style={{ color: MEAN_COLOR }}>
        mean
      </div>
      {/* Middle column (empty) maintains alignment with the line above */}
      <div />
      <div className="text-end fw-semibold" style={{ color: MEAN_COLOR }}>
        {value}
      </div>
    </div>
  );
};
