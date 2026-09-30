import { Outlet } from "react-router-dom";

import { NotificationsProvider } from "../../context/NotificationsContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <NotificationsProvider>
      <div className="app-shell">
        <Sidebar />

        <main className="main-area">
          <Header />

          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationsProvider>
  );
}

export default AppLayout;