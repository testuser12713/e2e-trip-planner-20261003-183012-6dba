const DAY_MS = 24 * 60 * 60 * 1000;

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function generateDayKeys(startDate: string, endDate: string): string[] {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  if (!start || !end || start > end) {
    return [];
  }

  const keys: string[] = [];
  const cursor = new Date(start.getTime());
  while (cursor <= end) {
    keys.push(toISODate(cursor));
    cursor.setTime(cursor.getTime() + DAY_MS);
  }
  return keys;
}

export function computeDurationDays(startDate: string, endDate: string): number {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  if (!start || !end || start > end) {
    return 0;
  }
  return Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;
}

export function todayISO(): string {
  return toISODate(new Date());
}
