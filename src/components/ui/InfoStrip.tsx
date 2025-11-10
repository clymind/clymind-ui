import React from "react";

export const InfoStrip = ({ expiryDays, lightFactor, dailyLightHours }: { expiryDays: number; lightFactor: number; dailyLightHours: number }) => (
  <div className="row g-3 mt-3">
    <div className="col-12 col-md-4">
      <div className="surface-soft p-3 h-100">
        <div className="text-secondary small">Hours consumed per day</div>
        <div className="fs-5 fw-semibold">{dailyLightHours} h/day</div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className="surface-soft p-3 h-100">
        <div className="text-secondary small">Light factor</div>
        <div className="fs-5 fw-semibold">1h activity → {lightFactor}h light</div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className="surface-soft p-3 h-100">
        <div className="text-secondary small">Expiry of accumulated hours</div>
        <div className="fs-5 fw-semibold">After {expiryDays} days</div>
      </div>
    </div>
  </div>
);
