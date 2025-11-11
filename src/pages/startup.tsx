/**
 * Startup Detail Page: Individual startup profile and metrics
 *
 * Features:
 * 1. Live countdown timer: Remaining light hours in real-time
 * 2. Work hours display: Accumulated work hours over last N days
 * 3. Light hours conversion: Work hours multiplied by lightFactor
 * 4. Refresh button: Update data from the backend
 *
 * Layout:
 * - Title and description at the top
 * - Info strip with global settings
 * - Live remaining light countdown (top)
 * - Work hours → Light hours (middle)
 * - Refresh button at the bottom
 */

import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell, Container, FloatingRefresh, InfoStrip } from "../components";
import { formatNumber } from "../lib/format";
import { SETTINGS, STARTUPS } from "../config/settings";
import { getLeaderboardRows } from "../lib/calculations";
import type { Startup } from "../types";
import logo from "../assets/clymind-logo.png";
import { useI18n } from "../i18n";

export default function StartupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const initial = useMemo<Startup | undefined>(
    () => STARTUPS.find(s => s.id === id),
    [id]
  );

  const [state, setState] = useState<Startup | undefined>(initial);

  if (!state) {
    const { t } = useI18n();
    return (
      <PageShell logoSrc={logo}>
        <Container className="py-4 text-center">
          <h1 className="display-6 fw-bold mt-2">{t("startupNotFound")}</h1>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "560px" }}>
            {t("startupNotFoundDesc")}
          </p>
        </Container>
      </PageShell>
    );
  }

  // live countdown in seconds for the remaining light (keeps in sync with state.remainingLightSeconds)
  const [seconds, setSeconds] = useState<number>(Math.max(0, state.remainingLightSeconds));

  useEffect(() => setSeconds(Math.max(0, state.remainingLightSeconds)), [state?.remainingLightSeconds]);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const workLastN = state.lastNDaysWorkHours;
  const { expiryDays, lightFactor, dailyLightHours } = SETTINGS;
  const totalLightLastN = workLastN * lightFactor;

  // Calculate rankings for this startup by computing light hours on the fly
  const getRankingByLightHours = (metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute"): number => {
    // Create list of startups with their light hours
    const startupsByLight = STARTUPS.map(s => ({
      id: s.id,
      lightHours: s[metricKey] * lightFactor
    }));
    
    // Sort descending and compute tie-aware ranks
    const sorted = [...startupsByLight].sort((a, b) => b.lightHours - a.lightHours);
    
    let prevValue: number | null = null;
    let prevRank = 0;
    let itemsWithPrevRank = 0;
    
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const val = s.lightHours;
      let rank: number;
      
      if (prevValue === null) {
        rank = 1;
        itemsWithPrevRank = 1;
      } else if (val === prevValue) {
        rank = prevRank;
        itemsWithPrevRank++;
      } else {
        rank = prevRank + itemsWithPrevRank;
        itemsWithPrevRank = 1;
      }
      
      if (s.id === id) {
        return rank;
      }
      
      prevValue = val;
      prevRank = rank;
    }
    
    return 0; // Not found
  };

  // Calculate rankings for this startup
  const rankLastN = useMemo(
    () => getRankingByLightHours("lastNDaysWorkHours"),
    [id, lightFactor]
  );

  const rankOverall = useMemo(
    () => getRankingByLightHours("totalWorkHoursAbsolute"),
    [id, lightFactor]
  );

  // Helper function to get rank color
  const getRankColor = (rank: number): string => {
    if (rank === 1) return "#d4af37"; // Gold
    if (rank === 2) return "#c0c0c0"; // Silver
    if (rank === 3) return "#cd7f32"; // Bronze
    return "#a0a0a0"; // Gray for 4+
  };

  // Background style: keep tinted background only for podium.
  // For non-podium (rank > 3) we return undefined so the default .surface dark background is used.
  const getRankCardStyle = (rank: number): React.CSSProperties | undefined => {
    if (rank === 1) return { backgroundColor: `${getRankColor(rank)}20` };
    if (rank === 2) return { backgroundColor: `${getRankColor(rank)}20` }; // unchanged silver tint
    if (rank === 3) return { backgroundColor: `${getRankColor(rank)}20` };
    return undefined; // darker default
  };

  const { t } = useI18n();
  return (
    <PageShell logoSrc={logo}>
      <Container className="py-4">
        {/* Titolo e descrizione (stesse posizioni della Home) */}
        <div className="text-center mb-2">
          <h1 className="display-6 fw-bold mt-2">{state.name}</h1>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "560px" }}>
            {/* Keep name untranslated */}
            {t("startupDetailDesc", { name: state.name, d: expiryDays })}
          </p>
        </div>

        <InfoStrip expiryDays={expiryDays} lightFactor={lightFactor} dailyLightHours={dailyLightHours} />

        {/* Remaining light on top (larger), then total light hours for the last N days, then Refresh */}
        <div className="surface p-3 mt-3">
          <div className="row g-3 text-center">
            <div className="col-12">
              <div className="d-flex justify-content-center align-items-baseline gap-2">
                <span className="display-1 fw-bold" style={{ fontSize: '4.0rem' }}>{Math.floor(seconds / 3600)}</span>
                <span className="display-6 fw-semibold">h</span>
                <span className="display-1 fw-bold ms-2" style={{ fontSize: '4.0rem' }}>{Math.floor((seconds % 3600) / 60)}</span>
                <span className="display-6 fw-semibold">m</span>
                <span className="display-1 fw-bold ms-2" style={{ fontSize: '4.0rem' }}>{seconds % 60}</span>
                <span className="display-6 fw-semibold">s</span>
              </div>
              <div className="stat-label small opacity-75">{t("remainingLight")}</div>
            </div>

            {/* Row with work hours -> arrow -> total light hours */}
            <div className="col-12">
              <div className="row align-items-center text-center">
                <div className="col-5">
                  <div className="stat-number display-2 fw-bold">{formatNumber(workLastN)}</div>
                  <div className="stat-label small opacity-75">{t("workHoursLastD", { d: expiryDays })}</div>
                </div>
                {/* Arrow indicator */}
                <div className="col-2">
                  <div className="display-4 fw-bold">→</div>
                </div>
                <div className="col-5">
                  <div className="stat-number display-2 fw-bold">{formatNumber(totalLightLastN)}</div>
                  <div className="stat-label small opacity-75">{t("totalLightHoursLastD", { d: expiryDays })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh button below the stats — same design/behavior as other refresh controls */}
          <div className="d-flex justify-content-center mt-4">
            <FloatingRefresh onClick={() => {
              try {
                // simulate data refresh by updating state from STARTUPS (in real app, would fetch updated data)
                const updated = STARTUPS.find(s => s.id === id);
                if (updated) {
                  setState(updated);
                  window.location.reload();
                }
              } catch (e) {
                /* ignore errors from caller */
              }
            }} />   
          </div>
        </div>

        {/* Ranking cards below main card */}
        <div className="row g-3 mt-3">
          {/* Left card: Ranking Overall */}
          <div className="col-12 col-md-6">
            <div className="surface p-3" style={getRankCardStyle(rankOverall)}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-light fw-semibold">{t("rankingOverall")}</span>
                <div className="rank-badge d-flex align-items-center justify-content-center" style={{ background: getRankColor(rankOverall), color: '#111' }}>{rankOverall}</div>
              </div>
            </div>
          </div>

          {/* Right card: Ranking Last N Days */}
          <div className="col-12 col-md-6">
            <div className="surface p-3" style={getRankCardStyle(rankLastN)}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-light fw-semibold">{t("rankingLastD", { d: expiryDays })}</span>
                <div className="rank-badge d-flex align-items-center justify-content-center" style={{ background: getRankColor(rankLastN), color: '#111' }}>{rankLastN}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
