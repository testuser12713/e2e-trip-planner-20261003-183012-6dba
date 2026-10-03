export type CategoryId =
  | 'accommodation'
  | 'food'
  | 'transport'
  | 'activity'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: 'accommodation', label: 'Unterkunft' },
  { id: 'food', label: 'Verpflegung' },
  { id: 'transport', label: 'Transport' },
  { id: 'activity', label: 'Aktivität' },
  { id: 'other', label: 'Sonstiges' },
];

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number | null;
}

export interface Activity {
  id: string;
  tripId: string;
  day: string;
  time: string;
  location: string;
  cost: number;
  category: CategoryId;
  note: string;
}

export interface PackingItem {
  id: string;
  tripId: string;
  name: string;
  checked: boolean;
}

export interface AppState {
  trips: Trip[];
  activities: Activity[];
  packingItems: PackingItem[];
}
