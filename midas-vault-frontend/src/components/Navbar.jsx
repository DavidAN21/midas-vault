import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Jika admin, sembunyikan menu marketplace dan jual beli
  const isAdmin = user.role === 'admin';

  return (
    <nav className="bg-midas-dark text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-midas-gold rounded-full flex items-center justify-center">
                <span className="text-midas-dark font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl">Midas Vault {isAdmin && "(Admin)"}</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin ? (
              // Menu untuk user biasa
              <>
                <Link to="/" className="hover:text-midas-gold transition-colors">Home</Link>
                <Link to="/marketplace" className="hover:text-midas-gold transition-colors">Marketplace</Link>
                {user.id && user.role === 'seller' && (
                  <Link to="/add-product" className="hover:text-midas-gold transition-colors">Upload Produk</Link>
                )}
              </>
            ) : (
              // Menu khusus admin
              <>
                <Link to="/admin" className="hover:text-midas-gold transition-colors">Dashboard Admin</Link>
                <Link to="/verifications" className="hover:text-midas-gold transition-colors">Verifikasi Produk</Link>
              </>
            )}
            
            {user.id ? (
              <>
                {!isAdmin && (
                  <Link to="/dashboard" className="hover:text-midas-gold transition-colors">Dashboard</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-midas-gold">
                    {isAdmin ? '👑 Admin' : `Hi, ${user.name}`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-midas-gold text-midas-dark px-4 py-2 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-midas-gold transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-midas-gold text-midas-dark px-4 py-2 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-midas-gold focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {!isAdmin ? (
              // Menu mobile untuk user biasa
              <>
                <Link to="/" className="block hover:text-midas-gold transition-colors">Home</Link>
                <Link to="/marketplace" className="block hover:text-midas-gold transition-colors">Marketplace</Link>
                {user.id && user.role === 'seller' && (
                  <Link to="/add-product" className="block hover:text-midas-gold transition-colors">Upload Produk</Link>
                )}
              </>
            ) : (
              // Menu mobile khusus admin
              <>
                <Link to="/admin" className="block hover:text-midas-gold transition-colors">Dashboard Admin</Link>
                <Link to="/verifications" className="block hover:text-midas-gold transition-colors">Verifikasi Produk</Link>
              </>
            )}
            
            {user.id ? (
              <>
                {!isAdmin && (
                  <Link to="/dashboard" className="block hover:text-midas-gold transition-colors">Dashboard</Link>
                )}
                <div className="pt-4 border-t border-gray-600">
                  <span className="block text-midas-gold mb-2">
                    {isAdmin ? '👑 Admin' : `Hi, ${user.name}`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-midas-gold text-midas-dark px-4 py-2 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors w-full"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-600 space-y-2">
                <Link to="/login" className="block hover:text-midas-gold transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="block bg-midas-gold text-midas-dark px-4 py-2 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors text-center"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;