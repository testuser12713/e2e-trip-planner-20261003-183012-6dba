import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CATEGORIES } from '../types';
import type { Activity, AppState, CategoryId, PackingItem, Trip } from '../types';

export const STORAGE_KEY = 'trip-planner:state:v1';

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((category) => category.id));

function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && CATEGORY_IDS.has(value);
}

function isValidTrip(value: unknown): value is Trip {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.destination === 'string' &&
    typeof value.startDate === 'string' &&
    typeof value.endDate === 'string' &&
    (typeof value.totalBudget === 'number' || value.totalBudget === null)
  );
}

function isValidActivity(value: unknown): value is Activity {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.tripId === 'string' &&
    typeof value.day === 'string' &&
    typeof value.time === 'string' &&
    typeof value.location === 'string' &&
    typeof value.cost === 'number' &&
    isCategoryId(value.category) &&
    typeof value.note === 'string'
  );
}

function isValidPackingItem(value: unknown): value is PackingItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.tripId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.checked === 'boolean'
  );
}

export function emptyState(): AppState {
  return { trips: [], activities: [], packingItems: [] };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyState();
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return emptyState();
    }
    return {
      trips: Array.isArray(parsed.trips) ? parsed.trips.filter(isValidTrip) : [],
      activities: Array.isArray(parsed.activities)
        ? parsed.activities.filter(isValidActivity)
        : [],
      packingItems: Array.isArray(parsed.packingItems)
        ? parsed.packingItems.filter(isValidPackingItem)
        : [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable or quota exceeded — keep the in-memory state alive.
  }
}

export interface AddTripInput {
  destination: string;
  startDate: string;
  endDate: string;
}

export interface AddActivityInput {
  tripId: string;
  day: string;
  time: string;
  location: string;
  cost: number;
  category: CategoryId;
  note: string;
}

export type TripPatch = Partial<
  Pick<Trip, 'destination' | 'startDate' | 'endDate' | 'totalBudget'>
>;

export type ActivityPatch = Partial<
  Pick<Activity, 'day' | 'time' | 'location' | 'cost' | 'category' | 'note'>
>;

export interface StoreActions {
  addTrip(input: AddTripInput): Trip;
  updateTrip(id: string, patch: TripPatch): void;
  deleteTrip(id: string): void;
  addActivity(input: AddActivityInput): Activity;
  updateActivity(id: string, patch: ActivityPatch): void;
  deleteActivity(id: string): void;
  moveActivity(id: string, newDay: string): void;
  addPackingItem(tripId: string, name: string): PackingItem;
  updatePackingItem(id: string, name: string): void;
  deletePackingItem(id: string): void;
  togglePackingItem(id: string): void;
}

export interface StoreValue {
  state: AppState;
  actions: StoreActions;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setState(loadState());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addTrip = useCallback((input: AddTripInput): Trip => {
    const trip: Trip = {
      id: generateId('trip'),
      destination: input.destination,
      startDate: input.startDate,
      endDate: input.endDate,
      totalBudget: null,
    };
    setState((prev) => ({ ...prev, trips: [...prev.trips, trip] }));
    return trip;
  }, []);

  const updateTrip = useCallback((id: string, patch: TripPatch): void => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((trip) => (trip.id === id ? { ...trip, ...patch } : trip)),
    }));
  }, []);

  const deleteTrip = useCallback((id: string): void => {
    setState((prev) => ({
      trips: prev.trips.filter((trip) => trip.id !== id),
      activities: prev.activities.filter((activity) => activity.tripId !== id),
      packingItems: prev.packingItems.filter((item) => item.tripId !== id),
    }));
  }, []);

  const addActivity = useCallback((input: AddActivityInput): Activity => {
    const activity: Activity = {
      id: generateId('activity'),
      tripId: input.tripId,
      day: input.day,
      time: input.time,
      location: input.location,
      cost: input.cost,
      category: input.category,
      note: input.note,
    };
    setState((prev) => ({ ...prev, activities: [...prev.activities, activity] }));
    return activity;
  }, []);

  const updateActivity = useCallback((id: string, patch: ActivityPatch): void => {
    setState((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.id === id ? { ...activity, ...patch } : activity,
      ),
    }));
  }, []);

  const deleteActivity = useCallback((id: string): void => {
    setState((prev) => ({
      ...prev,
      activities: prev.activities.filter((activity) => activity.id !== id),
    }));
  }, []);

  const moveActivity = useCallback((id: string, newDay: string): void => {
    setState((prev) => ({
      ...prev,
      activities: prev.activities.map((activity) =>
        activity.id === id ? { ...activity, day: newDay } : activity,
      ),
    }));
  }, []);

  const addPackingItem = useCallback((tripId: string, name: string): PackingItem => {
    const item: PackingItem = {
      id: generateId('packing'),
      tripId,
      name,
      checked: false,
    };
    setState((prev) => ({ ...prev, packingItems: [...prev.packingItems, item] }));
    return item;
  }, []);

  const updatePackingItem = useCallback((id: string, name: string): void => {
    setState((prev) => ({
      ...prev,
      packingItems: prev.packingItems.map((item) =>
        item.id === id ? { ...item, name } : item,
      ),
    }));
  }, []);

  const deletePackingItem = useCallback((id: string): void => {
    setState((prev) => ({
      ...prev,
      packingItems: prev.packingItems.filter((item) => item.id !== id),
    }));
  }, []);

  const togglePackingItem = useCallback((id: string): void => {
    setState((prev) => ({
      ...prev,
      packingItems: prev.packingItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    }));
  }, []);

  const actions = useMemo<StoreActions>(
    () => ({
      addTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      moveActivity,
      addPackingItem,
      updatePackingItem,
      deletePackingItem,
      togglePackingItem,
    }),
    [
      addTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      moveActivity,
      addPackingItem,
      updatePackingItem,
      deletePackingItem,
      togglePackingItem,
    ],
  );

  const value = useMemo<StoreValue>(() => ({ state, actions }), [state, actions]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
