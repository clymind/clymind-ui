import React from "react";
import { formatNumber } from "../../lib/format";
import { useI18n } from "../../i18n";

export const InfoStrip = ({ expiryDays, lightFactor, dailyLightHours }: { expiryDays: number; lightFactor: number; dailyLightHours: number }) => {
  const { t } = useI18n();
  return (
    <div className="row g-3 mt-3">
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="text-secondary small">{t("hoursPerDay")}</div>
          <div className="fs-5 fw-semibold">{formatNumber(dailyLightHours)} h/day</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="text-secondary small">{t("lightFactor")}</div>
          <div className="fs-5 fw-semibold">{t("lightFactorFmt", { x: formatNumber(lightFactor) })}</div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="surface-soft p-3 h-100">
          <div className="text-secondary small">{t("expiryLabel")}</div>
          <div className="fs-5 fw-semibold">{t("expiryAfter", { d: expiryDays })}</div>
        </div>
      </div>
    </div>
  );
};
