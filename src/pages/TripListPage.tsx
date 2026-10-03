import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import TripCard from '../components/TripCard';

export default function TripListPage() {
  const { state } = useStore();
  const { trips, activities } = state;

  if (trips.length === 0) {
    return (
      <section aria-label="Reisen">
        <h1 className="page-title">Meine Reisen</h1>
        <div className="empty-state" data-od-id="trip-empty-state">
          <h2 className="empty-state__title">Noch keine Reise geplant</h2>
          <p className="empty-state__desc">
            Lege deine erste Reise an, um Tagesplan, Budget und Packliste zu verwalten.
          </p>
          <Link to="/trips/new" className="button" id="btn-empty-new-trip">
            Reise anlegen
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Reisen">
      <h1 className="page-title">Meine Reisen</h1>
      <p className="page-subtitle">
        {trips.length === 1 ? '1 Reise geplant' : `${trips.length} Reisen geplant`} ·
        Planung, Budget und Packliste für jede Reise
      </p>
      <ul className="trip-list" aria-label="Reiseliste" data-od-id="trip-list">
        {trips.map((trip) => (
          <li key={trip.id}>
            <TripCard trip={trip} activities={activities} />
          </li>
        ))}
      </ul>
    </section>
  );
}
