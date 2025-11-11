import React from "react";
import { useI18n } from "../../i18n";

/**
 * FloatingRefresh button: reloads page or triggers custom callback
 * Defaults to window.location.reload() if no onClick provided
 */
export const FloatingRefresh = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useI18n();
  return (
    <button
      type="button"
      className="btn btn-outline-success h-100 px-3"
      onClick={() => {
        try {
          (onClick || (() => window.location.reload()))();
        } catch (e) {
          /* ignore errors from caller */
        }
      }}
      aria-label={t("refreshResults")}
      title={t("refresh")}
    >
      {t("refresh")}
    </button>
  );
};

