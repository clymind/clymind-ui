/**
 * Home Page: Main dashboard for all startups
 *
 * Features:
 * 1. Info Strip: Displays global settings (expiryDays, lightFactor, dailyLightHours)
 * 2. Search & Filter: Find startups by name, filter by status (all/risk/inactive)
 * 3. Two tabs:
 *    - Remaining Light: Grid of startup cards with live countdown timers
 *    - Leaderboards: Rankings with toggle between "Last N days" and "Overall"
 *
 * State Management:
 * - query: Search string for name filtering
 * - activeTab: 0 (grid) or 1 (leaderboards)
 * - leaderboardMode: "last" or "overall"
 * - filterMode: "all", "risk", or "inactive"
 *
 * The component uses custom hook useLeaderboardData for leaderboard logic,
 * dramatically reducing complexity from the previous 325+ line version.
 */

import React, { useMemo, useState } from "react";
import {
  PageShell,
  Container,
  InfoStrip,
  SearchBar,
  Tabs,
  StartupCard,
  LeaderboardView,
} from "../components";
import { SETTINGS, STARTUPS } from "../config/settings";
import type { FilterMode } from "../types";
import { useNavigate } from "react-router-dom";
import { useLeaderboardData } from "../hooks/useLeaderboardData";
import logo from "../assets/clymind-logo.png";
import { useI18n } from "../i18n";

/**
 * Home component: Main page of the application
 *
 * Render flow:
 * 1. PageShell: Header with logo and conditional Home button
 * 2. Container: Centered content wrapper
 * 3. Header section: Title and description
 * 4. InfoStrip: Global settings display
 * 5. Search/Filter bar + Tab navigation
 * 6. Content based on activeTab:
 *    - Tab 0: Grid of startup cards
 *    - Tab 1: Leaderboards with toggle and mean marker
 */
export default function Home() {
  const { t } = useI18n();
  // ===== STATE =====
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [leaderboardMode, setLeaderboardMode] = useState<"last" | "overall">("last");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const navigate = useNavigate();

  // ===== COMPUTED VALUES =====
  const q = query.trim().toLowerCase();

  /**
   * Filter function: determines if a startup passes the current filter
   * - "all": all startups pass
   * - "risk": startup has some light but <= dailyLightHours (at-risk)
   * - "inactive": startup has 0 light
   */
  const passesFilter = (s: any) => {
    if (filterMode === "inactive") return s.remainingLightSeconds <= 0;
    if (filterMode === "risk")
      return s.remainingLightSeconds > 0 && s.remainingLightSeconds <= 10 * 3600;
    return true;
  };

  /**
   * Filtered & sorted startup list for the grid view
   * Rules:
   * 1. Filter by name (prefix match with search query)
   * 2. Filter by status (all/risk/inactive)
   * 3. Sort alphabetically by name
   */
  const filteredAlphabetical = useMemo(() => {
    const byName = q ? STARTUPS.filter((s) => s.name.toLowerCase().startsWith(q)) : STARTUPS.slice();
    const byFilter = byName.filter(passesFilter);
    return byFilter.sort((a, b) => a.name.localeCompare(b.name));
  }, [q, filterMode]);

  // Threshold for "at-risk" warning (red pulse effect)
  const criticalSeconds = SETTINGS.dailyLightHours * 3600;

  // Map for O(1) startup lookups by ID (used for leaderboard zero-state detection)
  const byId = useMemo(() => {
    const map = new Map();
    STARTUPS.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  // ===== LEADERBOARD DATA =====
  /**
   * Leaderboard for "Last N days" metric
   * Uses custom hook for tie-aware ranking, filtering, and mean computation
   */
  const leaderboardLastN = useLeaderboardData(
    {
      data: STARTUPS,
      query,
      filterMode,
      passesFilter,
    },
    "lastNDaysWorkHours"
  );

  /**
   * Leaderboard for "Overall" metric
   * Uses same hook with different metric key
   */
  const leaderboardTotal = useLeaderboardData(
    {
      data: STARTUPS,
      query,
      filterMode,
      passesFilter,
    },
    "totalWorkHoursAbsolute"
  );

  // ===== RENDER =====
  return (
    <PageShell logoSrc={logo}>
      <Container className="py-4">
        {/* Header section */}
        <div className="text-center mb-2">
          <h1 className="display-6 fw-bold mt-2">{t("allStartupsTitle")}</h1>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "560px" }}>
            {t("allStartupsDesc")}
          </p>
        </div>

        {/* Global settings info strip */}
        <InfoStrip
          expiryDays={SETTINGS.expiryDays}
          lightFactor={SETTINGS.lightFactor}
          dailyLightHours={SETTINGS.dailyLightHours}
        />

        {/* Search, filter, and tab controls */}
  <div className="surface mt-3">
          <SearchBar
            query={query}
            onChange={setQuery}
            onRefresh={() => window.location.reload()}
            filterMode={filterMode}
            onFilterChange={setFilterMode}
          />
          <Tabs active={activeTab} onChange={(i) => setActiveTab(i as 0 | 1)} />
        </div>

        {/* Main content area: changes based on activeTab */}
        <div className="mt-4">
          {/* TAB 0: Startup cards grid */}
          {activeTab === 0 && (
            <div className="responsive-grid">
              {filteredAlphabetical.map((s) => (
                <div className="grid-item" key={s.id}>
                  <StartupCard
                    name={s.name}
                    remainingLightSeconds={s.remainingLightSeconds}
                    criticalSeconds={criticalSeconds}
                    onClick={() => navigate(`/startup/${s.id}`)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 1: Leaderboards with toggle and mean marker */}
          {activeTab === 1 && (
            <LeaderboardView
              mode={leaderboardMode}
              onModeChange={setLeaderboardMode}
              // Show the appropriate leaderboard based on selected mode
              rows={leaderboardMode === "last" ? leaderboardLastN.viewRows : leaderboardTotal.viewRows}
              mean={leaderboardMode === "last" ? leaderboardLastN.mean : leaderboardTotal.mean}
              meanInsertPos={
                leaderboardMode === "last"
                  ? leaderboardLastN.meanInsertPos
                  : leaderboardTotal.meanInsertPos
              }
              startupsById={byId}
              metricKey={leaderboardMode === "last" ? "lastNDaysWorkHours" : "totalWorkHoursAbsolute"}
              onRowClick={(id) => navigate(`/startup/${id}`)}
            />
          )}
        </div>
      </Container>
    </PageShell>
  );
}
