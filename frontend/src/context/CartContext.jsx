import React, { createContext, useState, useEffect } from 'react';
import { cartAPI } from '../api/cartAPI';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      // User not logged in, set empty cart
      setCart([]);
      return;
    }
    
    const response = await cartAPI.getCart();
    setCart(response.data.data.items || []);
  } catch (error) {
    // Silently handle errors for unauthenticated users
    if (error.response?.status === 401 || error.response?.status === 500) {
      setCart([]);
      return;
    }
    console.error('Error loading cart:', error);
    setCart([]);
  }
};

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      setLoading(true);
      await cartAPI.addItem({ productId, quantity, size, color });
      await loadCart();
      toast.success('Item added to cart!');
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.updateItem(itemId, { quantity });
      await loadCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeItem(itemId);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const value = {
    cart,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};