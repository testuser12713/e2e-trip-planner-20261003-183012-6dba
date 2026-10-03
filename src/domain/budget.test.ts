import { describe, it, expect } from 'vitest';
import { computeTotalCost, computeBudgetByCategory } from './budget';
import type { Activity } from '../types';

const base: Activity = {
  id: 'a',
  tripId: 'trip-1',
  day: '2026-01-01',
  time: '09:00',
  location: 'Mitte',
  cost: 0,
  category: 'other',
  note: '',
};

function activity(overrides: Partial<Activity>): Activity {
  return { ...base, ...overrides };
}

describe('computeTotalCost', () => {
  it('sums only the activities of the given trip', () => {
    const activities = [
      activity({ id: 'a1', cost: 10 }),
      activity({ id: 'a2', cost: 20.5 }),
      activity({ id: 'a3', tripId: 'trip-2', cost: 100 }),
    ];
    expect(computeTotalCost(activities, 'trip-1')).toBe(30.5);
  });

  it('returns zero when there are no matching activities', () => {
    expect(computeTotalCost([], 'trip-1')).toBe(0);
    expect(computeTotalCost([activity({ id: 'x', tripId: 'trip-2', cost: 5 })], 'trip-1')).toBe(0);
  });

  it('treats a missing cost as zero', () => {
    expect(computeTotalCost([activity({ id: 'a1', cost: 0 })], 'trip-1')).toBe(0);
  });
});

describe('computeBudgetByCategory', () => {
  it('aggregates per category in descending order', () => {
    const activities = [
      activity({ id: 'a1', category: 'food', cost: 10 }),
      activity({ id: 'a2', category: 'food', cost: 5 }),
      activity({ id: 'a3', category: 'accommodation', cost: 100 }),
      activity({ id: 'a4', category: 'transport', cost: 20 }),
    ];
    const result = computeBudgetByCategory(activities, 'trip-1');
    expect(result).toEqual([
      { category: 'accommodation', total: 100 },
      { category: 'transport', total: 20 },
      { category: 'food', total: 15 },
    ]);
  });

  it('ignores activities from other trips', () => {
    const activities = [
      activity({ id: 'a1', category: 'food', cost: 10 }),
      activity({ id: 'a2', tripId: 'trip-2', category: 'food', cost: 999 }),
    ];
    expect(computeBudgetByCategory(activities, 'trip-1')).toEqual([
      { category: 'food', total: 10 },
    ]);
  });

  it('returns an empty array when there are no activities', () => {
    expect(computeBudgetByCategory([], 'trip-1')).toEqual([]);
  });
});
