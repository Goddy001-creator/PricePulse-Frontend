import {
  Database,
  Download,
  Mail,
  RefreshCw,
  Trash2,
} from "lucide-react";

function Settings() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your PricePulse preferences.
          </p>
        </div>
      </div>

      <div className="settings-card">
        <section className="settings-section">
          <h2>General</h2>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Auto Refresh</strong>
              <span>
                Automatically update product prices.
              </span>
            </div>

            <select defaultValue="30">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Theme</strong>
              <span>
                Choose your preferred appearance.
              </span>
            </div>

            <select defaultValue="Light">
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Default Store</strong>
              <span>
                Select the default store filter.
              </span>
            </div>

            <select defaultValue="All Stores">
              <option>All Stores</option>
              <option>Jumia</option>
              <option>Konga</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2>Data</h2>

          <div className="settings-actions">
            <button className="secondary-button">
              <Trash2 size={17} />
              Clear Cache
            </button>

            <button className="secondary-button">
              <Download size={17} />
              Export Data
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notifications</h2>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Price Drop Alerts</strong>
              <span>
                V1 notification settings placeholder.
              </span>
            </div>

            <label className="switch">
              <input type="checkbox" />
              <span />
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <strong>Email Notifications</strong>
              <span>
                Email alerts will be available later.
              </span>
            </div>

            <label className="switch">
              <input type="checkbox" />
              <span />
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-status">
            <Database size={18} />
            <span>
              PricePulse backend connection configured
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;