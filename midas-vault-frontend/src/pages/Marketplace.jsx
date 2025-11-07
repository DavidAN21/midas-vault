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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-midas-dark mb-4">Marketplace</h1>
          <p className="text-gray-600">Temukan barang preloved berkualitas dengan harga terbaik</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Semua Kategori' : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition === 'all' ? 'Semua Kondisi' : condition}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verifikasi</label>
              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Terverifikasi</option>
                <option value="unverified">Belum Terverifikasi</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ category: 'all', condition: 'all', verified: 'all' })}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Menampilkan {products.length} produk
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;