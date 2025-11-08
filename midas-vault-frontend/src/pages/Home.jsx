import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Tambah navigate
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Tambah user

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ verified: 'true', limit: 6 });
      setFeaturedProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi handle mulai jual
  const handleStartSelling = () => {
    if (user.id) {
      // Jika sudah login, langsung ke upload produk
      navigate('/add-product');
    } else {
      // Jika belum login, ke register
      navigate('/register');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="gold-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-midas-dark mb-6">
            Ubah Barang Bekas Jadi <span className="text-white">Emas</span>
          </h1>
          <p className="text-xl text-midas-dark mb-8 max-w-2xl mx-auto">
            Platform thrifting terpercaya untuk jual beli, barter, dan tukar tambah barang preloved. 
            Aman, mudah, dan menguntungkan!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Ganti Link dengan button */}
            <button
              onClick={handleStartSelling}
              className="bg-midas-dark text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-black transition-colors"
            >
              Mulai Jual
            </button>
            <Link
              to="/marketplace"
              className="bg-white text-midas-dark px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors text-center"
            >
              Telusuri Barang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-midas-dark mb-4">Kenapa Pilih Midas Vault?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform lengkap dengan berbagai fitur untuk memenuhi semua kebutuhan thrifting Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-midas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jual Beli Aman</h3>
              <p className="text-gray-600">
                Sistem escrow melindungi transaksi Anda. Dana baru diteruskan ke seller setelah barang diterima.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-midas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Barter Mudah</h3>
              <p className="text-gray-600">
                Tukar barang dengan pengguna lain tanpa uang. Cukup pilih barang dan ajukan barter.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-midas-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tukar Tambah</h3>
              <p className="text-gray-600">
                Upgrade barang lama dengan tambahan biaya. Dapatkan barang baru dengan harga lebih terjangkau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-midas-dark mb-4">Barang Unggulan</h2>
            <p className="text-gray-600">Produk pilihan yang sudah terverifikasi kualitasnya</p>
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
          
          <div className="text-center mt-8">
            <Link
              to="/marketplace"
              className="bg-midas-gold text-midas-dark px-6 py-3 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors"
            >
              Lihat Semua Barang
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-midas-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mulai Thrifting?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas Midas Vault dan temukan barang-barang berkualitas dengan harga terjangkau
          </p>
          <Link
            to="/register"
            className="bg-midas-gold text-midas-dark px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-yellow-500 transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;