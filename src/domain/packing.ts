import type { PackingItem } from '../types';

export interface PackingProgress {
  checked: number;
  total: number;
  percent: number;
}

export function computePackingProgress(items: PackingItem[]): PackingProgress {
  const total = items.length;
  const checked = items.reduce((count, item) => count + (item.checked ? 1 : 0), 0);
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { checked, total, percent };
}
