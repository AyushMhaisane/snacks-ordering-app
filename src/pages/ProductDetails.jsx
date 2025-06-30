import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, null, quantity);
    alert('✅ Added to cart!');
  };

  if (!product) {
    return <div className="p-6 text-center text-red-600">Product not found</div>;
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-8">
      {/* Left: Product image */}
      <div className="w-full md:w-1/2">
        <div className="relative border border-gray-300 rounded-lg shadow-md p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>
      </div>

      {/* Right: Product info */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-green-600 text-xl font-semibold mb-2">₹{product.price}</p>
          
          <p className="text-gray-700 mb-4">{product.description}</p>

          <label className="block mb-4">
            <span className="block text-sm font-medium mb-1">Quantity:</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              className="w-24 p-2 border border-gray-300 rounded"
            />
          </label>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 text-lg font-semibold"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
