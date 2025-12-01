import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Effect untuk handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = user.role === 'admin';

  // Function untuk mengecek apakah link aktif
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-midas-dark/95 via-gray-900/95 to-midas-dark/95 backdrop-blur-lg border-b-2 border-midas-gold/30 shadow-2xl' 
          : 'bg-gradient-to-r from-midas-dark via-gray-900 to-midas-dark border-b-2 border-midas-gold/20 shadow-lg'
      }`}>
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-midas-gold/5 to-transparent animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link 
                to={isAdmin ? "/admin" : "/"} 
                className="flex items-center space-x-3 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className={`relative transition-all duration-500 ${isHovered ? 'rotate-12 scale-110' : ''}`}>
                  <div className="absolute inset-0 bg-midas-gold rounded-full blur-md opacity-50 animate-pulse"></div>
                  <img 
                    src="/images/midaslogo.jpg" 
                    alt="Midas Vault" 
                    className="w-10 h-10 object-contain rounded-full relative z-10 border-2 border-midas-gold/50 shadow-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl bg-gradient-to-r from-white to-midas-gold bg-clip-text text-transparent">
                    Midas Vault
                  </span>
                  {isAdmin && (
                    <span className="text-xs text-midas-gold font-semibold bg-midas-dark/50 px-2 py-1 rounded-full border border-midas-gold/30">
                      ADMIN MODE
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {!isAdmin ? (
                // Menu untuk user biasa
                <>
                  <NavLink to="/" text="Home" isActive={isActiveRoute('/')} />
                  <NavLink to="/marketplace" text="Marketplace" isActive={isActiveRoute('/marketplace')} />
                  {user.id && user.role === 'seller' && (
                    <NavLink to="/add-product" text="Upload Produk" isActive={isActiveRoute('/add-product')} />
                  )}
                </>
              ) : (
                // Menu khusus admin
                <>
                  <NavLink to="/admin" text="Dashboard Admin" isActive={isActiveRoute('/admin')} />
                </>
              )}
              
              {user.id ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-midas-gold/30">
                  {!isAdmin && (
                    <NavLink to="/dashboard" text="Dashboard" isActive={isActiveRoute('/dashboard')} />
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="px-4 py-2 bg-midas-dark/50 rounded-2xl border border-midas-gold/20 backdrop-blur-sm">
                      <span className="text-midas-gold font-semibold text-sm">
                        {isAdmin ? 'Administrator' : user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="group relative overflow-hidden bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-2.5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <NavLink to="/login" text="Login" isActive={isActiveRoute('/login')} />
                  <Link
                    to="/register"
                    className="group relative overflow-hidden bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-2.5 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <span className="relative">Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center bg-midas-dark/50 rounded-lg border border-midas-gold/30 hover:border-midas-gold transition-all duration-300"
              >
                <div className={`w-6 h-0.5 bg-midas-gold transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'}`}></div>
                <div className={`absolute w-6 h-0.5 bg-midas-gold transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-6 h-0.5 bg-midas-gold transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'}`}></div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-6 space-y-4 bg-midas-dark/95 backdrop-blur-lg rounded-2xl border border-midas-gold/20 mt-2 shadow-2xl">
              {!isAdmin ? (
                <>
                  <MobileNavLink 
                    to="/" 
                    text="Home" 
                    isActive={isActiveRoute('/')} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <MobileNavLink 
                    to="/marketplace" 
                    text="Marketplace" 
                    isActive={isActiveRoute('/marketplace')} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  {user.id && user.role === 'seller' && (
                    <MobileNavLink 
                      to="/add-product" 
                      text="Upload Produk" 
                      isActive={isActiveRoute('/add-product')} 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                  )}
                </>
              ) : (
                <>
                  <MobileNavLink 
                    to="/admin" 
                    text="Dashboard Admin" 
                    isActive={isActiveRoute('/admin')} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                </>
              )}
              
              {user.id ? (
                <>
                  {!isAdmin && (
                    <MobileNavLink 
                      to="/dashboard" 
                      text="Dashboard" 
                      isActive={isActiveRoute('/dashboard')} 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                  )}
                  <div className="pt-4 border-t border-midas-gold/30 space-y-4">
                    <div className="px-4 py-3 bg-midas-dark/50 rounded-xl border border-midas-gold/20">
                      <span className="text-midas-gold font-semibold">
                        {isAdmin ? 'Administrator' : `Hi, ${user.name}`}
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark py-3 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-midas-gold/30 space-y-3">
                  <MobileNavLink 
                    to="/login" 
                    text="Login" 
                    isActive={isActiveRoute('/login')} 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark py-3 rounded-2xl font-bold text-center hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 animate-fadeIn">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center border-4 border-red-200">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Konfirmasi Logout
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Apakah Anda yakin ingin keluar dari akun <span className="font-semibold text-midas-dark">{isAdmin ? 'Admin' : user.name}</span>?
                </p>
                
                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleCancelLogout}
                    className="flex-1 group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Batal</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleConfirmLogout}
                    className="flex-1 group bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Ya, Keluar</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <p className="text-center text-sm text-gray-500">
                Anda akan diarahkan ke halaman utama
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Reusable NavLink Component for Desktop dengan active state
const NavLink = ({ to, text, isActive }) => (
  <Link
    to={to}
    className={`relative px-6 py-2.5 font-semibold transition-all duration-300 group ${
      isActive 
        ? 'text-white bg-midas-gold/20 rounded-xl shadow-lg' 
        : 'text-white/90 hover:text-white'
    }`}
  >
    <span className="relative z-10">{text}</span>
    
    {isActive ? (
      // Active state - lebih menonjol seperti hover permanen
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-midas-gold/30 via-midas-gold/40 to-midas-gold/30 rounded-xl"></div>
        <div className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-midas-gold transform -translate-x-1/2"></div>
        <div className="absolute inset-0 border border-midas-gold/50 rounded-xl shadow-gold"></div>
      </>
    ) : (
      // Hover state untuk non-active
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-midas-gold/0 via-midas-gold/10 to-midas-gold/0 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
        <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-midas-gold transform -translate-x-1/2 group-hover:w-4/5 transition-all duration-300"></div>
      </>
    )}
  </Link>
);

// Reusable Mobile NavLink Component dengan active state
const MobileNavLink = ({ to, text, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-6 py-3 font-semibold transition-all duration-300 rounded-xl border-l-4 ${
      isActive
        ? 'text-white bg-midas-gold/20 border-midas-gold pl-8 shadow-inner'
        : 'text-white/90 hover:text-white border-transparent hover:border-midas-gold hover:pl-8 hover:bg-midas-gold/10'
    }`}
  >
    {text}
  </Link>
);

export default Navbar;