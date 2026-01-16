/**
 * Global application settings and mock data
 *
 * This module contains:
 * 1. SETTINGS: Global configuration constants
 * 2. STARTUPS: Mock dataset of startups (replace with API call for production)
 *
 * The data structure is designed to be easily integrated with a backend API.
 * Simply replace the STARTUPS array with a fetch call to load real data.
 */

import type { Startup } from "../types";

/**
 * SETTINGS: Global application configuration
 *
 * @property expiryDays - Number of days before work hours expire (used for "Last N days" metric)
 * @property lightFactor - Multiplier for converting work hours to light hours
 *                        (e.g., 1 work hour → 25 light hours)
 * @property dailyLightHours - Number of light hours that should be consumed per day
 *                             Used to determine "at-risk" threshold
 */
export const SETTINGS = {
  expiryDays: 14,
  lightFactor: 25,
  dailyLightHours: 10,
};

/**
 * STARTUPS: Mock dataset of all startups
 *
 * This is a static dataset for development/demo purposes.
 * In production, this would be fetched from an API endpoint.
 *
 * Data distribution:
 * - remainingLightSeconds: 0 to 120+ hours (simulating various depletion rates)
 * - lastNDaysLightHours: 0 to 200+ light hours (already multiplied by lightFactor)
 * - totalLightHoursAbsolute: 0 to 2400+ light hours (all-time accumulation, already multiplied)
 *
 * Some startups have 0 remaining light (inactive state) to demonstrate
 * zero-state styling in the UI.
 *
 * Integration tip: Replace this with:
 * ```typescript
 * export async function getStartups(): Promise<Startup[]> {
 *   const res = await fetch('/api/startups');
 *   return res.json();
 * }
 * ```
 */
export const STARTUPS: Startup[] = [
  { id: "1",  name: "Aether Labs",    remainingLightSeconds:  8.02 * 3600,  lastNDaysLightHours: 106.25, totalLightHoursAbsolute: 1800 },
  { id: "2",  name: "Bloomlytics",    remainingLightSeconds: 45.43 * 3600,  lastNDaysLightHours: 75, totalLightHoursAbsolute: 1162.5 },
  { id: "3",  name: "Cobalt AI",      remainingLightSeconds: 72.02 * 3600,  lastNDaysLightHours: 150, totalLightHoursAbsolute: 2206.25 },
  { id: "4",  name: "Dawn Robotics",  remainingLightSeconds: 31.55 * 3600,  lastNDaysLightHours: 62.5, totalLightHoursAbsolute: 850 },
  { id: "5",  name: "EcoSense",       remainingLightSeconds:  6.5*3600,  lastNDaysLightHours: 162.5, totalLightHoursAbsolute: 506.25 },
  { id: "6",  name: "FluxGarden",     remainingLightSeconds:120.5 * 3600,  lastNDaysLightHours: 31.25, totalLightHoursAbsolute: 375 },
  { id: "7",  name: "GreenPulse",     remainingLightSeconds: 8.75 * 3600,  lastNDaysLightHours: 118.75, totalLightHoursAbsolute: 1600 },
  { id: "8",  name: "EcoHub laboratory base",     remainingLightSeconds: 90.32 * 3600,  lastNDaysLightHours: 175, totalLightHoursAbsolute: 2387.5 },
  { id: "9",  name: "ZeroTech",       remainingLightSeconds: 0,          lastNDaysLightHours: 12.5, totalLightHoursAbsolute: 137.5 },
  { id: "10", name: "LumenLess",      remainingLightSeconds: 0,          lastNDaysLightHours: 0, totalLightHoursAbsolute: 50 },
  { id: "11", name: "NovaNexus",      remainingLightSeconds:15.5 * 3600,  lastNDaysLightHours: 175, totalLightHoursAbsolute: 1450 },
  { id: "12", name: "OptiWave",       remainingLightSeconds:55.3 * 3600,  lastNDaysLightHours: 131.25, totalLightHoursAbsolute: 2000 },
  { id: "13", name: "GreenPulseTech AI",     remainingLightSeconds:8.43 * 3600,  lastNDaysLightHours: 68.75, totalLightHoursAbsolute: 950 },
  { id: "14", name: "QuantumQuotient", remainingLightSeconds:5.2 * 3600, lastNDaysLightHours: 112.5, totalLightHoursAbsolute: 1687.5 },
  { id: "15", name: "RadiantRise",   remainingLightSeconds:0,          lastNDaysLightHours: 50, totalLightHoursAbsolute: 550 },
  { id: "16", name: "Solaris Solutions", remainingLightSeconds:70.5 * 3600, lastNDaysLightHours: 150, totalLightHoursAbsolute: 2212.5 },
  { id: "17", name: "TerraVision",      remainingLightSeconds:42.8 * 3600,  lastNDaysLightHours: 81.25, totalLightHoursAbsolute: 1262.5 },
];
