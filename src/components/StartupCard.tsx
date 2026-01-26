/**
 * StartupCard: Individual startup card component with live countdown timer
 *
 * Features:
 * - Large, responsive display of startup name and remaining light hours
 * - Live countdown timer (updates every second): HH:MM:SS format
 * - Zero-state styling (red background) when light hours = 0
 * - Critical state styling (pulse + red border) when at-risk (within 1 day)
 * - Responsive font sizing based on name length
 * - Clickable card for navigation to detail page
 *
 * Visual states:
 * - Normal: Dark background with light text and timer
 * - At-risk: Red border with pulse animation (within critical threshold)
 * - Zero: Red-tinted background with red text
 *
 * The timer synchronizes automatically when remainingLightSeconds prop changes,
 * ensuring the card stays in sync with backend updates.
 */

import React, { useEffect, useState } from "react";

/**
 * Dynamically adjust font size based on startup name length
 * Longer names get smaller font to prevent text overflow
 *
 * @param text - Startup name
 * @returns Font size in pixels
 * @example
 * getFontSize("AI Corp") // 26px (short name)
 * getFontSize("Very Long Company Name Here") // 16px (long name)
 */
const getFontSize = (text: string) => {
  if (text.length < 20) return 26;  // Short names: larger text
  if (text.length < 30) return 20;  // Medium names: medium text
  return 16;  // Long names: smaller text to fit
};

/**
 * StartupCard component: Displays a startup with live countdown
 *
 * @param name - Startup name to display
 * @param remainingLightSeconds - Initial remaining light hours (in seconds)
 * @param criticalSeconds - Threshold for "at-risk" state (typically 1 day in seconds)
 * @param onClick - Callback when card is clicked (typically navigate to detail page)
 *
 * @example
 * <StartupCard
 *   name="Aether Labs"
 *   remainingLightSeconds={8 * 3600}  // 8 hours
 *   criticalSeconds={10 * 3600}        // 10 hours = critical threshold
 *   onClick={() => navigate("/startup/1")}
 * />
 */
export const StartupCard = ({
  name,
  remainingLightSeconds,
  criticalSeconds,
  onClick,
  inConsumptionWindow = false,
}: {
  name: string;
  remainingLightSeconds: number;
  criticalSeconds: number;
  onClick?: () => void;
  inConsumptionWindow?: boolean;
}) => {
  // State for the live countdown timer
  const [seconds, setSeconds] = useState(remainingLightSeconds);

  // Always sync with backend value
  useEffect(() => {
    setSeconds(remainingLightSeconds);
  }, [remainingLightSeconds]);

  // Decrement locally for visual smoothness (only when in consumption window)
  useEffect(() => {
    if (!inConsumptionWindow) return;

    const t = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [inConsumptionWindow]);

  // Determine state based on remaining seconds
  const isZero = seconds <= 0;  // Inactive: no light remaining
  const critical = !isZero && seconds <= criticalSeconds;  // At-risk: below threshold

  // Convert seconds to HH:MM:SS format for display
  const h = Math.floor(seconds / 3600);  // Hours
  const m = Math.floor((seconds % 3600) / 60);  // Minutes
  const s = seconds % 60;  // Seconds

  return (
    <button
      className={`w-100 text-center p-4 startup-card ${
        isZero ? "zero border-danger" : ""  // Zero-state styling (no surface wrapper)
      } ${critical ? "pulse border-danger" : ""}`}  // Critical/at-risk styling with pulse animation
      onClick={onClick}
    >
      {/* Startup name with responsive font size */}
      <div
        className="fw-bold text-center"
        style={{ fontSize: `${getFontSize(name)}px` }}
      >
        {name}
      </div>

      {/* Timer display: HH MM SS or 0 0 0 when inactive */}
      <div className="d-flex align-items-end justify-content-center gap-1 flex-wrap mt-2 timer-nowrap">
        {isZero ? (
          // Zero state: display 0 0 0
          <>
            <div className="d-inline-flex align-items-baseline gap-0">
              <span className="display-6 fw-bold lh-1">0</span>
              <span className="small opacity-75">h</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-6 fw-bold lh-1">0</span>
              <span className="small opacity-75">m</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-6 fw-bold lh-1">0</span>
              <span className="small opacity-75">s</span>
            </div>
          </>
        ) : (
          // Normal state: display actual countdown
          <>
            <div className="d-inline-flex align-items-baseline gap-0">
              <span className="display-5 fw-bold lh-1">{h}</span>
              <span className="small opacity-75">h</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-5 fw-bold lh-1">{m}</span>
              <span className="small opacity-75">m</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-5 fw-bold lh-1">{s}</span>
              <span className="small opacity-75">s</span>
            </div>
          </>
        )}
      </div>
    </button>
  );
};
