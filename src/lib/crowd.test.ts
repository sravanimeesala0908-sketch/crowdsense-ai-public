import { describe, expect, it } from 'vitest';
import { areas, estimate, initialInputs } from './crowd';
describe('illustrative crowd estimates', () => {
  it('is repeatable and computes the default commute peak', () => {
    expect(estimate(initialInputs).index).toBe(66);
    expect(estimate(initialInputs)).toEqual(estimate(initialInputs));
  });
  it('keeps all estimates in range', () => {
    for (const area of areas) for (let hour = 0; hour < 24; hour++) for (const day of ['Weekday', 'Weekend'] as const) for (const weather of ['Sunny', 'Cloudy', 'Rainy'] as const) for (const event of [false, true]) {
      const result = estimate({ area, hour, day, weather, event });
      expect(result.index).toBeGreaterThanOrEqual(0);
      expect(result.index).toBeLessThanOrEqual(100);
    }
  });
  it('responds to weather, day type and events', () => {
    const park = { ...initialInputs, area: 'Public Park' as const };
    expect(estimate({ ...park, weather: 'Rainy' }).index).toBeLessThan(estimate(park).index);
    expect(estimate({ ...park, day: 'Weekend' }).index).toBeGreaterThan(estimate(park).index);
    expect(estimate({ ...park, event: true }).index).toBeGreaterThan(estimate(park).index);
  });
  it('uses documented level thresholds', () => {
    expect(estimate({ ...initialInputs, hour: 2 }).level).toBe('Low');
    expect(estimate({ ...initialInputs, hour: 12 }).level).toBe('Moderate');
    expect(estimate(initialInputs).level).toBe('High');
  });
});