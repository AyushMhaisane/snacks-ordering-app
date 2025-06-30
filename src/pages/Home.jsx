import React, { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false); // Toggle state

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'low' && product.price <= 300) ||
      (priceFilter === 'mid' && product.price > 300 && product.price <= 600) ||
      (priceFilter === 'high' && product.price > 600);

    return matchesSearch && matchesPrice;
  });

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      {/* Left Side: Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full sm:w-1/2 p-3 border border-gray-300 rounded shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
  onClick={toggleFilters}
  className="flex items-center gap-2 bg-white text-gray-800 border px-3 py-2 rounded shadow hover:bg-gray-100"
>
  <span className="text-lg">🧰</span>
  <span className="hidden sm:inline text-sm font-medium">
    {showFilters ? 'Hide Filters' : 'Filters'}
  </span>
</button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No products found.</p>
          )}
        </div>
      </div>

      {/* Filters: Shown only when toggled */}
      {showFilters && (
        <div className="w-full md:w-64 border rounded p-4 shadow h-fit sticky top-6">
          <h3 className="text-lg font-semibold mb-4">🧮 Filters</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price Range:</label>
            <select
              className="w-full border rounded p-2"
              value={priceFilter}
              onChange={handlePriceChange}
            >
              <option value="all">All</option>
              <option value="low">₹0 - ₹300</option>
              <option value="mid">₹301 - ₹600</option>
              <option value="high">₹601+</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
