import React, { useMemo, useState } from "react";
import { PageShell, Container, InfoStrip, SearchBar, Tabs, StartupCard, LeaderboardRow } from "../components";
import { SETTINGS, STARTUPS, Startup } from "../config/settings";
import logo from "../assets/clymind-logo.png";
import type { FilterMode } from "../components/ui/SearchBar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [data, setData] = useState<Startup[]>(STARTUPS);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const q = query.trim().toLowerCase();

  const passesFilter = (s: Startup) => {
    if (filterMode === "inactive") return s.remainingLightSeconds <= 0;
    if (filterMode === "risk") return s.remainingLightSeconds > 0 && s.remainingLightSeconds <= 10 * 3600;
    return true;
  };

  const filteredAlphabetical = useMemo(() => {
    const byName = q ? data.filter(s => s.name.toLowerCase().startsWith(q)) : data.slice();
    const byFilter = byName.filter(passesFilter);
    return byFilter.sort((a, b) => a.name.localeCompare(b.name));
  }, [data, q, filterMode]);

  const criticalSeconds = SETTINGS.dailyLightHours * 3600;

  const refresh = () => {
    setData(old => old.map(s => ({
      ...s,
      remainingLightSeconds: Math.max(0, s.remainingLightSeconds - Math.floor(Math.random() * 45)),
    })));
  };

  const byId = useMemo(() => {
    const map = new Map<string, Startup>();
    data.forEach(s => map.set(s.id, s));
    return map;
  }, [data]);

  const leaderboardLastNFull = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.lastNDaysWorkHours - a.lastNDaysWorkHours);
    const rows: { rank: number; id: string; name: string; value: string }[] = [];
    let prevValue: number | null = null;
    let prevRank = 0;
    let itemsWithPrevRank = 0;

    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const val = s.lastNDaysWorkHours;
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

      rows.push({ rank, id: s.id, name: s.name, value: `${s.lastNDaysWorkHours.toFixed(1)} h` });

      prevValue = val;
      prevRank = rank;
    }

    return rows;
  }, [data]);

  const leaderboardTotalFull = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.totalWorkHoursAbsolute - a.totalWorkHoursAbsolute);
    const rows: { rank: number; id: string; name: string; value: string }[] = [];
    let prevValue: number | null = null;
    let prevRank = 0;
    let itemsWithPrevRank = 0;

    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const val = s.totalWorkHoursAbsolute;
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

      rows.push({ rank, id: s.id, name: s.name, value: `${s.totalWorkHoursAbsolute.toFixed(0)} h` });

      prevValue = val;
      prevRank = rank;
    }

    return rows;
  }, [data]);

  const leaderboardLastNView = useMemo(() => {
    return leaderboardLastNFull.filter(row => {
      const s = byId.get(row.id)!;
      const nameOk = !q || row.name.toLowerCase().startsWith(q);
      const filterOk = passesFilter(s);
      return nameOk && filterOk;
    });
  }, [leaderboardLastNFull, byId, q, filterMode]);

  const leaderboardTotalView = useMemo(() => {
    return leaderboardTotalFull.filter(row => {
      const s = byId.get(row.id)!;
      const nameOk = !q || row.name.toLowerCase().startsWith(q);
      const filterOk = passesFilter(s);
      return nameOk && filterOk;
    });
  }, [leaderboardTotalFull, byId, q, filterMode]);

  return (
    <PageShell logoSrc={logo}>
      <Container className="py-4">
        <div className="text-center mb-2">
          <h1 className="display-6 fw-bold mt-2">All startups</h1>
          <p className="text-secondary small mx-auto" style={{ maxWidth: "560px" }}>
            This page shows the remaining light hours for each startup, with leaderboards that rank startups by total accumulated light hours over the last {SETTINGS.expiryDays} days and overall. You can reload the page after adding hours to the e-logbook, to see updated values, search startups by name, and filter them by remaining hours.
          </p>
        </div>

        <InfoStrip
          expiryDays={SETTINGS.expiryDays}
          lightFactor={SETTINGS.lightFactor}
          dailyLightHours={SETTINGS.dailyLightHours}
        />

        <div className="surface p-3 mt-3">
          <SearchBar
            query={query}
            onChange={setQuery}
            onRefresh={refresh}
            filterMode={filterMode}
            onFilterChange={setFilterMode}
          />
          <Tabs active={activeTab} onChange={(i) => setActiveTab(i as 0 | 1 | 2)} />
        </div>

        <div className="mt-4">
          {activeTab === 0 && (
            <div className="row g-4 justify-content-center">
              {filteredAlphabetical.map(s => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={s.id}>
                  <StartupCard
                    name={s.name}
                    remainingLightSeconds={s.remainingLightSeconds}
                    criticalSeconds={criticalSeconds}
                    onClick={() => console.log("Open startup:", s.name)}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 1 && (
            <>
              <h2 className="h5 text-light mb-2">Leaderboard - last {SETTINGS.expiryDays} days</h2>
              <div className="d-flex flex-column gap-2">
                {leaderboardLastNView.map(row => (
                  <LeaderboardRow
                    key={row.id}
                    rank={row.rank}
                    name={row.name}
                    value={row.value}
                    onClick={() => console.log("Open startup:", row.name)}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <h2 className="h5 text-light mb-2">Leaderboard - overall</h2>
              <div className="d-flex flex-column gap-2">
                {leaderboardTotalView.map(row => (
                  <LeaderboardRow
                    key={row.id}
                    rank={row.rank}
                    name={row.name}
                    value={row.value}
                    onClick={() => console.log("Open startup:", row.name)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Container>
    </PageShell>
  );
}

