# ClyMind UI - Startup Light Hours Dashboard

A modern, responsive React + TypeScript web application for tracking remaining light hours and work metrics across startups. The dashboard provides real-time countdowns, comprehensive leaderboards with statistical analysis, and intuitive filtering capabilities.

---

## 🎯 Overview

**ClyMind** is a light-hour management system where:

- Each startup has a pool of remaining "light hours" (a countdown timer)
- Light hours deplete based on work accumulated in an e-logbook
- The system tracks both recent activity (last N days) and all-time metrics
- A visual dashboard helps identify at-risk startups and compare performance

### Key Concepts

- **Light Hours**: A limited resource that expires after N days of inactivity
- **Work Hours**: Hours logged by a startup in the e-logbook; converted to light via a multiplier
- **Metrics**:
  - `remainingLightSeconds`: Real-time countdown of remaining light
  - `lastNDaysWorkHours`: Work hours in the expiry window
  - `totalWorkHoursAbsolute`: All-time accumulated work hours

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone and install
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173` (or next available port).

---

## 📁 Project Structure

```
src/
├── assets/                    # Static assets (logo, favicon)
├── components/                # React UI components
│   ├── layout/
│   │   ├── PageShell.tsx       # Main page wrapper with header
│   │   └── Container.tsx       # Content container with max-width
│   ├── ui/                     # Atomic UI components
│   │   ├── SearchBar.tsx       # Search + filter interface
│   │   ├── FloatingRefresh.tsx # Refresh button component
│   │   ├── Tabs.tsx            # Tab navigation (Remaining light / Leaderboards)
│   │   ├── InfoStrip.tsx       # Settings info display (expiryDays, lightFactor, etc)
│   │   └── MeanBlock.tsx       # Mean marker for leaderboards
│   ├── StartupCard.tsx         # Individual startup card with live countdown
│   ├── LeaderboardRow.tsx      # Single leaderboard ranking row
│   ├── LeaderboardView.tsx     # Complete leaderboard with toggle + rows + mean
│   └── index.ts                # Component exports
├── config/
│   ├── settings.ts             # Global app settings + mock startup data (STARTUPS array)
├── hooks/
│   └── useLeaderboardData.ts   # Custom hook for leaderboard logic (tie-aware ranking, filtering, mean)
├── lib/
│   ├── format.ts               # Number formatting (decimal rules, hours suffix)
│   └── calculations.ts         # Leaderboard calculations (ranking, mean, insertion position)
├── pages/
│   ├── home.tsx                # Main page (startup grid + leaderboards)
│   └── startup.tsx             # Individual startup detail page
├── types.ts                    # Centralized TypeScript type definitions
├── App.tsx                     # React Router setup
├── index.css                   # Global styles + CSS variables
├── main.tsx                    # React entry point
└── vite-env.d.ts              # Vite type declarations
```

---

## 🎨 Design & Styling

### Color Scheme

- **Primary**: Bootstrap success (green) for refresh and mean indicators
- **Dark theme**: Dark background (#0b0f14) with light text
- **Danger**: Red (#dc3545) for zero-state and at-risk indicators
- **Metals**: Gold (#d4af37) for rank 1, Silver (#c0c0c0) for rank 2, Bronze (#cd7f32) for rank 3

### CSS Variables

```css
--select-bg: #2a3b46; /* Hover background */
--select-bg-soft: rgba(42, 59, 70, 0.68); /* Active tab background */
--danger-veil: rgba(220, 53, 69, 0.14); /* Zero-state background */
--danger-border: rgba(220, 53, 69, 0.35); /* Zero-state border */
```

### Key Classes

- `.surface`: Main card background with gradient
- `.surface-soft`: Softer variant for info strips
- `.startup-card`: Clickable startup card with timer
- `.startup-card.zero`: Zero-state styling (red tint)
- `.selectable-row`: Leaderboard row styling
- `.selectable-row.zero`: Zero-state leaderboard row

---

## 📊 Pages & Features

### Home Page (`/`)

**Purpose**: Overview of all startups with search, filtering, and leaderboard analysis

**Sections**:

1. **Info Strip**: Displays settings (expiryDays, lightFactor, dailyLightHours)
2. **Search & Filter**:
   - Search by startup name (prefix match)
   - Filter by status: All / At-risk (0 to dailyLightHours) / Inactive (0 light)
   - Refresh button to reload data
3. **Tabs**:
   - **Remaining Light**: Grid of startup cards with live countdown timers
   - **Leaderboards**: Toggle between "Last N days" and "Overall" rankings
     - Tie-aware ranking (same metric = same rank)
     - Mean marker (green line with value)
     - Color-coded ranks: 🥇 Gold, 🥈 Silver, 🥉 Bronze

### Startup Detail Page (`/startup/:id`)

**Purpose**: In-depth view of a single startup

**Sections**:

1. **Startup Name**: Large heading
2. **Info Strip**: Same settings display as home page
3. **Statistics**:
   - **Remaining Light**: Large countdown (HH:MM:SS format, live updates every second)
   - **Work Hours**: Last N days and total accumulated
   - **Light Accumulation**: Work hours × lightFactor
4. **Refresh Button**: Simulate data refresh

---

## 🔧 Core Logic & Algorithms

### Tie-Aware Ranking

The `getLeaderboardRows()` function in `calculations.ts` handles ties correctly:

```
Example: Work hours [100, 90, 90, 80]
Result ranks:        [1,   2,  2,  4]
(Not: [1, 2, 3, 4])
```

This ensures startups with identical metrics share the same rank, and subsequent ranks skip accordingly.

### Mean Computation

- **Always computed on the full dataset**, not just filtered rows
- This keeps the mean marker stable even when searching or filtering
- Provides a consistent reference point for comparing subsets

### Mean Insertion Position

The mean marker is inserted **after the last startup whose value >= mean**:

```
Example: Rows [100, 90, 80], Mean 85
Insertion at position 1 (after row 0, since 100 >= 85 but 90 < 85)
```

### Number Formatting

All numeric values follow consistent decimal rules:

- `3` → `"3"` (no decimals)
- `3.1` → `"3.1"` (one decimal)
- `3.12` → `"3.12"` (two decimals)
- `3.10` → `"3.1"` (drop trailing zero)

---

## 🪝 Custom Hooks

### `useLeaderboardData(props, metricKey)`

Encapsulates all leaderboard logic for a specific metric.

**Input**:

```typescript
{
  data: Startup[],           // All startups
  query: string,             // Search query
  filterMode: FilterMode,    // "all" | "risk" | "inactive"
  passesFilter: (s) => bool  // Custom filter function
}
metricKey: "lastNDaysWorkHours" | "totalWorkHoursAbsolute"
```

**Output**:

```typescript
{
  fullRows: LeaderboardRow[],  // All startups, ranked
  viewRows: LeaderboardRow[],  // Filtered rows
  mean: number,                // Mean of full dataset
  meanInsertPos: number        // Where to insert mean marker in viewRows
}
```

---

## 📝 Component Overview

### Layout Components

- **PageShell**: Header with logo and home button (hidden on home page)
- **Container**: Centered content wrapper (max-width 1200px)

### UI Components

- **SearchBar**: Name search + filter dropdown + refresh button
- **Tabs**: Tab navigation between "Remaining Light" and "Leaderboards"
- **FloatingRefresh**: Standalone refresh button (defaults to page reload)
- **InfoStrip**: Three-column info display for settings
- **MeanBlock**: Visual mean marker (green line + label + value)

### Data Components

- **StartupCard**:
  - Live countdown timer (updates every second)
  - Name and remaining light
  - Zero-state styling when light = 0
  - Clickable to navigate to detail page
- **LeaderboardRow**:
  - Rank badge (gold/silver/bronze for top 3)
  - Startup name and metric value
  - Zero-state styling when metric = 0
- **LeaderboardView**:
  - Toggle buttons (Last N days / Overall)
  - Renders filtered leaderboard rows with mean marker

---

## 🔌 Integration Points

### Data Source

Currently uses **mock data** in `src/config/settings.ts`:

```typescript
export const STARTUPS: Startup[] = [
  { id: "1", name: "Aether Labs", remainingLightSeconds: 8.02 * 3600, ... },
  // ... more startups
]
```

**To integrate with a real API**:

1. Replace `STARTUPS` in `settings.ts` with API calls
2. Modify `home.tsx` and `startup.tsx` to use `useEffect` + `useState` for fetching
3. Add error handling and loading states

### Refresh Behavior

The refresh button currently triggers `window.location.reload()`. To fetch fresh data instead:

```typescript
const handleRefresh = async () => {
  const fresh = await fetchStartups();
  setData(fresh);
};
```

---

## 🧪 Testing Utilities

### Example: Sorting Test

```typescript
import { getLeaderboardRows } from "../lib/calculations";

