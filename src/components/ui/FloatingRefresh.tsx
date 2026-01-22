import React from "react";
import { useI18n } from "../../i18n";

/**
 * FloatingRefresh button: reloads page
 */
export const FloatingRefresh = () => {
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="btn btn-outline-success h-100 px-3"
      onClick={() => window.location.reload()}
      aria-label={t("refreshResults")}
      title={t("refresh")}
    >
      {t("refresh")}
    </button>
  );
};

