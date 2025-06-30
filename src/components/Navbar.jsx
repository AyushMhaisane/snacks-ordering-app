import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const [role, setRole] = useState(null);

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role); // 'buyer' or 'seller'
        }
      }
    };
    fetchUserRole();
  }, [user]);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:text-blue-400">
        POD App
      </Link>

      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-blue-300">Home</Link>

        {/* Orders and Profile for Logged In Users */}
        {user && (
          <>
            <Link to="/orders" className="hover:text-blue-300">🧾 Orders</Link>
            <Link to="/profile" className="hover:text-blue-300 text-xl">👤</Link>
          </>
        )}

        {/* Cart for Buyers Only */}
        {role === 'buyer' && (
          <Link to="/cart" className="relative hover:text-blue-300">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {/* Seller Dashboard for Sellers Only */}
        {role === 'seller' && (
          <Link to="/seller-dashboard" className="hover:text-blue-300">
            📦 My Products
          </Link>
        )}

        {/* Auth Buttons */}
        {!user ? (
          <>
            <Link to="/signup" className="hover:text-blue-300">Sign Up</Link>
            <Link to="/login" className="hover:text-blue-300">Log In</Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-300 hidden sm:inline">
              Hi, {user.email} <span className="text-yellow-300">({role})</span>
            </span>
            <button
              onClick={logout}
              className="hover:text-red-400 text-sm border px-2 py-1 rounded"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
