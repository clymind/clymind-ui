# ClyMind — Startups UI

Small React + Vite UI for visualizing "remaining light hours" for startups, leaderboards and quick search/filter.

This repository contains a lightweight TypeScript + React app built with Vite. It uses Bootstrap for layout/classes and ships a small mock dataset in `src/config/settings.ts`.

## Features

- List of startups with a live countdown of remaining "light" (hours/minutes/seconds).
- Search and filter by name and status (all / at-risk / inactive).
- Leaderboards:
  - Last N days leaderboard (configurable via `SETTINGS.expiryDays`).
  - Overall leaderboard.
  - Ranks support ties: equal values receive the same rank; the next rank advances by the number of tied items.
- Accessible SearchBar with ARIA attributes and keyboard support (Escape closes filter menu).
- Refresh buttons (top floating and search bar) that call the refresh callback and then reload the page.
- UI text translated to English.
- Compact inline time display (e.g. `2 h 0 m 5 s`).
- Centered, modernized top navbar with logo and brand.

## Quick start (macOS / zsh)

Make sure you have Node.js (>=16 recommended) and npm installed.

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Vite will output a local URL (default `http://localhost:5173/` or next available port). Open it in your browser.

3. Type check

```bash
npm run typecheck
# or
npx tsc --noEmit
```

4. Build for production

```bash
npm run build
```

5. Preview production build

```bash
npm run preview
```

## Important files

- `src/pages/home.tsx` — main page wiring: search, tabs, leaderboards, and cards.
- `src/config/settings.ts` — configuration and mock dataset (`SETTINGS` and `STARTUPS`). Change `SETTINGS.expiryDays`, `lightFactor`, `dailyLightHours` or add/remove startups here.
- `src/components/ui/SearchBar.tsx` — search input, refresh button and filter menu (ARIA + keyboard support).
- `src/components/StartupCard.tsx` — card with countdown timer and compact inline time display.
- `src/components/LeaderboardRow.tsx` — row component used by leaderboards.
- `src/components/layout/PageShell.tsx` — top navbar (centered brand + logo) and page shell.

## How leaderboards ranking works

Leaderboards are computed in `src/pages/home.tsx`. Ranking follows these rules:

- Items are sorted descending by the value (hours or total hours).
- Items with equal values receive the same `rank`.
- If N items share a rank R, the next item after the tie receives rank `R + N`.

This gives ranking like: 1, 2, 2, 2, 5, ... if three entries tie for rank 2.

## Modify startups data

Open `src/config/settings.ts` and update `STARTUPS` array. Each item has the shape:

```ts
export type Startup = {
  id: string;
  name: string;
  remainingLightSeconds: number;
  lastNDaysWorkHours: number;
  totalWorkHoursAbsolute: number;
};
```

After updating data you can click the Refresh button (or reload the page) to reflect changes in the UI. The app also includes a `refresh` callback that mutates the in-memory dataset for demo purposes.

## Accessibility & keyboard

- The SearchBar uses `role="search"` and includes a visually-hidden label.
- The filter menu uses `role="menu"` and each item is `role="menuitemradio"` with `aria-checked`.
- Pressing `Escape` will close the filter menu and return focus to the button.

## License
...
