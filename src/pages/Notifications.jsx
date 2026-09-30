import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { useNotifications } from "../context/NotificationsContext";

function formatPrice(value) {
  if (value === null || value === undefined) return null;
  return `₦${Number(value).toLocaleString()}`;
}

function Notifications() {
  const {
    notifications,
    readIds,
    unreadCount,
    loading,
    error,
    markRead,
    markAllRead,
    reload,
  } = useNotifications();

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Notifications</h1>
          <p>Big price cuts detected across your tracked stores.</p>
        </div>

        <button
          className="secondary-button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      <div className="content-card">
        <div className="card-heading">
          <div>
            <h2>Latest</h2>
            <p>
              {unreadCount} unread of {notifications.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : error ? (
          <div className="empty-state">
            <div>
              Unable to load notifications. Make sure the backend is running.
              <br />
              <button
                className="secondary-button"
                style={{ marginTop: 12 }}
                onClick={reload}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div>
              <Bell size={24} />
              <br />
              No notifications yet.
            </div>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((item) => {
              const isUnread = !readIds.includes(item.id);
              const price = formatPrice(item.price);

              return (
                <Link
                  key={item.id}
                  to={`/products/${item.productId}`}
                  className={`notification-item ${isUnread ? "unread" : ""}`}
                  onClick={() => markRead(item.id)}
                >
                  <div className="mini-thumbnail">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" /> : "PP"}
                  </div>

                  <div className="notification-body">
                    <strong>{item.productName}</strong>
                    <span>
                      {item.discount}% off
                      {item.storeName ? ` at ${item.storeName}` : ""}
                      {price ? ` · now ${price}` : ""}
                    </span>
                  </div>

                  <span className="notification-badge">-{item.discount}%</span>

                  {isUnread && <span className="notification-unread-dot" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;