import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);

  // ✅ Hanya produk verified yang bisa dibeli
  const handleBuy = async () => {
    if (!user.id) {
      alert('Silakan login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (user.id === product.user_id) {
      alert('Tidak bisa membeli produk sendiri!');
      return;
    }

    if (product.verification_status !== 'approved') {
      alert('Produk ini belum terverifikasi!');
      return;
    }

    if (product.status !== 'available') {
      alert('Produk sudah tidak tersedia!');
      return;
    }

    if (confirm(`Beli "${product.name}" seharga ${formatPrice(product.price)}?`)) {
      setLoading(true);
      try {
        const response = await transactionAPI.create({
          product_id: product.id
        });
        alert('✅ Transaksi berhasil! Produk masuk sistem escrow.');
        window.location.reload();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal melakukan transaksi');
      } finally {
        setLoading(false);
      }
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={product.image_url || '/images/default-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />

        {/* Verified Badge */}
        {product.verification_status === 'approved' && (
          <div className="absolute top-2 right-2 bg-midas-gold text-midas-dark px-2 py-1 rounded-full text-xs font-semibold">
            ✓ Verified
          </div>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}
          >
            {product.condition === 'excellent'
              ? 'Sangat Baik'
              : product.condition === 'good'
              ? 'Baik'
              : product.condition === 'fair'
              ? 'Cukup'
              : 'Kurang Baik'}
          </span>
        </div>

        {/* Barter & Trade-In Badges */}
        <div className="absolute top-10 left-2 flex space-x-1">
          {product.allow_barter && (
            <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
              ⚖️ Barter
            </span>
          )}

          {product.allow_trade_in && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
              🔄 Trade-In
            </span>
          )}
        </div>
      </div>


      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-midas-gold">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>By: {product.user?.name}</span>
          <span>{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 bg-gray-200 text-gray-700 text-center py-2 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Detail
          </button>

          <button
            onClick={handleBuy}
            disabled={
              loading ||
              product.status !== 'available' ||
              user.id === product.user_id ||
              isAdmin
            }
            className="flex-1 bg-midas-gold text-midas-dark text-center py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Memproses...'
              : product.status !== 'available'
              ? 'Terjual'
              : user.id === product.user_id
              ? 'Produk Anda'
              : isAdmin
              ? 'Admin'
              : 'Beli Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
