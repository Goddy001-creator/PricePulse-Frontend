import {
  BarChart3,
  Bell,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Package,
  Settings as SettingsIcon,
  Store,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import Logo from "../ui/Logo";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/products",
    icon: Package,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Stores",
    path: "/stores",
    icon: Store,
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: SettingsIcon,
  },
  {
    label: "About",
    path: "/about",
    icon: CircleHelp,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo light />

        <nav className="sidebar-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="logout-button">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;