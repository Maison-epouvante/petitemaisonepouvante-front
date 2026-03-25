import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import type { Order } from '../types';
import './Profile.css';

export const Profile = () => {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form state
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll();
      // Filtrer les commandes de l'utilisateur connecté
      const userOrders = response.data.filter((order: Order) => order.user_id === user?.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await updateUser({ username, email });
      setMessage('✅ Profil mis à jour avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`❌ ${error.message || 'Erreur lors de la mise à jour'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '⏳ En attente',
      processing: '🔄 En traitement',
      shipped: '📦 Expédiée',
      delivered: '✅ Livrée',
      cancelled: '❌ Annulée',
    };
    return statusMap[status] || status;
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 Mon Profil</h1>
          <button onClick={logout} className="logout-button">
            🚪 Se déconnecter
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📋 Mes informations
          </button>
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Mes commandes
          </button>
        </div>

        {message && <div className="profile-message">{message}</div>}

        {activeTab === 'info' && (
          <div className="profile-content">
            <h2>Informations personnelles</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-content">
            <h2>Historique des commandes</h2>
            {loading ? (
              <div className="loading">Chargement des commandes...</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>😢 Vous n'avez pas encore passé de commande</p>
                <a href="/products" className="shop-link">
                  Découvrir nos produits →
                </a>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Commande #{order.id}</h3>
                        <p className="order-date">
                          {new Date(order.created_at || '').toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`order-status status-${order.status}`}>
                        {getStatusBadge(order.status)}
                      </span>
                    </div>
                    <div className="order-details">
                      <p className="order-total">
                        <strong>Total:</strong> {Number(order.total).toFixed(2)} €
                      </p>
                      {order.shipping_address && (
                        <p className="order-address">
                          <strong>Adresse:</strong> {order.shipping_address}
                        </p>
                      )}
                      {order.items && order.items.length > 0 && (
                        <div className="order-items">
                          <strong>Articles:</strong>
                          <ul>
                            {order.items.map((item, index) => (
                              <li key={index}>
                                {item.name} x{item.quantity} - {Number(item.price).toFixed(2)} €
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
