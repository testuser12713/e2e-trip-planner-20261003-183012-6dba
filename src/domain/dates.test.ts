import { describe, it, expect } from 'vitest';
import { generateDayKeys, computeDurationDays, todayISO } from './dates';

describe('generateDayKeys', () => {
  it('returns every day inclusive of both bounds', () => {
    expect(generateDayKeys('2026-01-01', '2026-01-03')).toEqual([
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
    ]);
  });

  it('returns a single day when start and end are equal', () => {
    expect(generateDayKeys('2026-01-01', '2026-01-01')).toEqual(['2026-01-01']);
  });

  it('crosses month boundaries', () => {
    expect(generateDayKeys('2026-01-30', '2026-02-02')).toEqual([
      '2026-01-30',
      '2026-01-31',
      '2026-02-01',
      '2026-02-02',
    ]);
  });

  it('handles leap years', () => {
    expect(generateDayKeys('2024-02-28', '2024-03-01')).toEqual([
      '2024-02-28',
      '2024-02-29',
      '2024-03-01',
    ]);
  });

  it('returns an empty list when end precedes start', () => {
    expect(generateDayKeys('2026-01-03', '2026-01-01')).toEqual([]);
  });

  it('returns an empty list for invalid dates', () => {
    expect(generateDayKeys('not-a-date', '2026-01-01')).toEqual([]);
    expect(generateDayKeys('2026-01-01', '')).toEqual([]);
  });
});

describe('computeDurationDays', () => {
  it('counts inclusively', () => {
    expect(computeDurationDays('2026-01-01', '2026-01-01')).toBe(1);
    expect(computeDurationDays('2026-01-01', '2026-01-03')).toBe(3);
    expect(computeDurationDays('2026-01-30', '2026-02-02')).toBe(4);
  });

  it('returns zero when the range is invalid', () => {
    expect(computeDurationDays('2026-01-03', '2026-01-01')).toBe(0);
    expect(computeDurationDays('nope', '2026-01-01')).toBe(0);
  });
});

describe('todayISO', () => {
  it('returns a valid yyyy-mm-dd string', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
