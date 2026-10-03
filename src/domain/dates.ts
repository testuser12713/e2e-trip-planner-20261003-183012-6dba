const DAY_MS = 24 * 60 * 60 * 1000;

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
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
