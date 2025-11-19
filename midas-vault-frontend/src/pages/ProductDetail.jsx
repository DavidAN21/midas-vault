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

  if (loading) return <Loader />;
  if (!product) return <div>Produk tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Gambar Produk */}
            <div>
              <img
                src={product.image_url || '/images/default-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Info Produk */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-midas-dark mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {product.verified_at && (
                    <span className="bg-midas-gold text-midas-dark px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Verified
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                    product.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                    product.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getConditionText(product.condition)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-midas-gold mb-4">
                  {formatPrice(product.price)}
                </p>

                {/* Fitur Tersedia */}
                <div className="flex space-x-2 mb-4">
                  {product.allow_barter && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⚖️ Barter
                    </span>
                  )}
                  {product.allow_trade_in && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      🔄 Tukar Tambah
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Deskripsi Produk</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Preferensi Barter */}
                {product.allow_barter && product.barter_preferences && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">💡 Preferensi Barter</h4>
                    <p className="text-purple-700 text-sm">{product.barter_preferences}</p>
                  </div>
                )}

                {/* Preferensi Tukar Tambah */}
                {product.allow_trade_in && product.trade_in_preferences && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">💡 Preferensi Tukar Tambah</h4>
                    <p className="text-orange-700 text-sm">{product.trade_in_preferences}</p>
                    <p className="text-orange-600 text-sm mt-1">
                      <strong>Nilai Tukar:</strong> {formatPrice(product.trade_in_value || product.price * 0.7)}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Kategori:</span>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <p className={`font-semibold ${
                      product.status === 'available' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.status === 'available' ? 'Tersedia' : 'Terjual'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Penjual</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-midas-gold rounded-full flex items-center justify-center">
                      <span className="font-semibold text-midas-dark">
                        {product.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{product.user?.name}</p>
                      <p className="text-sm text-gray-500">Reputasi: {product.user?.reputation_score}/5.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="space-y-3 pt-4">
                {/* Tombol Beli Langsung */}
                <button
                  onClick={handleBuy}
                  disabled={actionLoading || product.status !== 'available' || user.id === product.user_id}
                  className="w-full bg-midas-gold text-midas-dark py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Memproses...' : 
                   product.status !== 'available' ? 'Terjual' :
                   user.id === product.user_id ? 'Produk Anda' : `Beli Sekarang - ${formatPrice(product.price)}`}
                </button>

                {/* Tombol Barter */}
                {product.allow_barter && product.status === 'available' && user.id && user.id !== product.user_id && (
                  <button
                    onClick={() => setShowBarterModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    ⚖️ Ajukan Barter
                  </button>
                )}

                {/* Tombol Tukar Tambah */}
                {product.allow_trade_in && product.status === 'available' && user.id && user.id !== product.user_id && (
                  <button
                    onClick={() => setShowTradeInModal(true)}
                    disabled={actionLoading}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    🔄 Ajukan Tukar Tambah
                  </button>
                )}

                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Kembali ke Marketplace
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
