import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider, STORAGE_KEY } from '../store/store';
import TripListPage from './TripListPage';
import type { AppState } from '../types';

function renderPage() {
  return render(
    <MemoryRouter>
      <StoreProvider>
        <TripListPage />
      </StoreProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('TripListPage empty state', () => {
  it('shows the page title and the empty state with a create call-to-action', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Meine Reisen' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Noch keine Reise geplant' }),
    ).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: 'Reise anlegen' });
    expect(cta).toHaveAttribute('href', '/trips/new');
    expect(cta).toHaveAttribute('id', 'btn-empty-new-trip');
  });
});

describe('TripListPage with trips', () => {
  it('lists each trip with destination, date range, duration and total cost', () => {
    const state: AppState = {
      trips: [
        {
          id: 't1',
          destination: 'Rom',
          startDate: '2026-05-12',
          endDate: '2026-05-18',
          totalBudget: null,
        },
        {
          id: 't2',
          destination: 'Lissabon',
          startDate: '2026-09-03',
          endDate: '2026-09-09',
          totalBudget: null,
        },
      ],
      activities: [
        {
          id: 'a1',
          tripId: 't1',
          day: '2026-05-12',
          time: '10:00',
          location: 'Mitte',
          cost: 1000,
          category: 'accommodation',
          note: '',
        },
        {
          id: 'a2',
          tripId: 't1',
          day: '2026-05-13',
          time: '12:00',
          location: 'Mitte',
          cost: 240,
          category: 'food',
          note: '',
        },
      ],
      packingItems: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    renderPage();

    expect(screen.getByText('Rom')).toBeInTheDocument();
    expect(screen.getByText('Lissabon')).toBeInTheDocument();

    expect(screen.getByText(/12\. – 18\. Mai 2026/)).toBeInTheDocument();
    expect(screen.getAllByText(/7 Tage/)).toHaveLength(2);

    const romCard = screen.getByRole('link', { name: /Rom/ });
    expect(romCard).toHaveAttribute('href', '/trips/t1/plan');
    expect(romCard).toHaveTextContent(/1\.?240/);

    const lissabonCard = screen.getByRole('link', { name: /Lissabon/ });
    expect(lissabonCard).toHaveAttribute('href', '/trips/t2/plan');
    expect(lissabonCard).toHaveTextContent(/0\s?€/);
  });
});
