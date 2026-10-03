import { NavLink, Outlet, useParams } from 'react-router-dom';

function tabClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-tab nav-tab--active' : 'nav-tab';
}

export default function TripDetailLayout() {
  const { tripId } = useParams<{ tripId: string }>();

  return (
    <div className="detail-shell">
      <nav className="nav-tabs" aria-label="Reise-Navigation">
        <NavLink to={`/trips/${tripId}/plan`} className={tabClass}>
          Tagesplan
        </NavLink>
        <NavLink to={`/trips/${tripId}/budget`} className={tabClass}>
          Budget
        </NavLink>
        <NavLink to={`/trips/${tripId}/packing`} className={tabClass}>
          Packliste
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
