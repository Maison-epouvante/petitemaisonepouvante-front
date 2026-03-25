import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';
import { useCart } from '../hooks/useCart';
import './Products.css';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => {
        const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
        return categoryName === selectedCategory;
      });

  const handleAddToCart = async (product: Product) => {
    try {
      if (product.stock > 0) {
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
    return <div className="loading">Chargement des produits...</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Nos Produits d'Horreur</h1>
        <p>Découvrez notre collection terrifiante</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      {/* Filters */}
      <div className="filters">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Tous les produits
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-container">
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              Aucun produit trouvé dans cette catégorie
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/products/${product.id}`} className="product-link">
                  <div className="product-image">🎃</div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                    <div className="product-meta">
                      <span className="product-price">{Number(product.price).toFixed(2)} €</span>
                      {product.category && (
                        <span className="product-category">
                          {typeof product.category === 'string' ? product.category : product.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="product-footer">
                  {product.stock > 0 ? (
                    <>
                      <span className="product-stock">
                        {product.stock} en stock
                      </span>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒 Ajouter au panier
                      </button>
                    </>
                  ) : (
                    <span className="product-stock out-of-stock">
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
