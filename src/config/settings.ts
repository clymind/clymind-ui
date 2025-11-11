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
 * - lastNDaysWorkHours: 0 to 8 hours (last N days activity)
 * - totalWorkHoursAbsolute: 0 to 120 hours (all-time accumulation)
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
  { id: "1",  name: "Aether Labs",    remainingLightSeconds:  8.02 * 3600,  lastNDaysWorkHours: 4.25, totalWorkHoursAbsolute: 72.0 },
  { id: "2",  name: "Bloomlytics",    remainingLightSeconds: 45.43 * 3600,  lastNDaysWorkHours: 3.0, totalWorkHoursAbsolute: 46.5 },
  { id: "3",  name: "Cobalt AI",      remainingLightSeconds: 72.02 * 3600,  lastNDaysWorkHours: 6.0, totalWorkHoursAbsolute: 88.25 },
  { id: "4",  name: "Dawn Robotics",  remainingLightSeconds: 31.55 * 3600,  lastNDaysWorkHours: 2.5, totalWorkHoursAbsolute: 34.0 },
  { id: "5",  name: "EcoSense",       remainingLightSeconds:  6.5*3600,  lastNDaysWorkHours: 6.5, totalWorkHoursAbsolute: 20.25 },
  { id: "6",  name: "FluxGarden",     remainingLightSeconds:120.5 * 3600,  lastNDaysWorkHours: 1.25, totalWorkHoursAbsolute: 15.0 },
  { id: "7",  name: "GreenPulse",     remainingLightSeconds: 8.75 * 3600,  lastNDaysWorkHours: 4.75, totalWorkHoursAbsolute: 64.0 },
  { id: "8",  name: "EcoHub laboratory base",     remainingLightSeconds: 90.32 * 3600,  lastNDaysWorkHours: 7.0, totalWorkHoursAbsolute: 95.5 },
  { id: "9",  name: "ZeroTech",       remainingLightSeconds: 0,          lastNDaysWorkHours: 0.5, totalWorkHoursAbsolute: 5.5 },
  { id: "10", name: "LumenLess",      remainingLightSeconds: 0,          lastNDaysWorkHours: 0, totalWorkHoursAbsolute: 2.0 },
  { id: "11", name: "NovaNexus",      remainingLightSeconds:15.5 * 3600,  lastNDaysWorkHours: 7.0, totalWorkHoursAbsolute: 58.0 },
  { id: "12", name: "OptiWave",       remainingLightSeconds:55.3 * 3600,  lastNDaysWorkHours: 5.25, totalWorkHoursAbsolute: 80.0 },
  { id: "13", name: "GreenPulseTech AI",     remainingLightSeconds:8.43 * 3600,  lastNDaysWorkHours: 2.75, totalWorkHoursAbsolute: 38.0 },
  { id: "14", name: "QuantumQuotient", remainingLightSeconds:5.2 * 3600, lastNDaysWorkHours: 4.5, totalWorkHoursAbsolute: 67.5 },
  { id: "15", name: "RadiantRise",   remainingLightSeconds:0,          lastNDaysWorkHours: 2.0, totalWorkHoursAbsolute: 22.0 },
  { id: "16", name: "Solaris Solutions", remainingLightSeconds:70.5 * 3600, lastNDaysWorkHours: 6.0, totalWorkHoursAbsolute: 88.5 },
  { id: "17", name: "TerraVision",      remainingLightSeconds:42.8 * 3600,  lastNDaysWorkHours: 3.25, totalWorkHoursAbsolute: 50.5 },
  { id: "18", name: "UrbanAI",         remainingLightSeconds:11.1 * 3600,  lastNDaysWorkHours: 4.0, totalWorkHoursAbsolute: 60.75 },
  { id: "19", name: "VortexFlow",      remainingLightSeconds:63.4 * 3600,  lastNDaysWorkHours: 2.25, totalWorkHoursAbsolute: 33.25 },
  { id: "20", name: "WaveSync",        remainingLightSeconds:0,             lastNDaysWorkHours: 0, totalWorkHoursAbsolute: 0},
];

