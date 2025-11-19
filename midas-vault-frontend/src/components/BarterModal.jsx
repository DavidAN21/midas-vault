import React, { useState, useEffect } from 'react';
import { barterAPI, productAPI } from '../services/api';
import Loader from './Loader';

const BarterModal = ({ product, onClose, onSuccess }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [notes, setNotes] = useState('');
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
        alert('Pilih produk yang akan ditukar!');
        return;
    }

    setLoading(true);
    try {
        console.log('🔄 Mengajukan barter...');
        console.log('Produk target:', product.id, product.name);
        console.log('Produk saya:', selectedProductId);
        console.log('Notes:', notes);

        const response = await barterAPI.create({
        receiver_product_id: product.id,
        requester_product_id: selectedProductId,
        notes: notes
        });
        
        console.log('✅ Barter berhasil:', response.data);
        onSuccess();
    } catch (error) {
        console.error('❌ Error barter:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || 'Gagal mengajukan barter';
        alert(`❌ ${errorMessage}`);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-midas-dark">⚖️ Ajukan Barter</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Info Produk Target */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Produk yang Anda tuju:</h3>
            <div className="flex items-center space-x-3">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-midas-gold font-bold">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-600">Milik: {product.user?.name}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Produk Sendiri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih produk Anda untuk ditukar:
              </label>
              
              {productsLoading ? (
                <Loader />
              ) : myProducts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>Anda belum memiliki produk yang bisa ditukar</p>
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
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan untuk penjual (opsional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
                placeholder="Tuliskan alasan barter atau penawaran khusus..."
              />
            </div>

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
                className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Ajukan Barter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BarterModal;