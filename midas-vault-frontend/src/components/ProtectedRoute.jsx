import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [], isAuthRoute = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  // Jika ini adalah route untuk authentication (login/register)
  if (isAuthRoute) {
    // Jika user sudah login, redirect ke halaman sesuai role
    if (token && user.id) {
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
    // Jika belum login, izinkan akses ke login/register
    return children;
  }

  // Jika ini adalah protected route biasa
  // Cek apakah user sudah login
  if (!token || !user.id) {
    // Redirect ke login dengan menyimpan URL asal
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect ke halaman sesuai role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Admin tidak boleh akses barter dan trade-in
  if (user.role === 'admin') {
    const blockedRoutes = ['/barter', '/trade-in'];
    if (blockedRoutes.some(route => location.pathname.startsWith(route))) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;