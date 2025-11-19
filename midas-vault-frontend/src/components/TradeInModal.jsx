import React, { useState, useEffect } from 'react';
import { tradeInAPI, productAPI } from '../services/api';
import Loader from './Loader';

const TradeInModal = ({ product, onClose, onSuccess }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await productAPI.getMyProducts();
      // Filter hanya produk yang available dan verified
      const availableProducts = response.data.data.filter(
        p => p.status === 'available' && p.verification_status === 'approved'
      );
      setMyProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Pilih produk yang akan ditukar tambah!');
      return;
    }

    setLoading(true);
    try {
      await tradeInAPI.create({
        new_product_id: product.id,
        old_product_id: selectedProductId,
      });
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengajukan tukar tambah');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const selectedProduct = myProducts.find(p => p.id == selectedProductId);
  const tradeInValue = product.trade_in_value || product.price * 0.7;
  const priceDifference = Math.max(0, product.price - (selectedProduct?.price || 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-midas-dark">🔄 Ajukan Tukar Tambah</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Ringkasan Tukar Tambah */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-3">Ringkasan Tukar Tambah:</h3>
            
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span>Harga produk baru:</span>
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Harga produk Anda:</span>
                        <span className="font-semibold">{formatPrice(selectedProduct?.price || 0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Selisih yang harus dibayar:</span>
                        <span className="text-midas-gold">{formatPrice(priceDifference)}</span>
                    </div>
                    {priceDifference === 0 && (
                        <p className="text-green-600 text-sm text-center">
                            🎉 Tukar tambah tanpa biaya tambahan!
                        </p>
                    )}
                </div>
            </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Produk Sendiri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih produk Anda untuk ditukar tambah:
              </label>
              
              {productsLoading ? (
                <Loader />
              ) : myProducts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>Anda belum memiliki produk yang bisa ditukar tambah</p>
                  <a 
                    href="/add-product" 
                    className="text-midas-gold hover:underline mt-2 inline-block"
                  >
                    Upload produk dulu
                  </a>
                </div>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {myProducts.map(myProduct => (
                    <label 
                      key={myProduct.id}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedProductId === myProduct.id ? 'border-midas-gold bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="product"
                        value={myProduct.id}
                        checked={selectedProductId === myProduct.id}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="text-midas-gold focus:ring-midas-gold"
                      />
                      <img 
                        src={myProduct.image_url} 
                        alt={myProduct.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{myProduct.name}</p>
                        <p className="text-midas-gold text-sm">{formatPrice(myProduct.price)}</p>
                        <p className="text-gray-500 text-xs">
                          Perkiraan nilai tukar: {formatPrice(myProduct.price * 0.7)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Info Produk yang Dipilih */}
            {selectedProduct && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Produk yang Anda pilih:</h4>
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{selectedProduct.name}</p>
                    <p className="text-midas-gold">{formatPrice(selectedProduct.price)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !selectedProductId}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : `Ajukan Tukar Tambah - ${formatPrice(priceDifference)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeInModal;