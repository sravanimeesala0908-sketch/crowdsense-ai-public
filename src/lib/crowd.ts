export const areas = ['Bus Station', 'Railway Station', 'Shopping Mall', 'Market', 'Public Park', 'Beach'] as const;
export type Area = (typeof areas)[number];
export type Inputs = { area: Area; hour: number; day: 'Weekday' | 'Weekend'; weather: 'Sunny' | 'Cloudy' | 'Rainy'; event: boolean };
export const initialInputs: Inputs = { area: 'Bus Station', hour: 17, day: 'Weekday', weather: 'Sunny', event: false };
export const formatHour = (hour: number) => `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
const base: Record<Area, number> = { 'Bus Station': 28, 'Railway Station': 33, 'Shopping Mall': 20, Market: 25, 'Public Park': 12, Beach: 10 };
export function estimate(inputs: Inputs) {
  const { area, hour, day, weather, event } = inputs;
  const transit = area === 'Bus Station' || area === 'Railway Station';
  const outdoor = area === 'Public Park' || area === 'Beach';
  let time = 0;
  if (transit) time = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19) ? 38 : hour >= 6 && hour <= 22 ? 14 : -18;
  else if (area === 'Shopping Mall') time = hour >= 16 && hour <= 20 ? 34 : hour >= 10 && hour <= 21 ? 20 : -20;
  else if (area === 'Market') time = hour >= 8 && hour <= 12 ? 32 : hour >= 6 && hour <= 19 ? 18 : -20;
  else time = hour >= 16 && hour <= 18 ? 30 : hour >= 7 && hour <= 19 ? 18 : -10;
  const dayEffect = day === 'Weekend' ? (transit ? -12 : 18) : 0;
  const weatherEffect = weather === 'Rainy' ? (outdoor ? -24 : area === 'Shopping Mall' ? 8 : -6) : weather === 'Sunny' && outdoor ? 12 : 0;
  const eventEffect = event ? 22 : 0;
  const index = Math.max(0, Math.min(100, base[area] + time + dayEffect + weatherEffect + eventEffect));
  const level = index < 35 ? 'Low' : index < 65 ? 'Moderate' : 'High';
  const advisory = level === 'Low' ? 'Less busy. A good time for a quieter visit.' : level === 'Moderate' ? 'Moderate activity. Allow a little extra time.' : 'Likely busy. Consider an earlier or later visit.';
  return { index, level, advisory, factors: { base: base[area], time, day: dayEffect, weather: weatherEffect, event: eventEffect } };
}
export type Prediction = { id: number; inputs: Inputs; result: ReturnType<typeof estimate> };