import { describe, it, expect } from 'vitest';
import { computePackingProgress } from './packing';
import type { PackingItem } from '../types';

function item(overrides: Partial<PackingItem> = {}): PackingItem {
  return {
    id: 'p1',
    tripId: 'trip-1',
    name: 'Reisepass',
    checked: false,
    ...overrides,
  };
}

describe('computePackingProgress', () => {
  it('returns zero progress for an empty list', () => {
    expect(computePackingProgress([])).toEqual({ checked: 0, total: 0, percent: 0 });
  });

  it('counts checked items and computes the percentage', () => {
    const items = [
      item({ id: '1', checked: true }),
      item({ id: '2', checked: true }),
      item({ id: '3', checked: false }),
      item({ id: '4', checked: false }),
    ];
    expect(computePackingProgress(items)).toEqual({ checked: 2, total: 4, percent: 50 });
  });

  it('rounds the percentage to the nearest integer', () => {
    const items = Array.from({ length: 8 }, (_, index) =>
      item({ id: String(index), checked: index < 3 }),
    );
    expect(computePackingProgress(items).percent).toBe(38);
  });

  it('returns 100 percent when every item is checked', () => {
    const items = [item({ id: '1', checked: true }), item({ id: '2', checked: true })];
    expect(computePackingProgress(items)).toEqual({ checked: 2, total: 2, percent: 100 });
  });

  it('returns zero percent when nothing is checked', () => {
    const items = [item({ id: '1' }), item({ id: '2' })];
    expect(computePackingProgress(items)).toEqual({ checked: 0, total: 2, percent: 0 });
  });
});
