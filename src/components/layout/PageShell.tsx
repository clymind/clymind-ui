/**
 * PageShell: Main page wrapper component with header
 *
 * Provides the consistent header/navigation structure for all pages.
 *
 * Features:
 * - Sticky header that remains visible while scrolling
 * - Centered logo + brand name
 * - Conditional Home button (hidden on home page, visible on detail pages)
 * - Dark theme with light text
 * - Responsive layout
 *
 * The Home button is automatically hidden when location.pathname === "/"
 * to avoid redundant navigation on the home page itself.
 *
 * @param children - Content to render below the header
 * @param logoSrc - Optional path to logo image (displays green circle if not provided)
 */

import React from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../../i18n";
import { LANG_NAMES, Lang } from "../../i18n/translations";

export const PageShell = ({ children, logoSrc }: { children: React.ReactNode; logoSrc?: string }) => {
  const location = useLocation();
  const { t, lang, setLang } = useI18n();
  // Hide Home button on the home page itself
  const showHome = location.pathname !== "/";

  const changeLang = (l: Lang) => setLang(l);

  return (
    <div className="bg-dark text-light min-vh-100">
      {/* Sticky header with navigation */}
      <header className="sticky-top">
        <nav className="navbar navbar-dark bg-dark border-bottom border-secondary py-2">
          <div className="container d-flex justify-content-center position-relative">
            {/* Home button positioned on the left (hidden on home page) */}
            {showHome && (
              <div className="position-absolute start-0 ms-3">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={() => (window.location.href = "/")}
                  aria-label={t("home")}
                  title={t("home")}
                >
                  {t("home")}
                </button>
              </div>
            )}

            {/* Center: Logo and brand name */}
            <div className="d-flex align-items-center gap-2">
              {logoSrc ? (
                // Logo image if provided
                <img src={logoSrc} alt={t("logoAlt")} style={{ width: 36, height: 36, borderRadius: 8 }} />
              ) : (
                // Fallback: green circle
                <div className="bg-success rounded-3 d-inline-block" style={{ width: 36, height: 36 }} />
              )}
              <span className="navbar-brand mb-0 fs-5 fw-bold">ClyMind</span>
            </div>
            {/* Right-side controls: language dropdown (same design as filter) */}
            <div className="position-absolute end-0 me-3 d-flex align-items-center gap-2">
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label={t("langLabel")}
                  title={t("langLabel")}
                >
                  {t("langLabel")}
                </button>
                <ul className="dropdown-menu dropdown-menu-end filter-menu" role="menu" aria-label={t("langLabel")}
                >
                  {Object.entries(LANG_NAMES).map(([code, label]) => (
                    <li key={code}>
                      <button
                        role="menuitemradio"
                        aria-checked={lang === code}
                        className={`dropdown-item d-flex justify-content-between align-items-center ${lang === code ? "active" : ""}`}
                        onClick={() => changeLang(code as Lang)}
                      >
                        <span>{label}</span>
                        {/* Removed visual checkmark for active language per request */}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main page content below the header */}
      {children}
    </div>
  );
};

