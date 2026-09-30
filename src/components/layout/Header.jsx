import { Bell, CircleHelp, Moon, Search, Settings as SettingsIcon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useNotifications } from "../../context/NotificationsContext";
import { useTheme } from "../../context/ThemeContext";

function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/products") {
      setQuery(new URLSearchParams(location.search).get("q") || "");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }

      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
    searchRef.current?.blur();
  }

  return (
    <header className="topbar">
      <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
        <Search size={19} />
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          aria-label="Search for products"
        />
        <span className="shortcut">Ctrl + K</span>
      </form>

      <div className="header-actions">
        <Link
          to="/notifications"
          className="icon-button notification-button"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell size={19} />
          {unreadCount > 0 && (
            <span className="notification-dot">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="account-menu" ref={menuRef}>
          <button
            type="button"
            className="user-profile account-trigger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="avatar">A</div>
            <div>
              <strong>Emem</strong>
              <small>Account</small>
            </div>
          </button>

          {menuOpen && (
            <div className="account-dropdown" role="menu">
              <div className="account-dropdown-header">
                <strong>Emem</strong>
                <span>PricePulse account</span>
              </div>

              <Link to="/settings" role="menuitem">
                <SettingsIcon size={16} />
                Settings
              </Link>

              <Link to="/notifications" role="menuitem">
                <Bell size={16} />
                Notifications
              </Link>

              <Link to="/about" role="menuitem">
                <CircleHelp size={16} />
                About
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;