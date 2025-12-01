import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchFeaturedProducts();
    fetchStats();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ verified: 'true', limit: 8 });
      // Filter produk dengan kondisi excellent atau good, dan hanya produk yang terverifikasi
      const filteredProducts = response.data.data
        .filter(product => {
          const condition = product.condition?.toLowerCase();
          const isVerified = product.verification_status === 'approved';
          const isGoodCondition = condition === 'excellent' || condition === 'good';
          
          return isVerified && isGoodCondition;
        })
        .slice(0, 6); // Batasi hanya 6 produk
      setFeaturedProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Simulasi data statistik
    setStats({
      users: 12500,
      products: 8500,
      transactions: 32000
    });
  };

  const handleStartSelling = () => {
    if (user.id) {
      navigate('/add-product');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midas-dark via-gray-900 to-midas-dark py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-midas-gold rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img 
                src="/images/midaslogo.jpg" 
                alt="Midas Vault" 
                className="w-20 h-20 object-contain rounded-full relative z-10 border-4 border-midas-gold/50 shadow-2xl"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-midas-gold bg-clip-text text-transparent">
              Ubah Barang Bekas
            </span>
            <br />
            <span className="bg-gradient-to-r from-midas-gold to-yellow-400 bg-clip-text text-transparent">
              Jadi Emas
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Platform thrifting terpercaya untuk jual beli, barter, dan tukar tambah barang preloved. 
            <span className="text-midas-gold font-semibold"> Aman, mudah, dan menguntungkan!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleStartSelling}
              className="group relative overflow-hidden bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Mulai Jual</span>
              </span>
            </button>
            
            <Link
              to="/marketplace"
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Telusuri Barang</span>
              </span>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-midas-gold mb-2">
                {stats.users.toLocaleString('id-ID')}+
              </div>
              <div className="text-gray-400 text-sm">Pengguna</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-midas-gold mb-2">
                {stats.products.toLocaleString('id-ID')}+
              </div>
              <div className="text-gray-400 text-sm">Produk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-midas-gold mb-2">
                {stats.transactions.toLocaleString('id-ID')}+
              </div>
              <div className="text-gray-400 text-sm">Transaksi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-6">
              Kenapa Pilih Midas Vault?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform lengkap dengan berbagai fitur premium untuk memenuhi semua kebutuhan thrifting Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
              <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Jual Beli Aman</h3>
              <p className="text-gray-600 leading-relaxed">
                Sistem escrow melindungi transaksi Anda. Dana baru diteruskan ke seller setelah barang diterima dan disetujui.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Barter Mudah</h3>
              <p className="text-gray-600 leading-relaxed">
                Tukar barang dengan pengguna lain tanpa uang. Cukup pilih barang yang diinginkan dan ajukan barter dengan mudah.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
              <div className="relative w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tukar Tambah</h3>
              <p className="text-gray-600 leading-relaxed">
                Upgrade barang lama dengan tambahan biaya. Dapatkan barang baru dengan harga lebih terjangkau dan hemat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-midas-dark to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-midas-gold to-yellow-400 bg-clip-text text-transparent">
                Cara Kerja Midas Vault
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Mulai dari daftar hingga transaksi berhasil dalam 4 langkah mudah
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-midas-gold/30"></div>
            
            {[
              { step: "1", title: "Daftar & Verifikasi", desc: "Buat akun dan lengkapi profil Anda", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { step: "2", title: "Upload Produk", desc: "Jual atau tawarkan barang untuk barter", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { step: "3", title: "Transaksi Aman", desc: "Lakukan transaksi dengan sistem escrow", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { step: "4", title: "Selesai!", desc: "Barang diterima dan dana cair", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-midas-gold rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-midas-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-midas-dark font-bold text-xl">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-midas-gold">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl p-2 font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-6">
              Barang Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Produk pilihan premium dengan kondisi sangat bai & baik, serta yang sudah terverifikasi
            </p>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="group relative overflow-hidden bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="relative">Lihat Semua Barang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-midas-dark via-gray-900 to-midas-dark overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Siap Mulai <span className="bg-gradient-to-r from-midas-gold to-yellow-400 bg-clip-text text-transparent">Thrifting?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan komunitas Midas Vault dan temukan barang-barang berkualitas dengan harga terjangkau
          </p>
          <Link
            to="/register"
            className="group relative overflow-hidden bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <svg className="w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="relative">Daftar Sekarang</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;