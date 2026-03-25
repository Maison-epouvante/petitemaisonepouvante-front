import { useEffect, useState } from 'react';
import { productsApi } from '../api';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types';


export const CategoriesProduct = () => {

    const { id } = useParams<{ id: string }>();
    const [product,setprodct] = useState<Product | null>(null);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await productsApi.getById(Number(id));
                setprodct(response.data);
                console.log(response.data);
            }
            catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Nos Produits d'Horreur</h1>
                <p>Découvrez notre collection terrifiante</p>
            </div>




            {/* Products Grid */}
            <div className="products-container">
                <div className="products-grid">
                    
                    {product && (
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
                        )}
                                 
                </div>
            </div>
        </div>
    );
};
