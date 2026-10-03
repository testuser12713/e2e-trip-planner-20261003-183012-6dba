import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import TripListPage from './pages/TripListPage';
import TripCreatePage from './pages/TripCreatePage';
import TripDetailLayout from './pages/TripDetailLayout';
import TripPlanPage from './pages/TripPlanPage';
import BudgetPage from './pages/BudgetPage';
import PackingListPage from './pages/PackingListPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TripListPage />} />
          <Route path="/trips/new" element={<TripCreatePage />} />
          <Route path="/trips/:tripId" element={<TripDetailLayout />}>
            <Route index element={<Navigate to="plan" replace />} />
            <Route path="plan" element={<TripPlanPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="packing" element={<PackingListPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
