// context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, uploadedImage = null, quantity = 1) => {
    const cartItem = {
      cartId: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      uploadedImage,
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
