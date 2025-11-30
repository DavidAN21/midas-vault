import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  // Function untuk mengecek apakah link aktif
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <footer className="bg-gradient-to-r from-midas-dark via-gray-900 to-midas-dark border-t-2 border-midas-gold/30 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-midas-gold/5 to-transparent animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-midas-gold rounded-full blur-md opacity-50 animate-pulse"></div>
                <img 
                  src="/images/midaslogo.jpg" 
                  alt="Midas Vault" 
                  className="w-12 h-12 object-contain rounded-full relative z-10 border-2 border-midas-gold/50 shadow-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl bg-gradient-to-r from-white to-midas-gold bg-clip-text text-transparent">
                  Midas Vault
                </span>
                {isAdmin && (
                  <span className="text-xs text-midas-gold font-semibold bg-midas-dark/50 px-2 py-1 rounded-full border border-midas-gold/30 mt-1">
                    ADMIN MODE
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-lg leading-relaxed">
              Platform thrifting terpercaya yang mengubah barang bekas menjadi emas. 
              Jual, beli, barter, dan tukar tambah barang preloved dengan aman dan mudah.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" ariaLabel="WhatsApp">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.418"/>
              </SocialIcon>
              <SocialIcon href="#" ariaLabel="Facebook">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </SocialIcon>
              <SocialIcon href="#" ariaLabel="Instagram">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </SocialIcon>
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white relative">
              <span className="relative z-10">Quick Links</span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-midas-gold"></div>
            </h3>
            <ul className="space-y-3">
              {!isAdmin ? (
                // Links untuk user biasa
                <>
                  <FooterLink to="/" text="Home" isActive={isActiveRoute('/')} />
                  <FooterLink to="/marketplace" text="Marketplace" isActive={isActiveRoute('/marketplace')} />
                  {user.id && user.role === 'seller' && (
                    <FooterLink to="/add-product" text="Upload Produk" isActive={isActiveRoute('/add-product')} />
                  )}
                  {user.id && (
                    <FooterLink to="/dashboard" text="Dashboard" isActive={isActiveRoute('/dashboard')} />
                  )}
                </>
              ) : (
                // Links untuk admin
                <>
                  <FooterLink to="/admin" text="Dashboard Admin" isActive={isActiveRoute('/admin')} />
                  <FooterLink to="/verifications" text="Verifikasi Produk" isActive={isActiveRoute('/verifications')} />
                </>
              )}
              <FooterLink to="/contact" text="Kontak" isActive={isActiveRoute('/contact')} />
            </ul>
          </div>
          
          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-white relative">
              <span className="relative z-10">Kontak</span>
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-midas-gold"></div>
            </h3>
            <div className="space-y-4">
              <ContactItem 
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                }
                text="hello@midasvault.com"
              />
              <ContactItem 
                icon={
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                }
                text="+62 812-3456-7890"
              />
              <ContactItem 
                icon={
                  <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </>
                  }
                text="Magelang, Jawa Tengah"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-midas-gold/30 py-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              &copy; 2025 Midas Vault. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-midas-gold transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-midas-gold transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-midas-gold transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable Social Icon Component
const SocialIcon = ({ href, ariaLabel, children }) => (
  <a 
    href={href} 
    aria-label={ariaLabel}
    className="relative group p-3 bg-midas-dark/50 rounded-xl border border-midas-gold/20 hover:border-midas-gold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-midas-gold/20"
  >
    <svg className="w-5 h-5 text-gray-300 group-hover:text-midas-gold transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
      {children}
    </svg>
    <div className="absolute inset-0 bg-midas-gold/0 group-hover:bg-midas-gold/10 rounded-xl transition-colors duration-300"></div>
  </a>
);

// Reusable Footer Link Component
const FooterLink = ({ to, text, isActive }) => (
  <li>
    <Link
      to={to}
      className={`group flex items-center space-x-2 transition-all duration-300 ${
        isActive 
          ? 'text-midas-gold font-semibold' 
          : 'text-gray-300 hover:text-midas-gold'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-midas-gold scale-125' 
          : 'bg-gray-500 group-hover:bg-midas-gold group-hover:scale-125'
      }`}></div>
      <span className="relative">
        {text}
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-midas-gold"></div>
        )}
      </span>
    </Link>
  </li>
);

// Reusable Contact Item Component
const ContactItem = ({ icon, text }) => (
  <div className="flex items-center space-x-3 group">
    <div className="p-2 bg-midas-dark/50 rounded-lg border border-midas-gold/20 group-hover:border-midas-gold transition-all duration-300">
      <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm">
      {text}
    </span>
  </div>
);

export default Footer;