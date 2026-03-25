import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import './Cart.css';

export const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert('Vous devez être connecté pour passer une commande');
      return;
    }

    if (cart.length === 0) return;
    
    if (!shippingAddress.trim()) {
      alert('Veuillez entrer une adresse de livraison');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: user.id,
        total: getTotal(),
        shipping_address: shippingAddress,
        status: 'pending',
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
      };

      await ordersApi.create(orderData);
      setOrderSuccess(true);
      clearCart();
      
      setTimeout(() => {
        setOrderSuccess(false);
        setShippingAddress('');
      }, 5000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erreur lors de la création de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-page">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h2>Commande passée avec succès !</h2>
          <p>
            Votre commande a été enregistrée et une notification a été envoyée
            via RabbitMQ au service de notifications.
          </p>
          <p className="success-detail">
            Un email de confirmation va vous être envoyé sous peu.
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits pour commencer vos achats !</p>
          <a href="/products" className="shop-button">
            Voir nos produits
          </a>
        </div>
      </div>
    );
  }

  // Redirection si non connecté lors du paiement
  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Mon Panier</h1>
          <div className="auth-warning">
            <p>⚠️ Vous devez être connecté pour passer commande</p>
            <a href="/login" className="login-link-btn">Se connecter</a>
          </div>
          
          {/* Affichage du panier en lecture seule */}
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.product.id} className="cart-item">
                  <div className="item-image">🎃</div>
                  <div className="item-details">
                    <h3 className="item-name">{item.product.name}</h3>
                    <p className="item-price">{Number(item.product.price).toFixed(2)} €</p>
                  </div>
                  <div className="item-quantity">
                    <span className="qty-value">{item.quantity}</span>
                  </div>
                  <div className="item-total">
                    {(Number(item.product.price) * item.quantity).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <h2>Résumé</h2>
              <div className="summary-total">
                <span>Total</span>
                <span>{getTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Mon Panier</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product.id} className="cart-item">
                <div className="item-image">🎃</div>
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-price">{Number(item.product.price).toFixed(2)} €</p>
                </div>
                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  {(Number(item.product.price) * item.quantity).toFixed(2)} €
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                  title="Retirer du panier"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Résumé de la commande</h2>
            
            <div className="summary-line">
              <span>Sous-total</span>
              <span>{getTotal().toFixed(2)} €</span>
            </div>
            
            <div className="summary-line">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>{getTotal().toFixed(2)} €</span>
            </div>

            <div className="shipping-form">
              <label htmlFor="shipping">Adresse de livraison</label>
              <textarea
                id="shipping"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="123 Rue de l'Horreur, 75000 Paris"
                rows={3}
              />
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Traitement...' : '🛍️ Commander'}
            </button>

            <button
              className="clear-cart-btn"
              onClick={clearCart}
            >
              🗑️ Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
