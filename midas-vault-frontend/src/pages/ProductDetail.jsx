import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, transactionAPI } from '../services/api';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
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
      setBuyLoading(true);
      try {
        await transactionAPI.create({ product_id: product.id });
        alert('✅ Transaksi berhasil! Produk masuk sistem escrow.');
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal melakukan transaksi');
      } finally {
        setBuyLoading(false);
      }
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const getConditionText = (condition) => {
    const conditions = { excellent: 'Sangat Baik', good: 'Baik', fair: 'Cukup', poor: 'Kurang Baik' };
    return conditions[condition] || condition;
  };

  if (loading) return <Loader />;
  if (!product) return <div>Produk tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <div>
              <img
                src={product.image_url || '/images/default-product.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-midas-dark mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {product.verified_at && (
                    <span className="bg-midas-gold text-midas-dark px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Verified
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.condition === 'excellent'
                        ? 'bg-green-100 text-green-800'
                        : product.condition === 'good'
                        ? 'bg-blue-100 text-blue-800'
                        : product.condition === 'fair'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getConditionText(product.condition)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-midas-gold mb-4">{formatPrice(product.price)}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Deskripsi Produk</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Kategori:</span>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>
                    <p
                      className={`font-semibold ${
                        product.status === 'available' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
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

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleBuy}
                  disabled={buyLoading || product.status !== 'available' || user.id === product.user_id || isAdmin}
                  className="flex-1 bg-midas-gold text-midas-dark py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyLoading
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
