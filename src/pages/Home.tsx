import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import type { Product, Category } from '../types';
import './Home.css';

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
        ]);
        setProducts(productsRes.data.slice(0, 6)); // 6 premiers produits
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenues dans la Petite Maison de l'Épouvante
          </h1>
          <p className="hero-subtitle">
            Découvrez notre collection effrayante de produits d'horreur
          </p>
          <Link to="/products" className="hero-button">
            Découvrir nos produits 👻
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Nos Catégories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <Link to={`/categories/${category.id}`} key={category.id} className="category-card">
              <h3>{category.name}</h3>
              <p>{category.description || 'Explorez cette catégorie'}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-title">Produits Vedettes</h2>
        <div className="products-grid">
          {products.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="product-card"
            >
              <div className="product-image">🎃</div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{Number(product.price).toFixed(2)} €</p>
              {product.stock > 0 ? (
                <span className="product-stock">En stock</span>
              ) : (
                <span className="product-stock out-of-stock">Rupture</span>
              )}
            </Link>
          ))}
        </div>
        <div className="view-all">
          <Link to="/products" className="view-all-button">
            Voir tous les produits →
          </Link>
        </div>
      </section>

      {/* Troc Section */}
      <section className="troc-section">
        <div className="troc-content">
          <h2 className="section-title">Troc & Dons</h2>
          <p className="troc-description">
            Partagez, échangez et donnez vos objets d'horreur avec notre communauté !
          </p>
          <Link to="/trocs" className="troc-button">
            Accéder au Troc 🔄
          </Link>
        </div>
      </section>
    </div>
  );
};
