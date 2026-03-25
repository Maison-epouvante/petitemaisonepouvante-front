import { useState, useEffect } from 'react';
import { categoriesApi, productsApi } from '../api';
import type { Category } from '../types';
import './Create.css';

type Tab = 'category' | 'product';

export const Create = () => {
  const [activeTab, setActiveTab] = useState<Tab>('category');
  const [categories, setCategories] = useState<Category[]>([]);

  // Category form
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Product form
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [productExclusive, setProductExclusive] = useState(false);
  const [productCategoryId, setProductCategoryId] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data);
    } catch {
      // silencieux
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setLoading(true);
    try {
      await categoriesApi.create({ name: categoryName, description: categoryDescription });
      showToast(`✅ Catégorie "${categoryName}" créée avec succès !`, 'success');
      setCategoryName('');
      setCategoryDescription('');
      fetchCategories();
    } catch (err: any) {
      showToast(`❌ Erreur : ${err?.response?.data?.message || 'Impossible de créer la catégorie'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice || !productCategoryId) return;
    setLoading(true);
    try {
      await productsApi.create({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        stock: parseInt(productStock) || 0,
        imageUrl: productImageUrl || null,
        exclusive: productExclusive,
        categoryId: parseInt(productCategoryId),
      });
      showToast(`✅ Produit "${productName}" créé avec succès !`, 'success');
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductStock('');
      setProductImageUrl('');
      setProductExclusive(false);
      setProductCategoryId('');
    } catch (err: any) {
      showToast(`❌ Erreur : ${err?.response?.data?.message || 'Impossible de créer le produit'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      {toast && (
        <div className={`create-toast create-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="create-hero">
        <div className="create-hero__content">
          <span className="create-hero__icon">🧪</span>
          <h1 className="create-hero__title">Atelier de création</h1>
          <p className="create-hero__subtitle">Crée de nouvelles catégories et produits pour la boutique</p>
        </div>
      </div>

      <div className="create-container">
        <div className="create-tabs">
          <button
            className={`create-tab ${activeTab === 'category' ? 'create-tab--active' : ''}`}
            onClick={() => setActiveTab('category')}
          >
            🗂️ Nouvelle catégorie
          </button>
          <button
            className={`create-tab ${activeTab === 'product' ? 'create-tab--active' : ''}`}
            onClick={() => setActiveTab('product')}
          >
            🧸 Nouveau produit
          </button>
        </div>

        {/* ─── FORMULAIRE CATÉGORIE ─── */}
        {activeTab === 'category' && (
          <div className="create-panel">
            <form className="create-form" onSubmit={handleCreateCategory}>
              <h2 className="create-form__title">Créer une catégorie</h2>

              <div className="create-field">
                <label className="create-label">Nom <span className="required">*</span></label>
                <input
                  className="create-input"
                  type="text"
                  placeholder="Ex : Masques, Costumes, Décorations..."
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="create-field">
                <label className="create-label">Description</label>
                <textarea
                  className="create-textarea"
                  placeholder="Décrivez cette catégorie en quelques mots..."
                  rows={3}
                  value={categoryDescription}
                  onChange={e => setCategoryDescription(e.target.value)}
                />
              </div>

              <button className="create-btn" type="submit" disabled={loading || !categoryName.trim()}>
                {loading ? <span className="create-btn__spinner" /> : '🗂️ Créer la catégorie'}
              </button>
            </form>

            {/* ─── LISTE DES CATÉGORIES EXISTANTES ─── */}
            <div className="create-list">
              <h3 className="create-list__title">Catégories existantes ({categories.length})</h3>
              {categories.length === 0 ? (
                <p className="create-list__empty">Aucune catégorie pour le moment</p>
              ) : (
                <ul className="create-list__items">
                  {categories.map(cat => (
                    <li key={cat.id} className="create-list__item">
                      <span className="create-list__item-name">🗂️ {cat.name}</span>
                      {cat.description && (
                        <span className="create-list__item-desc">{cat.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ─── FORMULAIRE PRODUIT ─── */}
        {activeTab === 'product' && (
          <div className="create-panel">
            <form className="create-form" onSubmit={handleCreateProduct}>
              <h2 className="create-form__title">Créer un produit</h2>

              <div className="create-grid">
                <div className="create-field">
                  <label className="create-label">Nom <span className="required">*</span></label>
                  <input
                    className="create-input"
                    type="text"
                    placeholder="Ex : Masque de vampire"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="create-field">
                  <label className="create-label">Catégorie <span className="required">*</span></label>
                  <select
                    className="create-input create-select"
                    value={productCategoryId}
                    onChange={e => setProductCategoryId(e.target.value)}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="create-field">
                  <label className="create-label">Prix (€) <span className="required">*</span></label>
                  <input
                    className="create-input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="9.99"
                    value={productPrice}
                    onChange={e => setProductPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="create-field">
                  <label className="create-label">Stock</label>
                  <input
                    className="create-input"
                    type="number"
                    min="0"
                    placeholder="50"
                    value={productStock}
                    onChange={e => setProductStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="create-field">
                <label className="create-label">Description</label>
                <textarea
                  className="create-textarea"
                  placeholder="Décrivez le produit..."
                  rows={3}
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                />
              </div>

              <div className="create-field">
                <label className="create-label">URL de l'image</label>
                <input
                  className="create-input"
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={productImageUrl}
                  onChange={e => setProductImageUrl(e.target.value)}
                />
              </div>

              {productImageUrl && (
                <div className="create-preview">
                  <img src={productImageUrl} alt="Aperçu" className="create-preview__img" />
                </div>
              )}

              <label className="create-checkbox">
                <input
                  type="checkbox"
                  checked={productExclusive}
                  onChange={e => setProductExclusive(e.target.checked)}
                />
                <span className="create-checkbox__label">⭐ Produit exclusif</span>
              </label>

              <button
                className="create-btn"
                type="submit"
                disabled={loading || !productName.trim() || !productPrice || !productCategoryId}
              >
                {loading ? <span className="create-btn__spinner" /> : '🧸 Créer le produit'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