const startups = [
  { id: "1", lastNDaysWorkHours: 5, ... },
  { id: "2", lastNDaysWorkHours: 5, ... }, // Same value (tie)
  { id: "3", lastNDaysWorkHours: 3, ... },
];

const rows = getLeaderboardRows(startups, "lastNDaysWorkHours");
// Result: ranks [1, 1, 3] (not [1, 2, 3])
```

### Example: Formatting Test

```typescript
import { formatNumber, formatHoursWithSuffix } from "../lib/format";

formatNumber(3.1); // "3.1"
formatHoursWithSuffix(7.5); // "7.5 h"
```

---

## 🌐 Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Responsive**: Mobile (320px+), Tablet (768px+), Desktop (1200px+)

---

## 📦 Dependencies

### Core

- `react` ^18: UI framework
- `react-router-dom` ^6: Client-side routing
- `bootstrap` ^5: CSS framework (for utility classes)

### Development

- `typescript`: Type safety
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: Vite React integration
- `@types/react`, `@types/node`: Type definitions

---

## 📚 Coding Standards

### File Naming

- Components: PascalCase (e.g., `LeaderboardView.tsx`)
- Utilities: camelCase (e.g., `calculations.ts`)
- Types: Uppercase PascalCase (e.g., `Startup`, `FilterMode`)

### Comments

- Document all public functions with JSDoc
- Explain complex logic with inline comments
- Keep comments in English

### Imports

- Organize as: React → Local types → Components → Utils → Config → Styles

### State Management

- Use React hooks (`useState`, `useMemo`, `useEffect`)
- Custom hooks for reusable logic
- Props drilling for simple cases (no Redux/Zustand for this app)

---

## 🐛 Common Issues & Solutions

### Issue: Numbers display with too many decimals

**Solution**: Use `formatNumber()` from `lib/format.ts`

### Issue: Leaderboard doesn't update when filtering

**Solution**: Ensure `filterMode` is included in the dependency array of useMemo calls

### Issue: Mean marker in wrong position

**Solution**: Check that mean is computed on `fullRows` (all data), not `viewRows` (filtered)

### Issue: Timer doesn't update

**Solution**: Verify `setInterval` is properly cleaned up in `useEffect` return statement

---

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication & startup ownership
- [ ] Data persistence (database)
- [ ] Real-time updates via WebSockets
- [ ] Charts and trends visualization
- [ ] Bulk operations (export, import)
- [ ] Dark/Light theme toggle
- [ ] Multi-language support (i18n)

---

## 📄 License

[Add license information if applicable]

---

## 👥 Contributing

[Add contribution guidelines if applicable]

---

## 📞 Support

For questions or issues:

1. Check the [Common Issues](#-common-issues--solutions) section
2. Review component JSDoc comments
3. Check the code examples in this README

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Built with**: React 18 + TypeScript + Vite + Bootstrap 5
