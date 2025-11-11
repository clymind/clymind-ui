import React, { useRef, useEffect } from "react";
import { SETTINGS } from "../../config/settings";
import { FloatingRefresh } from "./FloatingRefresh";
import type { FilterMode } from "../../types";

export const SearchBar = ({
  query,
  onChange,
  onRefresh,
  filterMode,
  onFilterChange,
}: {
  query: string;
  onChange: (v: string) => void;
  onRefresh: () => void;
  filterMode: FilterMode;
  onFilterChange: (v: FilterMode) => void;
}) => {
  const dropdownMenuRef = useRef<HTMLUListElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dropdownMenuRef.current?.classList.contains("show")) {
        dropdownButtonRef.current?.click();
        dropdownButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
  <form
    className="mt-3"
    role="search"
    onSubmit={(e) => e.preventDefault()}
  >
    <div className="row g-2 align-items-stretch">
      <div className="col-auto">
        <FloatingRefresh onClick={onRefresh} />
      </div>
      <div className="col">
        <div className="input-group input-group-lg">
          <span
            className="input-group-text bg-dark text-secondary border-secondary"
            aria-hidden="true"
          >
            {/* Lente 2D piatta, stessa classe dell'icona filtro */}
            <svg
              viewBox="0 0 24 24"
              className="filter-icon"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M15.8 14.4h.6l5.2 5.2c.2.2.2.6 0 .8l-.8.8c-.2.2-.6.2-.8 0l-5.2-5.2v-.6l-.2-.2a7.9 7.9 0 1 1 1.2-1.2l.2.2ZM10.4 16a5.6 5.6 0 1 0 0-11.2 5.6 5.6 0 0 0 0 11.2Z" />
            </svg>
          </span>

          <label htmlFor="search-input" className="visually-hidden">
            Search startups
          </label>
          <input
            id="search-input"
            value={query}
            onChange={(e) => onChange(e.target.value)}
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search startups…"
            aria-label="Search startups"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="col-auto dropdown">
        <button
          ref={dropdownButtonRef}
          className="filter-btn"
          type="button"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          aria-label="Apri filtri"
          title="Filtri"
        >
          <svg
            className="filter-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 4h18v2H3V4zm4 7h10v2H7v-2zm3 7h4v2h-4v-2z" />
          </svg>
        </button>

        <ul
          ref={dropdownMenuRef}
          className="dropdown-menu dropdown-menu-end filter-menu"
          role="menu"
          aria-label="Opzioni filtro"
        >
          <li>
            <button
              role="menuitemradio"
              aria-checked={filterMode === "all"}
              className={`dropdown-item ${filterMode === "all" ? "active" : ""}`}
              onClick={() => onFilterChange("all")}
            >
              Show all startups
            </button>
          </li>
          <li>
            <button
              role="menuitemradio"
              aria-checked={filterMode === "risk"}
              className={`dropdown-item ${filterMode === "risk" ? "active" : ""}`}
              onClick={() => onFilterChange("risk")}
            >
              Show at-risk startups (0 - {SETTINGS.dailyLightHours}h)
            </button>
          </li>
          <li>
            <button
              role="menuitemradio"
              aria-checked={filterMode === "inactive"}
              className={`dropdown-item ${filterMode === "inactive" ? "active" : ""}`}
              onClick={() => onFilterChange("inactive")}
            >
              Show inactive (0h)
            </button>
          </li>
        </ul>
      </div>
    </div>
  </form>
  );
};
