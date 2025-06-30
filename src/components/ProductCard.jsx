import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      cartId: Date.now(), // unique id for each cart item
    };
    addToCart(cartItem);
  };

  return (
    <div
      className="border rounded-lg p-4 shadow hover:shadow-lg hover:border-blue-400 transition duration-300 relative cursor-pointer bg-white"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-contain mb-4"
      />

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {product.name}
      </h3>

      {/* Price Badge */}
      <div className="absolute top-2 right-2 bg-green-600 text-white text-sm px-2 py-1 rounded">
        ₹{product.price}
      </div>

      {/* Add to Cart Button */}
      <button
        className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigate on click
          handleAddToCart();
        }}
      >
        ➕ Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
