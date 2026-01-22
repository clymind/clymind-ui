/**
 * Startup Detail Page: Individual startup profile and metrics
 *
 * Features:
 * 1. Live countdown timer: Remaining light hours in real-time
 * 2. Light hours display: Accumulated light hours over last N days (pre-multiplied)
 * 3. Light hours totals shown directly (no on-the-fly conversion)
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
import { useParams } from "react-router-dom";
import { PageShell, Container, FloatingRefresh, InfoStrip } from "../components";
import { formatNumber } from "../lib/format";
import { useDashboard } from "../hooks/useDashboard";
import type { Startup } from "../types";
import logo from "../assets/clymind-logo.png";
import { useI18n } from "../i18n";

export default function StartupPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();

  // Fetch data from backend
  const { startups: STARTUPS, config: SETTINGS, loading } = useDashboard();

  // Find the current startup
  const state = useMemo<Startup | undefined>(
    () => STARTUPS.find(s => s.id === id),
    [STARTUPS, id]
  );

  // Live countdown in seconds - ALL hooks must be before conditional returns
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (state) {
      setSeconds(Math.max(0, state.remainingLightSeconds));
    }
  }, [state?.remainingLightSeconds]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate rankings - must be before conditional returns
  const getRankingByLightHours = (metricKey: "lastNDaysLightHours" | "totalLightHoursAbsolute"): number => {
    const startupsByLight = STARTUPS.map(s => ({
      id: s.id,
      lightHours: s[metricKey]
    }));

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

    return 0;
  };

  const rankLastN = useMemo(
    () => getRankingByLightHours("lastNDaysLightHours"),
    [id, STARTUPS]
  );

  const rankOverall = useMemo(
    () => getRankingByLightHours("totalLightHoursAbsolute"),
    [id, STARTUPS]
  );

  // While loading, show nothing (avoids flash)
  if (loading && !state) {
    return null;
  }

  // Show "not found" only after loading is done and startup doesn't exist
  if (!state) {
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

  // Derived values (safe to use after conditional returns since they don't use hooks)
  const lightLastN = state.lastNDaysLightHours;
  const expiryDays = SETTINGS?.expiryDays || 14;
  const lightFactor = SETTINGS?.lightFactor || 25;
  const dailyLightHours = SETTINGS?.dailyLightHours || 10;
  const totalLightLastN = lightLastN;

  const getRankColor = (rank: number): string => {
    if (rank === 1) return "#d4af37";
    if (rank === 2) return "#c0c0c0";
    if (rank === 3) return "#cd7f32";
    return "var(--warm-beige)";
  };

  const getRankCardStyle = (rank: number): React.CSSProperties | undefined => {
    if (rank === 1) return { backgroundColor: `${getRankColor(rank)}20` };
    if (rank === 2) return { backgroundColor: `${getRankColor(rank)}20` };
    if (rank === 3) return { backgroundColor: `${getRankColor(rank)}20` };
    return undefined;
  };

  return (
    <PageShell logoSrc={logo}>
      <Container className="py-4">
        <div className="text-center mb-2">
          <h1 className="display-6 fw-bold mt-2">{state.name}</h1>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "560px" }}>
            {t("startupDetailDesc", { name: state.name, d: expiryDays })}
          </p>
        </div>

        <InfoStrip expiryDays={expiryDays} lightFactor={lightFactor} dailyLightHours={dailyLightHours} />

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

            <div className="col-12">
              <div className="row align-items-center text-center">
                <div className="col-5">
                  <div className="stat-number display-2 fw-bold">{formatNumber(lightLastN)}</div>
                  <div className="stat-label small opacity-75">{t("workHoursLastD", { d: expiryDays })}</div>
                </div>
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

          <div className="d-flex justify-content-center mt-4">
            <FloatingRefresh />
          </div>
        </div>

        <div className="row cards-row mt-3">
          <div className="col-12 col-md-6">
            <div className="surface" style={getRankCardStyle(rankOverall)}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold fs-5" style={{ color: 'var(--light-gray)' }}>{t("rankingOverall")}</span>
                <div className="rank-badge d-flex align-items-center justify-content-center" style={{ background: getRankColor(rankOverall), color: rankOverall <= 3 ? '#111' : 'var(--deep-black)' }}>{rankOverall}</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="surface" style={getRankCardStyle(rankLastN)}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold fs-5" style={{ color: 'var(--light-gray)' }}>{t("rankingLastD", { d: expiryDays })}</span>
                <div className="rank-badge d-flex align-items-center justify-content-center" style={{ background: getRankColor(rankLastN), color: rankLastN <= 3 ? '#111' : 'var(--deep-black)' }}>{rankLastN}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
