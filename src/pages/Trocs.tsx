import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { trocsApi, productsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Troc, Product } from '../types';
import './Trocs.css';

export const Trocs = () => {
  const { user, isAuthenticated } = useAuth();
  const [trocs, setTrocs] = useState<Troc[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'troc' as 'troc' | 'don' | 'echange',
    product_id_don: '',
    product_id_offered: '',
    product_id_wanted: '',
  });

  useEffect(() => {
    fetchTrocs();
    fetchProducts();
  }, []);

  const fetchTrocs = async () => {
    try {
      const response = await trocsApi.getAll();
      setTrocs(response.data);
    } catch (error) {
      console.error('Error fetching trocs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vous devez être connecté pour créer une annonce');
      return;
    }

    try {
      // Préparer les données selon le type
      const trocData: any = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: 'active',
      };

      // Ajouter les IDs produits selon le type
      if (formData.type === 'don') {
        trocData.product_id = parseInt(formData.product_id_don);
      } else if (formData.type === 'troc') {
        trocData.product_id_offered = parseInt(formData.product_id_offered);
        trocData.product_id_wanted = parseInt(formData.product_id_wanted);
      }
      // Pour 'echange', pas de produit spécifique (description libre)

      await trocsApi.create(trocData);
      
      setFormData({
        title: '',
        description: '',
        type: 'troc',
        product_id_don: '',
        product_id_offered: '',
        product_id_wanted: '',
      });
      setShowForm(false);
      fetchTrocs();
    } catch (error) {
      console.error('Error creating troc:', error);
      alert('Erreur lors de la création de l\'annonce');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'troc': return '🔄';
      case 'don': return '🎁';
      case 'echange': return '↔️';
      default: return '📦';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'troc': return 'Troc';
      case 'don': return 'Don';
      case 'echange': return 'Échange';
      default: return type;
    }
  };

  if (loading) {
    return <div className="loading">Chargement des annonces...</div>;
  }

  // Redirection si non connecté et formulaire ouvert
  if (!isAuthenticated && showForm) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="trocs-page">
      <div className="trocs-header">
        <h1>Troc & Dons</h1>
        <p>Partagez, échangez et donnez vos objets d'horreur</p>
        {isAuthenticated ? (
          <button
            className="create-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Annuler' : '➕ Créer une annonce'}
          </button>
        ) : (
          <p className="login-prompt">Connectez-vous pour créer une annonce</p>
        )}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="troc-form-container">
          <form className="troc-form" onSubmit={handleSubmit}>
            <h2>Nouvelle annonce</h2>
            
            <div className="form-group">
              <label>Type d'annonce</label>
              <div className="type-selector">
                {(['troc', 'don', 'echange'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`type-btn ${formData.type === type ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, type })}
                  >
                    {getTypeIcon(type)} {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Figurine Freddy Krueger vintage"
                required
              />
            </div>

            {/* Champs spécifiques selon le type */}
            {formData.type === 'don' && (
              <div className="form-group">
                <label>Produit à donner</label>
                <select
                  value={formData.product_id_don}
                  onChange={(e) => setFormData({ ...formData, product_id_don: e.target.value })}
                  required
                >
                  <option value="">Sélectionnez un produit</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.price}€
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.type === 'troc' && (
              <>
                <div className="form-group">
                  <label>Produit que vous proposez</label>
                  <select
                    value={formData.product_id_offered}
                    onChange={(e) => setFormData({ ...formData, product_id_offered: e.target.value })}
                    required
                  >
                    <option value="">Sélectionnez un produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price}€
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Produit que vous recherchez</label>
                  <select
                    value={formData.product_id_wanted}
                    onChange={(e) => setFormData({ ...formData, product_id_wanted: e.target.value })}
                    required
                  >
                    <option value="">Sélectionnez un produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price}€
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre objet, son état, ce que vous recherchez..."
                rows={5}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Publier l'annonce
            </button>
          </form>
        </div>
      )}

      {/* Trocs List */}
      <div className="trocs-container">
        {trocs.length === 0 ? (
          <div className="no-trocs">
            <p>Aucune annonce pour le moment</p>
            <p>Soyez le premier à créer une annonce !</p>
          </div>
        ) : (
          <div className="trocs-grid">
            {trocs.map(troc => (
              <div key={troc.id} className={`troc-card ${troc.type}`}>
                <div className="troc-header-card">
                  <span className="troc-type">
                    {getTypeIcon(troc.type)} {getTypeLabel(troc.type)}
                  </span>
                  <span className={`troc-status ${troc.status}`}>
                    {troc.status === 'active' ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>
                
                <h3 className="troc-title">{troc.title}</h3>
                
                {troc.description && (
                  <p className="troc-description">{troc.description}</p>
                )}
                
                <div className="troc-footer">
                  <span className="troc-user">👤 User #{troc.user_id}</span>
                  {troc.created_at && (
                    <span className="troc-date">
                      {new Date(troc.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                
                <button className="contact-btn">
                  💬 Contacter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
