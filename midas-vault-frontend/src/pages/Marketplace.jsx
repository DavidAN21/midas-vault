import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productAPI } from '../services/api';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    verified: 'all',
  });

  const categories = ['all', 'Fashion', 'Electronics', 'Books', 'Hobbies', 'Home', 'Other'];
  const conditions = ['all', 'excellent', 'good', 'fair', 'poor'];

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.condition !== 'all') params.condition = filters.condition;
      if (filters.verified !== 'all') params.verified = filters.verified === 'verified';

      const response = await productAPI.getAll(params);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getConditionText = (condition) => {
    const conditions = {
      excellent: 'Sangat Baik',
      good: 'Baik',
      fair: 'Cukup',
      poor: 'Kurang Baik',
      all: 'Semua Kondisi'
    };
    return conditions[condition] || condition;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-6">
            Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan barang preloved berkualitas dengan harga terbaik dan berbagai pilihan
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <svg className="w-7 h-7 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter Pencarian</span>
            </h2>
            
            <button
              onClick={() => setFilters({ category: 'all', condition: 'all', verified: 'all' })}
              className="group flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Filter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Kategori</span>
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white shadow-sm hover:border-gray-300"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Kondisi Barang</span>
              </label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white shadow-sm hover:border-gray-300"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {getConditionText(condition)}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Status Verifikasi</span>
              </label>
              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white shadow-sm hover:border-gray-300"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Terverifikasi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
            <span className="text-lg font-semibold text-gray-700">
              Menampilkan <span className="text-midas-gold">{products.length}</span> produk
            </span>
          </div>
          
          {!loading && products.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Scroll untuk melihat lebih banyak</span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-200 rounded-full blur-lg opacity-50"></div>
                    <div className="relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-3">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Coba ubah filter pencarian Anda atau sesuaikan kriteria yang diinginkan
                </p>
                <button
                  onClick={() => setFilters({ category: 'all', condition: 'all', verified: 'all' })}
                  className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset Semua Filter</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Load More Section (for future pagination) */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-12">
            <div className="text-gray-500 text-sm mb-4">
              Menampilkan semua produk yang tersedia
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-midas-gold to-yellow-500 rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;