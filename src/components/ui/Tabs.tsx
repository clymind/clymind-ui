import React from "react";
import { SETTINGS } from "../../config/settings";

export const Tabs = ({ active, onChange }: { active: number; onChange: (i: number) => void }) => {
  const labels = ["Remaining light", `Leaderboard - last ${SETTINGS.expiryDays} days`, "Leaderboard - overall"];
  return (
    <div className="mt-3">
      <ul className="nav nav-pills bg-dark border border-secondary rounded-3 p-1">
        {labels.map((label, i) => (
          <li className="nav-item flex-fill text-center" key={label}>
            <button
              className={`nav-link w-100 ${active === i ? "active" : ""}`}
              onClick={() => onChange(i)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
