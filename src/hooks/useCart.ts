import { useState, useEffect } from 'react';
import { cartApi, productsApi } from '../api';
import type { CartItem, Product } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Récupérer l'ID utilisateur depuis AuthContext/localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    }
  }, []);

  // Charger le panier depuis l'API
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      
      try {
        const response = await cartApi.getCart(userId);
        const cartItems = response.data.items || [];
        
        // Enrichir avec les données produit
        const enrichedItems = await Promise.all(
          cartItems.map(async (item: any) => {
            try {
              const productResponse = await productsApi.getById(item.product_id);
              return {
                product: productResponse.data,
                quantity: item.quantity,
                cartItemId: item.id,
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération du produit ${item.product_id}:`, error);
              return null;
            }
          })
        );
        
        setCart(enrichedItems.filter(item => item !== null) as CartItem[]);
      } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!userId) {
      console.error('Utilisateur non connecté');
      throw new Error('Vous devez être connecté pour ajouter au panier');
    }

    console.log('addToCart appelé avec:', { product: product.name, quantity });
    
    try {
      await cartApi.addItem(userId, product.id, quantity);
      
      // Mettre à jour le state local
      const existingItem = cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        console.log('Produit existe déjà, mise à jour quantité');
        setCart(prevCart =>
          prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        console.log('Nouveau produit ajouté au panier');
        // Recharger depuis l'API pour avoir l'ID correct du cart_item
        const response = await cartApi.getCart(userId);
        const newItem = response.data.items.find((i: any) => i.product_id === product.id);
        setCart(prevCart => [...prevCart, { 
          product, 
          quantity,
          cartItemId: newItem?.id 
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!userId) return;

    const item = cart.find(i => i.product.id === productId);
    if (!item?.cartItemId) return;

    try {
      await cartApi.removeItem(item.cartItemId);
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!userId) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = cart.find(i => i.product.id === productId);
    if (!item?.cartItemId) return;

    try {
      await cartApi.updateItem(item.cartItemId, quantity);
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      await cartApi.clear(userId);
      setCart([]);
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
};
