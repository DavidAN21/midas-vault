import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
      excellent: 'from-blue-500 to-cyan-400 text-white',
      good: 'from-emerald-500 to-green-400 text-white',
      fair: 'from-amber-500 to-yellow-400 text-white',
      poor: 'from-red-500 to-orange-400 text-white',
    };
    return colors[condition] || 'from-gray-500 to-gray-400 text-white';
  };

  const getConditionIcon = (condition) => {
    const icons = {
      excellent: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      good: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      fair: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      poor: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[condition] || icons.fair;
  };

  const getStatusColor = () => {
    if (product.status !== 'available') return 'bg-red-500 text-white';
    if (product.verification_status !== 'approved') return 'bg-yellow-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getStatusIcon = () => {
    if (product.status !== 'available') {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    if (product.verification_status !== 'approved') {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-midas-gold/30 hover:scale-105">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-w-16 aspect-h-12 h-60 relative">
          {/* Skeleton Loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          )}
          
          <img
            src={product.image_url || '/images/default-product.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error('Image failed to load:', product.image_url);
              e.target.src = '/images/default-product.jpg';
              setImageLoaded(true);
            }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Top Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
            {/* Verified Badge */}
            {product.verification_status === 'approved' && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Verified</span>
              </div>
            )}

            {/* Condition Badge */}
            <div className={`bg-gradient-to-r ${getConditionColor(product.condition)} px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1`}>
              {getConditionIcon(product.condition)}
              <span>
                {product.condition === 'excellent'
                  ? 'Sangat Baik'
                  : product.condition === 'good'
                  ? 'Baik'
                  : product.condition === 'fair'
                  ? 'Cukup'
                  : 'Kurang Baik'}
              </span>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getStatusColor()} flex items-center space-x-1`}>
              {getStatusIcon()}
              <span>
                {product.status !== 'available' ? 'Terjual' : product.verification_status !== 'approved' ? 'Pending' : 'Tersedia'}
              </span>
            </div>
          </div>

          {/* Bottom Badges Container */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {/* Barter Badge */}
            {product.allow_barter && (
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <span>Barter</span>
              </div>
            )}

            {/* Trade-In Badge */}
            {product.allow_trade_in && (
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <span>Trade-In</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Product Title */}
        <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-midas-dark transition-colors duration-300">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Category */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* Seller and Date Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-midas-gold rounded-full"></div>
            <span>By: {product.user?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 group/btn bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-center py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Detail</span>
          </button>

          <button
            onClick={handleBuy}
            disabled={
              loading ||
              product.status !== 'available' ||
              user.id === product.user_id ||
              isAdmin ||
              product.verification_status !== 'approved'
            }
            className="flex-1 group/btn bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark text-center py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale flex items-center justify-center space-x-2 relative overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-midas-dark border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : product.status !== 'available' ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Terjual</span>
              </>
            ) : user.id === product.user_id ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Produk Anda</span>
              </>
            ) : isAdmin ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>Admin</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Beli Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;