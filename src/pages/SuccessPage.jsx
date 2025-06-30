import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
      <p className="text-gray-700 mb-6">
        Thank you for ordering! Your delicious snacks are being prepared 🍟🥤
      </p>

      <div className="space-x-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🏠 Back to Snacks
        </Link>

        <Link
          to="/orders"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📜 View My Orders
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
