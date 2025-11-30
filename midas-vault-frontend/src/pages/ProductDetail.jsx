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
    if (!user.id) {
      alert('Silakan login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (user.id === product.user_id) {
      alert('Tidak bisa membeli produk sendiri!');
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

  if (loading) return <Loader />;
  if (!product) return <div>Produk tidak ditemukan</div>;

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
                  </div>
                )}
                {product.allow_trade_in && (
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>Tukar Tambah</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Produk */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
                  {product.name}
                </h1>
                
                {/* Status Badges di bawah nama produk */}
                <div className="flex flex-wrap gap-3 mb-4">

                  {/* Verified Badge */}
                  {product.verified_at && (
                    <div className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}
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

                {/* Preferensi Barter */}
                {product.allow_barter && product.barter_preferences && (
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

                {/* Preferensi Tukar Tambah */}
                {product.allow_trade_in && product.trade_in_preferences && (
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
                {/* Tombol Beli Langsung */}
                <button
                  onClick={handleBuy}
                  disabled={actionLoading || product.status !== 'available' || user.id === product.user_id}
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
                  {/* Tombol Barter */}
                  {product.allow_barter && product.status === 'available' && user.id && user.id !== product.user_id && (
                    <button
                      onClick={() => setShowBarterModal(true)}
                      disabled={actionLoading}
                      className="group/btn bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="relative">Ajukan Barter</span>
                    </button>
                  )}

                  {/* Tombol Tukar Tambah */}
                  {product.allow_trade_in && product.status === 'available' && user.id && user.id !== product.user_id && (
                    <button
                      onClick={() => setShowTradeInModal(true)}
                      disabled={actionLoading}
                      className="group/btn bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <svg className="w-5 h-5 relative" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      <span className="relative">Tukar Tambah</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full group/btn bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Kembali ke Marketplace</span>
                </button>
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