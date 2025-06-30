// src/components/BuyerRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BuyerRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;
  if (role !== 'buyer') return <Navigate to="/" />;

  return children;
};

export default BuyerRoute;
