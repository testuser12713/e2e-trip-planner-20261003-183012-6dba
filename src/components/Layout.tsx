import { NavLink, Outlet } from 'react-router-dom';

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-tab nav-tab--active' : 'nav-tab';
}

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="brand" end>
            Reiseplaner
          </NavLink>
          <nav className="nav-tabs" aria-label="Hauptnavigation">
            <NavLink to="/" end className={navLinkClass}>
              Reiseliste
            </NavLink>
          </nav>
          <NavLink to="/trips/new" className="button">
            Neue Reise
          </NavLink>
        </div>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
