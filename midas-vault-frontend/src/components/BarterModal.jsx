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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Ajukan Barter</h2>
                <p className="text-purple-100 text-sm">Tukar produk dengan milik Anda</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Info Produk Target */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 mb-6">
            <h3 className="font-bold text-purple-800 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Produk yang Anda Tuju</span>
            </h3>
            <div className="flex items-center space-x-4">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl border-2 border-purple-200 shadow-md"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">{product.name}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Milik: {product.user?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Produk Sendiri */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Pilih Produk Anda untuk Ditukar</span>
              </h3>
              
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : myProducts.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-blue-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">Belum ada produk</h4>
                  <p className="text-gray-500 mb-4">Anda belum memiliki produk yang bisa ditukar</p>
                  <a 
                    href="/add-product" 
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Upload Produk</span>
                  </a>
                </div>
              ) : (
                <div className="grid gap-4 max-h-60 overflow-y-auto pr-2">
                  {myProducts.map(myProduct => (
                    <div 
                      key={myProduct.id}
                      className={`relative flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                        selectedProductId === myProduct.id 
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 shadow-lg scale-[1.02]' 
                          : 'border-blue-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedProductId(myProduct.id)}
                    >
                      {/* Selection Indicator */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedProductId === myProduct.id 
                          ? 'border-purple-600 bg-purple-600 shadow-inner' 
                          : 'border-gray-300 bg-white group-hover:border-purple-400'
                      }`}>
                        {selectedProductId === myProduct.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* Product Image */}
                      <img 
                        src={myProduct.image_url} 
                        alt={myProduct.name}
                        className={`w-16 h-16 object-cover rounded-xl border-2 transition-all duration-300 ${
                          selectedProductId === myProduct.id 
                            ? 'border-purple-300 shadow-md' 
                            : 'border-gray-200 group-hover:border-purple-200'
                        }`}
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold transition-colors duration-300 ${
                          selectedProductId === myProduct.id ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {myProduct.name}
                        </p>
                        <p className="text-lg font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
                          {formatPrice(myProduct.price)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            selectedProductId === myProduct.id 
                              ? 'bg-purple-200 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {myProduct.category}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {myProduct.condition === 'excellent' ? 'Sangat Baik' :
                             myProduct.condition === 'good' ? 'Baik' :
                             myProduct.condition === 'fair' ? 'Cukup' : 'Kurang Baik'}
                          </span>
                        </div>
                      </div>

                      {/* Selected Badge */}
                      {selectedProductId === myProduct.id && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Dipilih</span>
                          </div>
                        </div>
                      )}

                      <input
                        type="radio"
                        name="product"
                        value={myProduct.id}
                        checked={selectedProductId === myProduct.id}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="sr-only"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catatan */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Catatan untuk Penjual (Opsional)</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 bg-white resize-none"
                placeholder="Tuliskan alasan barter, penawaran khusus, atau informasi tambahan yang ingin disampaikan kepada penjual..."
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batal</span>
              </button>
              <button
                type="submit"
                disabled={loading || !selectedProductId}
                className={`flex-1 group py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 relative overflow-hidden ${
                  selectedProductId 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="relative">Mengirim...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="relative">
                      {selectedProductId ? 'Ajukan Barter' : 'Pilih Produk Dulu'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BarterModal;