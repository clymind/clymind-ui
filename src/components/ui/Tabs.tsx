import React from "react";
import { SETTINGS } from "../../config/settings";
import { useI18n } from "../../i18n";

export const Tabs = ({ active, onChange }: { active: number; onChange: (i: number) => void }) => {
  const { t } = useI18n();
  const labels = [t("tabRemaining"), t("tabLeaderboards")];
  return (
    <div className="mt-3">
      <ul className="nav nav-pills tabs-wrapper nav-gap p-0 w-100">
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
