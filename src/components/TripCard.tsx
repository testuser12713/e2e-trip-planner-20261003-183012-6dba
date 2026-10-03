import { Link } from 'react-router-dom';
import type { Activity, Trip } from '../types';
import { computeDurationDays } from '../domain/dates';
import { computeTotalCost } from '../domain/budget';

export interface TripCardProps {
  trip: Trip;
  activities: Activity[];
}

const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

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

function formatDayMonth(date: Date): string {
  return `${date.getDate()}. ${MONTHS[date.getMonth()]}`;
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  if (!start || !end) {
    return `${startDate} – ${endDate}`;
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    return `${start.getDate()}. – ${end.getDate()}. ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
  }
  if (sameYear) {
    return `${formatDayMonth(start)} – ${formatDayMonth(end)} ${end.getFullYear()}`;
  }
  return `${formatDayMonth(start)} ${start.getFullYear()} – ${formatDayMonth(end)} ${end.getFullYear()}`;
}

export function formatDuration(days: number): string {
  return days === 1 ? '1 Tag' : `${days} Tage`;
}

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export default function TripCard({ trip, activities }: TripCardProps) {
  const duration = computeDurationDays(trip.startDate, trip.endDate);
  const totalCost = computeTotalCost(activities, trip.id);

  return (
    <Link
      to={`/trips/${trip.id}/plan`}
      className="card card--interactive trip-card"
      aria-label={`${trip.destination}: Tagesplan öffnen`}
    >
      <div className="trip-card__main">
        <div className="trip-card__title">{trip.destination}</div>
        <div className="trip-card__dates">
          {formatDateRange(trip.startDate, trip.endDate)} · {formatDuration(duration)}
        </div>
      </div>
      <div className="trip-card__stats">
        <div className="trip-card__stat">
          <span className="trip-card__stat-label">Gesamtkosten</span>
          <span className="trip-card__stat-value">{formatCurrency(totalCost)}</span>
        </div>
        <span className="trip-card__chevron" aria-hidden="true">
          ›
        </span>
      </div>
    </Link>
  );
}
