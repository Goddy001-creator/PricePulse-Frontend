import {
  Bell,
  Moon,
  Search,
  Sun,
} from "lucide-react";

function Header() {
  return (
    <header className="topbar">
      <div className="header-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search for products..."
        />
        <span className="shortcut">Ctrl + K</span>
      </div>

      <div className="header-actions">
        <button className="icon-button notification-button">
          <Bell size={19} />
          <span className="notification-dot">3</span>
        </button>

        <button className="icon-button">
          <Moon size={19} />
        </button>

        <div className="user-profile">
          <div className="avatar">A</div>
          <div>
            <strong>Emem</strong>
            <small>Account</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;