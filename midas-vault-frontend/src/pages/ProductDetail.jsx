import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, transactionAPI, barterAPI, tradeInAPI } from '../services/api';
import Loader from '../components/Loader';
import BarterModal from '../components/BarterModal';
import TradeInModal from '../components/TradeInModal';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showBarterModal, setShowBarterModal] = useState(false);
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Cek apakah user adalah admin
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Produk tidak ditemukan');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    // Blokir admin dari pembelian
    if (isAdmin) {
      alert('Admin tidak dapat melakukan pembelian. Silakan gunakan akun user biasa.');
      return;
    }

    if (!user.id) {
      alert('Silakan login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (user.id === product.user_id) {
      alert('Tidak bisa membeli produk sendiri!');
      return;
    }

    if (product.status !== 'available') {
      alert('Produk sudah tidak tersedia!');
      return;
    }

    // Warning untuk produk pending
    if (product.verification_status === 'pending') {
      const confirmMessage = `⚠️ PERINGATAN!\n\nProduk "${product.name}" BELUM TERVERIFIKASI oleh admin.\n\n✅ Anda tetap bisa membeli, tapi:\n• Produk belum dicek kualitas dan keasliannya\n• Admin akan memverifikasi sebelum transaksi lanjut\n• Mungkin ada penundaan proses verifikasi\n\nLanjutkan pembelian?`;
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    // Warning untuk produk rejected
    if (product.verification_status === 'rejected') {
      alert('❌ Produk ini telah ditolak dan tidak dapat dibeli!');
      return;
    }

    if (confirm(`Beli "${product.name}" seharga ${formatPrice(product.price)}?`)) {
      setActionLoading(true);
      try {
        await transactionAPI.create({ product_id: product.id });
        alert('✅ Transaksi berhasil! Produk masuk sistem escrow.');
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal melakukan transaksi');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleBarterClick = () => {
    if (product.verification_status === 'pending') {
      alert('Produk belum terverifikasi. Barter tidak tersedia untuk produk pending.');
      return;
    }
    
    setShowBarterModal(true);
  };

  const handleTradeInClick = () => {
    if (product.verification_status === 'pending') {
      alert('Produk belum terverifikasi. Tukar tambah tidak tersedia untuk produk pending.');
      return;
    }
    
    setShowTradeInModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionText = (condition) => {
    const conditions = {
      excellent: 'Sangat Baik',
      good: 'Baik', 
      fair: 'Cukup',
      poor: 'Kurang Baik'
    };
    return conditions[condition] || condition;
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
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      good: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      fair: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      poor: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[condition] || icons.fair;
  };

  const getVerificationBadge = () => {
    switch(product.verification_status) {
      case 'approved':
        return (
          <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Terverifikasi</span>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-gradient-to-r from-yellow-500 to-amber-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Menunggu Verifikasi</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-gradient-to-r from-red-500 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            <span>Ditolak</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div>Produk tidak ditemukan</div>;

  // Cek apakah user bisa melakukan transaksi (bukan admin)
  const canPerformTransaction = user.id && user.role !== 'admin' && user.id !== product.user_id;
  
  // Cek apakah produk tersedia untuk transaksi
  const isProductAvailable = product.status === 'available';
  
  // Cek status verifikasi produk
  const isProductVerified = product.verification_status === 'approved';
  const isProductPending = product.verification_status === 'pending';
  const isProductRejected = product.verification_status === 'rejected';

  // Cek apakah barter dan trade-in tersedia (hanya untuk produk verified)
  const isBarterAvailable = product.allow_barter && isProductVerified;
  const isTradeInAvailable = product.allow_trade_in && isProductVerified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Gambar Produk */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                )}
                <img
                  src={product.image_url || '/images/default-product.jpg'}
                  alt={product.name}
                  className={`w-full h-96 object-cover transition-all duration-700 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = '/images/default-product.jpg';
                    setImageLoaded(true);
                  }}
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {/* Admin Badge */}
                  {isAdmin && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>Admin View</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fitur Tersedia */}
              <div className="flex flex-wrap gap-3">

                {product.allow_barter && (
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <span>Barter</span>
                    {isProductPending && (
                      <span className="text-yellow-200 text-xs ml-1">(Pending)</span>
                    )}
                  </div>
                )}
                {product.allow_trade_in && (
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>Tukar Tambah</span>
                    {isProductPending && (
                      <span className="text-yellow-200 text-xs ml-1">(Pending)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Warning untuk produk pending */}
              {isProductPending && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold text-yellow-800">Produk Belum Diverifikasi</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Produk ini sedang menunggu verifikasi admin. 
                        <span className="font-semibold"> Hanya pembelian yang tersedia.</span> 
                        Barter dan tukar tambah hanya tersedia untuk produk yang sudah diverifikasi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning untuk produk rejected */}
              {isProductRejected && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-bold text-red-800">Produk Ditolak</p>
                      <p className="text-sm text-red-600 mt-1">
                        Produk ini telah ditolak oleh admin dan tidak dapat dibeli, ditukar, atau ditawar.
                        Silakan hubungi penjual untuk informasi lebih lanjut.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Produk */}
            <div className="space-y-6">
            {/* Status Badges di bawah nama produk */}
              <div className="flex flex-wrap gap-3 mb-4">
                {/* Verification Status Badge */}
                {getVerificationBadge()}
                
                {/* Condition Badge */}
                <div className={`bg-gradient-to-r ${getConditionColor(product.condition)} px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2`}>
                  {getConditionIcon(product.condition)}
                  <span>{getConditionText(product.condition)}</span>
                </div>

                {/* Status Badge */}
                <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  product.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                } flex items-center space-x-2`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {product.status === 'available' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span>{product.status === 'available' ? 'Tersedia' : 'Terjual'}</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
                  {product.name}
                </h1>
                
                <p className="text-3xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent mb-6">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Deskripsi Produk</span>
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Preferensi Barter - hanya tampilkan jika verified */}
                {isBarterAvailable && product.barter_preferences && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span>Preferensi Barter</span>
                    </h4>
                    <p className="text-purple-700 text-sm leading-relaxed">{product.barter_preferences}</p>
                  </div>
                )}

                {/* Preferensi Tukar Tambah - hanya tampilkan jika verified */}
                {isTradeInAvailable && product.trade_in_preferences && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-200 rounded-2xl p-6">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span>Preferensi Tukar Tambah</span>
                    </h4>
                    <p className="text-orange-700 text-sm leading-relaxed mb-2">{product.trade_in_preferences}</p>
                    <p className="text-orange-600 text-sm font-semibold">
                      Nilai Tukar: {formatPrice(product.trade_in_value || product.price)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="font-semibold text-gray-700 block mb-1">Kategori</span>
                    <p className="text-gray-600 font-medium capitalize">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="font-semibold text-gray-700 block mb-1">Status</span>
                    <p className={`font-semibold ${
                      product.status === 'available' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {product.status === 'available' ? 'Tersedia' : 'Terjual'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-midas-gold/10 to-yellow-500/10 rounded-2xl p-6 border border-midas-gold/20">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-midas-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Informasi Penjual</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-midas-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="font-bold text-midas-dark text-lg">
                        {product.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.user?.name}</p>
                      <p className="text-sm text-gray-600 flex items-center space-x-1">
                        <svg className="w-4 h-4 text-midas-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Reputasi: {product.user?.reputation_score || '5.0'}/5.0</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="space-y-4 pt-6">
                {/* Admin Warning Message */}
                {isAdmin && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-700">Mode Administrator</p>
                        <p className="text-sm text-red-600">Admin tidak dapat melakukan transaksi, barter, atau tukar tambah.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Beli Langsung */}
                <button
                  onClick={handleBuy}
                  disabled={
                    actionLoading || 
                    product.status !== 'available' || 
                    user.id === product.user_id || 
                    isAdmin ||
                    isProductRejected
                  }
                  className="w-full group/btn bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark py-4 rounded-2xl font-bold hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {actionLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-midas-dark border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </>
                    ) : product.status !== 'available' ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Terjual</span>
                      </>
                    ) : user.id === product.user_id ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>Produk Anda</span>
                      </>
                    ) : isAdmin ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Admin Tidak Dapat Membeli</span>
                      </>
                    ) : isProductRejected ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        <span>Produk Ditolak</span>
                      </>
                    ) : isProductPending ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Beli (Menunggu Verifikasi)</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Beli Sekarang - {formatPrice(product.price)}</span>
                      </>
                    )}
                  </div>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tombol Barter - Hanya enabled jika produk verified */}
                  {product.allow_barter && isProductAvailable && canPerformTransaction && !isProductRejected && (
                    <button
                      onClick={handleBarterClick}
                      disabled={actionLoading || isAdmin || isProductPending}
                      className="group/btn bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="relative">
                        {isProductPending ? 'Barter (Pending)' : 'Ajukan Barter'}
                      </span>
                    </button>
                  )}

                  {/* Tombol Tukar Tambah - Hanya enabled jika produk verified */}
                  {product.allow_trade_in && isProductAvailable && canPerformTransaction && !isProductRejected && (
                    <button
                      onClick={handleTradeInClick}
                      disabled={actionLoading || isAdmin || isProductPending}
                      className="group/btn bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="relative">
                        {isProductPending ? 'Tukar (Pending)' : 'Tukar Tambah'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Admin Navigation Button */}
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full group/btn bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Kembali ke Admin Dashboard</span>
                  </button>
                )}

                {/* Back to Marketplace Button (for non-admin) */}
                {!isAdmin && (
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="w-full group/btn bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Kembali ke Marketplace</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Barter */}
      {showBarterModal && (
        <BarterModal 
          product={product}
          onClose={() => setShowBarterModal(false)}
          onSuccess={() => {
            setShowBarterModal(false);
            alert('Penawaran barter berhasil dikirim!');
            navigate('/dashboard');
          }}
        />
      )}

      {/* Modal Tukar Tambah */}
      {showTradeInModal && (
        <TradeInModal 
          product={product}
          onClose={() => setShowTradeInModal(false)}
          onSuccess={() => {
            setShowTradeInModal(false);
            alert('Penawaran tukar tambah berhasil dikirim!');
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;