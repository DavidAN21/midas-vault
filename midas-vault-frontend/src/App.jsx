import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Auth Routes - Tidak bisa diakses jika sudah login */}
            <Route path="/login" element={
              <ProtectedRoute isAuthRoute>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute isAuthRoute>
                <Register />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Hanya untuk user yang sudah login */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute allowedRoles={['user']}>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/edit-product/:id" element={
              <ProtectedRoute allowedRoles={['user']}>
                <EditProduct />
              </ProtectedRoute>
            } />
            
            
            {/* Admin Routes - Hanya untuk admin */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/verifications" element={
              <ProtectedRoute allowedRoles={['admin']}>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;