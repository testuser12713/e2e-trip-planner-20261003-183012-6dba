import type { Activity, CategoryId } from '../types';

export function computeTotalCost(activities: Activity[], tripId: string): number {
  return activities
    .filter((activity) => activity.tripId === tripId)
    .reduce((sum, activity) => sum + (activity.cost || 0), 0);
}

export function computeBudgetByCategory(
  activities: Activity[],
  tripId: string,
): { category: CategoryId; total: number }[] {
  const totals = new Map<CategoryId, number>();
  for (const activity of activities) {
    if (activity.tripId !== tripId) {
      continue;
    }
    totals.set(activity.category, (totals.get(activity.category) ?? 0) + (activity.cost || 0));
  }

  return Array.from(totals, ([category, total]) => ({ category, total })).sort(
    (a, b) => b.total - a.total,
  );
}
