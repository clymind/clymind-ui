/**
 * LeaderboardRow: A single row in a leaderboard ranking
 *
 * Displays a startup's rank position (with badge colors for top 3),
 * name, and metric value. Supports zero-state styling and click navigation.
 *
 * Visual hierarchy:
 * - Rank badge (left): Color-coded by position or gray for 4+
 * - Startup name (center): Clickable for navigation
 * - Metric value (right): Hours formatted with appropriate decimals
 *
 * States:
 * - Normal: Light background with white text
 * - Zero: Red tint background and text (indicates 0 hours)
 * - Hover: Elevated background with slight upward transform
 */

import React from "react";

/**
 * LeaderboardRow component
 *
 * @param rank - Position in ranking (1, 2, 3, 4+)
 * @param name - Startup name to display
 * @param value - Formatted metric value (e.g., "7.5 h")
 * @param isZero - Optional: if true, apply zero-state styling (red background/text)
 * @param onClick - Optional: callback when row is clicked
 *
 * @example
 * <LeaderboardRow
 *   rank={1}
 *   name="Aether Labs"
 *   value="8 h"
 *   isZero={false}
 *   onClick={() => navigate("/startup/1")}
 * />
 */
export const LeaderboardRow = ({
  rank,
  name,
  value,
  onClick,
  isZero,
}: {
  rank: number;
  name: string;
  value: string;
  onClick?: () => void;
  isZero?: boolean;
}) => {
  // Background color for rank badge:
  // - Gold (#d4af37) for rank 1
  // - Silver (#c0c0c0) for rank 2
  // - Bronze (#cd7f32) for rank 3
  // - Light gray for rank 4+
  const bg = rank === 1 ? "#d4af37" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "rgba(255,255,255,0.10)";
  // Text color for rank badge: dark for metals (high contrast), light for others
  const color = rank <= 3 ? "#111" : "#ddd";
  // CSS classes: add .zero class if metric is zero (triggers zero-state styling in CSS)
  const rootClasses = `selectable-row d-flex justify-content-between align-items-center ${isZero ? 'zero' : ''}`;

  return (
    <div
      role="button"
      tabIndex={0}
      className={rootClasses}
      onClick={onClick}
      onKeyDown={(e) => {
        // Support keyboard navigation: Enter or Space to activate
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {/* Left side: rank badge + startup name */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-2 d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, background: bg, color }}
        >
          {rank}
        </div>
        <span className="fw-semibold text-light">{name}</span>
      </div>
      {/* Right side: metric value */}
      <span className="text-light">{value}</span>
    </div>
  );
};
