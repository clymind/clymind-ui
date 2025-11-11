import React from "react";
import { formatNumber } from "../../lib/format";
import { useI18n } from "../../i18n";

export const InfoStrip = ({ expiryDays, lightFactor, dailyLightHours }: { expiryDays: number; lightFactor: number; dailyLightHours: number }) => {
  const { t } = useI18n();
  return (
    <div className="row g-3 mt-3">
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <span>{t("hoursPerDay")}</span>
            <span className="info-container" tabIndex={0} aria-label="info">
              <span className="info-icon" aria-hidden="true">i</span>
              <span role="tooltip" className="info-tooltip">{t("hoursPerDayHelp")}</span>
            </span>
          </div>
          <div className="fs-5 fw-semibold">{formatNumber(dailyLightHours)} h/day</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <span>{t("lightFactor")}</span>
            <span className="info-container" tabIndex={0} aria-label="info">
              <span className="info-icon" aria-hidden="false">i</span>
              <span role="tooltip" className="info-tooltip">{t("lightFactorHelp")}</span>
            </span>
          </div>
          <div className="fs-5 fw-semibold">{t("lightFactorFmt", { x: formatNumber(lightFactor) })}</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <span>{t("expiryLabel")}</span>
            <span className="info-container" tabIndex={0} aria-label="info">
              <span className="info-icon" aria-hidden="true">i</span>
              <span role="tooltip" className="info-tooltip">{t("expiryLabelHelp")}</span>
            </span>
          </div>
          <div className="fs-5 fw-semibold">{t("expiryAfter", { d: expiryDays })}</div>
        </div>
      </div>
    </div>
  );
};
