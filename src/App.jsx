import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddProductPage from './pages/AddProductPage';


import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import VerifiedProfileRoute from './components/VerifiedProfileRoute';
import BuyerRoute from './components/BuyerRoute';
import OrderHistoryPage from './pages/OrderHistoryPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ✅ Buyer-specific routes */}
        <Route
          path="/"
          element={
            <BuyerRoute>
              <Home />
            </BuyerRoute>
          }
        />
        <Route
        path="/add-product"
        element={
          <PrivateRoute> {/* or SellerRoute if you have one */}
          <AddProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <BuyerRoute>
              <ProductDetails />
            </BuyerRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <BuyerRoute>
                <CartPage />
              </BuyerRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/success"
          element={
            <PrivateRoute>
              <VerifiedProfileRoute>
                <BuyerRoute>
                  <SuccessPage />
                </BuyerRoute>
              </VerifiedProfileRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderHistoryPage />
            </PrivateRoute>
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ✅ Protected Profile Page */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
