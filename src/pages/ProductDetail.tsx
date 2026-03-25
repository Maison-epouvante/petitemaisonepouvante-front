import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';
import './ProductDetail.css';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsApi.getById(Number(id));
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (product && product.stock > 0) {
        await addToCart(product, 1);
        setMessage(`✅ ${product.name} ajouté au panier !`);
        console.log('Produit ajouté au panier:', product.name);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Produit en rupture de stock');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message || 'Erreur lors de l\'ajout au panier'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Chargement du produit...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produit introuvable</h2>
        <button onClick={() => navigate('/products')} className="back-button">
          ← Retour aux produits
        </button>
      </div>
    );
  }

  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate('/products')} className="back-button">
          ← Retour aux produits
        </button>

        {message && <div className="success-message">{message}</div>}

        <div className="product-detail-content">
          <div className="product-detail-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="product-detail-placeholder">🎃</div>
            )}
            {product.exclusive && (
              <span className="exclusive-badge">⭐ Exclusif</span>
            )}
          </div>

          <div className="product-detail-info">
            <h1>{product.name}</h1>
            
            {categoryName && (
              <span className="product-detail-category">
                📁 {categoryName}
              </span>
            )}

            <div className="product-detail-price">
              {Number(product.price).toFixed(2)} €
            </div>

            {product.description && (
              <div className="product-detail-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-detail-stock">
              {product.stock > 0 ? (
                <>
                  <span className="stock-available">
                    ✓ {product.stock} en stock
                  </span>
                  <button 
                    onClick={handleAddToCart}
                    className="add-to-cart-btn-large"
                  >
                    🛒 Ajouter au panier
                  </button>
                </>
              ) : (
                <span className="stock-unavailable">
                  ✗ Rupture de stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
