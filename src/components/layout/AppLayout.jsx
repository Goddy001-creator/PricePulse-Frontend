import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Header />

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;