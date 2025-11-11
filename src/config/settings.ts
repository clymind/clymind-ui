export const SETTINGS = {
  expiryDays: 14,
  lightFactor: 25,
  dailyLightHours: 10,
};

export type Startup = {
  id: string;
  name: string;
  remainingLightSeconds: number;
  lastNDaysWorkHours: number;
  totalWorkHoursAbsolute: number;
};

export const STARTUPS: Startup[] = [
  { id: "1",  name: "Aether Labs",    remainingLightSeconds:  8.02 * 3600,  lastNDaysWorkHours: 18.5, totalWorkHoursAbsolute: 280 },
  { id: "2",  name: "Bloomlytics",    remainingLightSeconds: 45.43 * 3600,  lastNDaysWorkHours: 12.0, totalWorkHoursAbsolute: 460 },
  { id: "3",  name: "Cobalt AI",      remainingLightSeconds: 72.02 * 3600,  lastNDaysWorkHours: 24.3, totalWorkHoursAbsolute: 210 },
  { id: "4",  name: "Dawn Robotics",  remainingLightSeconds: 31.55 * 3600,  lastNDaysWorkHours:  8.7, totalWorkHoursAbsolute: 520 },
  { id: "5",  name: "EcoSense",       remainingLightSeconds:  6.5*3600,  lastNDaysWorkHours: 20.1, totalWorkHoursAbsolute: 190 },
  { id: "6",  name: "FluxGarden",     remainingLightSeconds:120.1 * 3600,  lastNDaysWorkHours:  6.2, totalWorkHoursAbsolute: 610 },
  { id: "7",  name: "GreenPulse",     remainingLightSeconds: 8.75 * 3600,  lastNDaysWorkHours: 15.2, totalWorkHoursAbsolute: 300 },
  { id: "8",  name: "EcoHub",     remainingLightSeconds: 90.32 * 3600,  lastNDaysWorkHours: 28.4, totalWorkHoursAbsolute: 170 },
  { id: "9",  name: "ZeroTech",       remainingLightSeconds: 0,          lastNDaysWorkHours:  9.1, totalWorkHoursAbsolute: 145 },
  { id: "10", name: "LumenLess",      remainingLightSeconds: 0,          lastNDaysWorkHours:  3.6, totalWorkHoursAbsolute:  60 },
  { id: "11", name: "NovaNexus",      remainingLightSeconds:15.5 * 3600,  lastNDaysWorkHours: 22.7, totalWorkHoursAbsolute: 400 },
  { id: "12", name: "OptiWave",       remainingLightSeconds:55.3 * 3600,  lastNDaysWorkHours: 11.3, totalWorkHoursAbsolute: 330 },
  { id: "13", name: "PulseTech",     remainingLightSeconds:8.43 * 3600,  lastNDaysWorkHours: 19.8, totalWorkHoursAbsolute: 250 },
  { id: "14", name: "QuantumQuotient", remainingLightSeconds:5.2 * 3600, lastNDaysWorkHours: 14.5, totalWorkHoursAbsolute: 400 },
  { id: "15", name: "RadiantRise",   remainingLightSeconds:0,          lastNDaysWorkHours:  5.4, totalWorkHoursAbsolute: 130 },
  { id: "16", name: "Solaris Solutions", remainingLightSeconds:70.5 * 3600, lastNDaysWorkHours: 17.6, totalWorkHoursAbsolute: 290 },
  { id: "17", name: "TerraVision",      remainingLightSeconds:42.8 * 3600,  lastNDaysWorkHours: 13.2, totalWorkHoursAbsolute: 380 },
  { id: "18", name: "UrbanAI",         remainingLightSeconds:11.1 * 3600,  lastNDaysWorkHours: 26.5, totalWorkHoursAbsolute: 540 },
  { id: "19", name: "VortexFlow",      remainingLightSeconds:63.4 * 3600,  lastNDaysWorkHours:  9.9, totalWorkHoursAbsolute: 220 },
  { id: "20", name: "WaveSync",        remainingLightSeconds:0,             lastNDaysWorkHours:  2.3, totalWorkHoursAbsolute:  45 },
];

