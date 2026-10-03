import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { StoreProvider, useStore, STORAGE_KEY, loadState } from './store';
import type { AppState, Trip } from '../types';

function wrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('store initialization', () => {
  it('starts from an empty state when nothing is persisted', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state).toEqual({ trips: [], activities: [], packingItems: [] });
  });

  it('falls back to an empty state on corrupt data', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json');
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state).toEqual({ trips: [], activities: [], packingItems: [] });
  });

  it('falls back to an empty state when the shape is wrong', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ trips: 'nope', foo: 1 }));
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state).toEqual({ trips: [], activities: [], packingItems: [] });
  });

  it('drops malformed entries but keeps valid ones', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        trips: [
          {
            id: 't1',
            destination: 'Paris',
            startDate: '2026-01-01',
            endDate: '2026-01-02',
            totalBudget: null,
          },
          { id: 't2', destination: 42 },
        ],
        activities: [],
        packingItems: [],
      }),
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state.trips).toHaveLength(1);
    expect(result.current.state.trips[0].destination).toBe('Paris');
  });

  it('drops activities whose category is not a valid CategoryId', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        trips: [],
        activities: [
          {
            id: 'a1',
            tripId: 'trip-1',
            day: '2026-01-01',
            time: '09:00',
            location: 'Mitte',
            cost: 10,
            category: 'food',
            note: '',
          },
          {
            id: 'a2',
            tripId: 'trip-1',
            day: '2026-01-01',
            time: '10:00',
            location: 'Mitte',
            cost: 20,
            category: 'not-a-category',
            note: '',
          },
        ],
        packingItems: [],
      }),
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state.activities).toHaveLength(1);
    expect(result.current.state.activities[0].id).toBe('a1');
  });
});

describe('trip actions', () => {
  it('addTrip creates a trip with a null budget and persists it', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    let trip: Trip | undefined;
    act(() => {
      trip = result.current.actions.addTrip({
        destination: 'Paris',
        startDate: '2026-01-01',
        endDate: '2026-01-05',
      });
    });
    expect(trip?.id).toBeTruthy();
    expect(trip?.totalBudget).toBeNull();
    expect(result.current.state.trips).toHaveLength(1);
    expect(result.current.state.trips[0].destination).toBe('Paris');

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as AppState;
    expect(persisted.trips).toHaveLength(1);
    expect(persisted.trips[0].destination).toBe('Paris');
  });

  it('updateTrip patches only the given fields', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    let id = '';
    act(() => {
      id = result.current.actions.addTrip({
        destination: 'Paris',
        startDate: '2026-01-01',
        endDate: '2026-01-05',
      }).id;
    });
    act(() => {
      result.current.actions.updateTrip(id, { destination: 'Rom', totalBudget: 500 });
    });
    const trip = result.current.state.trips[0];
    expect(trip.destination).toBe('Rom');
    expect(trip.totalBudget).toBe(500);
    expect(trip.startDate).toBe('2026-01-01');
  });

  it('deleteTrip cascades to activities and packing items', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    let tripId = '';
    act(() => {
      tripId = result.current.actions.addTrip({
        destination: 'Paris',
        startDate: '2026-01-01',
        endDate: '2026-01-02',
      }).id;
    });
    act(() => {
      result.current.actions.addActivity({
        tripId,
        day: '2026-01-01',
        time: '09:00',
        location: 'Mitte',
        cost: 10,
        category: 'food',
        note: '',
      });
      result.current.actions.addPackingItem(tripId, 'Pass');
    });
    expect(result.current.state.activities).toHaveLength(1);
    expect(result.current.state.packingItems).toHaveLength(1);

    act(() => {
      result.current.actions.deleteTrip(tripId);
    });
    expect(result.current.state.trips).toHaveLength(0);
    expect(result.current.state.activities).toHaveLength(0);
    expect(result.current.state.packingItems).toHaveLength(0);
  });
});

describe('activity actions', () => {
  it('adds, updates, moves and deletes an activity', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    let activityId = '';
    act(() => {
      activityId = result.current.actions.addActivity({
        tripId: 'trip-1',
        day: '2026-01-01',
        time: '09:00',
        location: 'Mitte',
        cost: 10,
        category: 'food',
        note: '',
      }).id;
    });

    act(() => {
      result.current.actions.updateActivity(activityId, { cost: 25, location: 'Nord' });
    });
    expect(result.current.state.activities[0].cost).toBe(25);
    expect(result.current.state.activities[0].location).toBe('Nord');

    act(() => {
      result.current.actions.moveActivity(activityId, '2026-01-02');
    });
    expect(result.current.state.activities[0].day).toBe('2026-01-02');

    act(() => {
      result.current.actions.deleteActivity(activityId);
    });
    expect(result.current.state.activities).toHaveLength(0);
  });
});

describe('packing item actions', () => {
  it('adds, renames, toggles and deletes a packing item', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    let itemId = '';
    act(() => {
      itemId = result.current.actions.addPackingItem('trip-1', 'Pass').id;
    });
    expect(result.current.state.packingItems[0].checked).toBe(false);

    act(() => {
      result.current.actions.updatePackingItem(itemId, 'Reisepass');
    });
    expect(result.current.state.packingItems[0].name).toBe('Reisepass');

    act(() => {
      result.current.actions.togglePackingItem(itemId);
    });
    expect(result.current.state.packingItems[0].checked).toBe(true);

    act(() => {
      result.current.actions.togglePackingItem(itemId);
    });
    expect(result.current.state.packingItems[0].checked).toBe(false);

    act(() => {
      result.current.actions.deletePackingItem(itemId);
    });
    expect(result.current.state.packingItems).toHaveLength(0);
  });
});

describe('cross-tab sync', () => {
  it('reloads state when a storage event fires for our key', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state.trips).toHaveLength(0);

    const incoming: AppState = {
      trips: [
        {
          id: 't1',
          destination: 'London',
          startDate: '2026-02-01',
          endDate: '2026-02-02',
          totalBudget: 300,
        },
      ],
      activities: [],
      packingItems: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    });

    expect(result.current.state.trips).toHaveLength(1);
    expect(result.current.state.trips[0].destination).toBe('London');
  });

  it('ignores storage events for other keys', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other-key' }));
    });
    expect(result.current.state.trips).toHaveLength(0);
  });
});

describe('loadState', () => {
  it('returns an empty state when localStorage is missing', () => {
    expect(loadState()).toEqual({ trips: [], activities: [], packingItems: [] });
  });
});
