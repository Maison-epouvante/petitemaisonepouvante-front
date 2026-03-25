import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import './Header.css';

export const Header = () => {
  const { getItemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const itemCount = getItemCount();

  const { notifications, unreadCount, markRead, markAllRead, deleteNotification } =
    useNotifications(isAuthenticated && user ? user.id : null);

  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleBellClick = () => {
    setBellOpen(prev => !prev);
  };

  const handleMarkRead = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    markRead(id);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏚️</span>
          <span className="logo-text">La Petite Maison de l'Épouvante</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/trocs" className="nav-link">Troc & Dons</Link>
          <Link to="/cart" className="nav-link cart-link">
            🛒 Panier
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {isAuthenticated && (
            <div className="bell-wrapper" ref={bellRef}>
              <button className="bell-btn" onClick={handleBellClick} aria-label="Notifications">
                🔔
                {unreadCount > 0 && (
                  <span className="bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>

              {bellOpen && (
                <div className="notif-popup">
                  <div className="notif-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button className="notif-read-all" onClick={markAllRead}>
                        Tout marquer lu
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="notif-empty">Aucune notification</div>
                  ) : (
                    <ul className="notif-list">
                      {notifications.map(n => (
                        <li key={n.id} className={`notif-item${n.is_read ? '' : ' notif-unread'}`}>
                          <div className="notif-content">
                            <p className="notif-title">{n.title}</p>
                            <p className="notif-message">{n.message}</p>
                            <span className="notif-date">
                              {new Date(n.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <div className="notif-actions">
                            {!n.is_read && (
                              <button
                                className="notif-btn-read"
                                title="Marquer comme lu"
                                onClick={e => handleMarkRead(e, n.id)}
                              >
                                ✓
                              </button>
                            )}
                            <button
                              className="notif-btn-delete"
                              title="Supprimer"
                              onClick={e => handleDelete(e, n.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <Link to="/profile" className="nav-link profile-link">
              👤 {user?.username}
            </Link>
          ) : (
            <Link to="/login" className="nav-link login-link">
              🔐 Connexion
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
