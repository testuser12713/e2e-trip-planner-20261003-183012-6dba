import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider, STORAGE_KEY } from '../store/store';
import PackingListPage from './PackingListPage';
import type { AppState } from '../types';

const baseState: AppState = {
  trips: [
    {
      id: 'trip-1',
      destination: 'Rom',
      startDate: '2026-05-12',
      endDate: '2026-05-18',
      totalBudget: null,
    },
  ],
  activities: [],
  packingItems: [
    { id: 'pack-1', tripId: 'trip-1', name: 'Reisepass', checked: false },
    { id: 'pack-2', tripId: 'trip-1', name: 'Ladegerät', checked: false },
  ],
};

function renderPage(state: AppState = baseState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return render(
    <MemoryRouter initialEntries={['/trips/trip-1/packing']}>
      <StoreProvider>
        <Routes>
          <Route path="/trips/:tripId/packing" element={<PackingListPage />} />
        </Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe('PackingListPage check-off flow', () => {
  it('toggles an item and updates the progress bar', async () => {
    const user = userEvent.setup();
    renderPage();
    const list = within(screen.getByRole('list'));

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0 von 2 · 0 %');

    const passCheckbox = screen.getByRole('checkbox', { name: 'Reisepass abhaken' });
    await user.click(passCheckbox);

    expect(passCheckbox).toBeChecked();
    expect(list.getByText('Reisepass')).toHaveClass('is-done');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '1 von 2 · 50 %');

    await user.click(passCheckbox);

    expect(passCheckbox).not.toBeChecked();
    expect(list.getByText('Reisepass')).not.toHaveClass('is-done');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('adds an item through the input and button', async () => {
    const user = userEvent.setup();
    renderPage();
    const list = within(screen.getByRole('list'));

    await user.type(screen.getByRole('textbox', { name: 'Neuer Eintrag' }), 'Sonnencreme');
    await user.click(screen.getByRole('button', { name: 'Hinzufügen' }));

    expect(list.getByText('Sonnencreme')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0 von 3 · 0 %');
  });

  it('renames an item inline', async () => {
    const user = userEvent.setup();
    renderPage();
    const list = within(screen.getByRole('list'));

    await user.click(screen.getByRole('button', { name: 'Reisepass umbenennen' }));
    const renameInput = screen.getByRole('textbox', { name: 'Eintrag umbenennen' });
    await user.clear(renameInput);
    await user.type(renameInput, 'Reisepass & Visum');
    await user.keyboard('{Enter}');

    expect(list.getByText('Reisepass & Visum')).toBeInTheDocument();
  });

  it('deletes an item after a short confirmation', async () => {
    const user = userEvent.setup();
    renderPage();
    const list = within(screen.getByRole('list'));

    await user.click(screen.getByRole('button', { name: 'Reisepass löschen' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Löschen' }));

    expect(list.queryByText('Reisepass')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0 von 1 · 0 %');
  });

  it('adds a suggested default item with one click', async () => {
    const user = userEvent.setup();
    renderPage();
    const list = within(screen.getByRole('list'));

    await user.click(screen.getByRole('button', { name: 'Toilettenartikel hinzufügen' }));

    expect(list.getByText('Toilettenartikel')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0 von 3 · 0 %');
  });
});
