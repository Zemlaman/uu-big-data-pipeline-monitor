import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Pipeline Monitor</div>

        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/datasets">Datasets</NavLink>
          <NavLink to="/pipelines">Pipelines</NavLink>
          <NavLink to="/runs">Runs</NavLink>
          <NavLink to="/alerts">Alerts</NavLink>
          <NavLink to="/alert-rules">Alert Rules</NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;