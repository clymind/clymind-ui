import React, { useEffect, useState } from "react";

export const StartupCard = ({
  name,
  remainingLightSeconds,
  criticalSeconds,
  onClick,
}: {
  name: string;
  remainingLightSeconds: number;
  criticalSeconds: number;
  onClick?: () => void;
}) => {
  const [seconds, setSeconds] = useState(remainingLightSeconds);
  useEffect(() => setSeconds(remainingLightSeconds), [remainingLightSeconds]);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const isZero = seconds <= 0;
  const critical = !isZero && seconds <= criticalSeconds;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <button
      className={`w-100 text-start p-4 startup-card ${
        isZero ? "zero border-danger" : "surface"
      } ${critical ? "pulse border-danger" : ""}`}
      onClick={onClick}
    >
      <div className="fs-3 fw-bold text-white">{name}</div>

  <div className="d-flex align-items-end gap-1 flex-wrap mt-2 text-white timer-nowrap">
        {/* Always show hours, minutes and seconds when not zero; display 0 for missing units */}
        {isZero ? (
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
          <>
            <div className="d-inline-flex align-items-baseline gap-0">
              <span className="display-6 fw-bold lh-1">{h}</span>
              <span className="small opacity-75">h</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-6 fw-bold lh-1">{m}</span>
              <span className="small opacity-75">m</span>
            </div>
            <div className="d-inline-flex align-items-baseline gap-0 ms-1">
              <span className="display-6 fw-bold lh-1">{s}</span>
              <span className="small opacity-75">s</span>
            </div>
          </>
        )}
      </div>
    </button>
  );
};
