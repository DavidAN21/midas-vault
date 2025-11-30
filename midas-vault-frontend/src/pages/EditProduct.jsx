import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';

const EditProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: 'good',
    price: '',
    image: null,
    allow_barter: false,
    barter_preferences: '',
    allow_trade_in: false,
    trade_in_value: '',
    trade_in_preferences: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const categories = ['Fashion', 'Electronics', 'Books', 'Hobbies', 'Home', 'Other'];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data.data;
      
      if (product.user_id !== user.id && user.role !== 'admin') {
        alert('Anda tidak memiliki akses untuk mengedit produk ini');
        navigate('/dashboard');
        return;
      }

      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        condition: product.condition,
        price: product.price,
        image: null,
        allow_barter: product.allow_barter || false,
        barter_preferences: product.barter_preferences || '',
        allow_trade_in: product.allow_trade_in || false,
        trade_in_value: product.trade_in_value || '',
        trade_in_preferences: product.trade_in_preferences || '',
      });

      // Set image preview from existing product
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('condition', formData.condition);
      submitData.append('price', formData.price);
      
      submitData.append('allow_barter', formData.allow_barter ? 1 : 0);
      submitData.append('barter_preferences', formData.barter_preferences || '');
      submitData.append('allow_trade_in', formData.allow_trade_in ? 1 : 0);
      submitData.append('trade_in_value', formData.trade_in_value || '');
      submitData.append('trade_in_preferences', formData.trade_in_preferences || '');
      
      submitData.append('_method', 'PUT');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await productAPI.update(id, submitData);
      
      if (response.data.success) {
        alert('Produk berhasil diupdate!');
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Gagal update produk');
      }
    } catch (error) {
      console.error('Update error:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(error.response?.data?.message || 'Gagal update produk');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const response = await productAPI.delete(id);
        
        if (response.data.success) {
          alert('Produk berhasil dihapus!');
          navigate('/dashboard');
        } else {
          throw new Error(response.data.message || 'Gagal menghapus produk');
        }
      } catch (error) {
        console.error('Delete error:', error);
        
        if (error.response?.status === 422) {
          alert(error.response.data.message || 'Produk tidak dapat dihapus karena memiliki riwayat transaksi');
        } else {
          alert('Gagal menghapus produk: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Edit Produk
          </h1>
          <p className="text-xl text-gray-600">
            Perbarui informasi produk Anda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Product Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span>Informasi Produk</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Nama Produk *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white"
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Deskripsi *</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white resize-none"
                    placeholder="Jelaskan detail produk, kondisi, dan kelebihan produk..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Kategori *</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Kondisi *</span>
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white"
                    >
                      <option value="excellent">✨ Sangat Baik</option>
                      <option value="good">👍 Baik</option>
                      <option value="fair">✅ Cukup</option>
                      <option value="poor">🔧 Kurang Baik</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Harga (Rp) *</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1000"
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white"
                    placeholder="Masukkan harga produk"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-midas-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Gambar Produk</span>
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-midas-gold focus:ring-2 focus:ring-midas-gold/20 transition-all duration-300 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-midas-gold file:text-midas-dark hover:file:bg-yellow-500"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Preview Gambar:</p>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded-2xl border-2 border-gray-200 shadow-md"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Kosongkan jika tidak ingin mengubah gambar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barter Option */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span>Opsi Barter</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allow_barter"
                    name="allow_barter"
                    checked={formData.allow_barter}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="allow_barter" className="text-lg font-semibold text-gray-700">
                    Izinkan penawaran barter untuk produk ini
                  </label>
                </div>

                {formData.allow_barter && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Preferensi Barter
                    </label>
                    <textarea
                      name="barter_preferences"
                      value={formData.barter_preferences}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border-2 border-purple-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 bg-white resize-none"
                      placeholder="Jelaskan jenis produk apa yang Anda inginkan untuk ditukar (contoh: elektronik, fashion, dll)..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Trade-In Option */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 border border-orange-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <span>Opsi Tukar Tambah</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="allow_trade_in"
                    name="allow_trade_in"
                    checked={formData.allow_trade_in}
                    onChange={handleChange}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="allow_trade_in" className="text-lg font-semibold text-gray-700">
                    Izinkan tukar tambah untuk produk ini
                  </label>
                </div>

                {formData.allow_trade_in && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nilai Tukar Tambah (Rp)
                      </label>
                      <input
                        type="number"
                        name="trade_in_value"
                        value={formData.trade_in_value}
                        onChange={handleChange}
                        className="w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
                        placeholder="Kosongkan untuk menggunakan nilai default"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Nilai default: {' '}
                        <span className="font-bold text-midas-gold">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                            .format((formData.price || 0))}
                        </span>
                        {' '}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Preferensi Tukar Tambah
                      </label>
                      <textarea
                        name="trade_in_preferences"
                        rows={3}
                        value={formData.trade_in_preferences}
                        onChange={handleChange}
                        className="w-full border-2 border-orange-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white resize-none"
                        placeholder="Jelaskan jenis produk apa yang Anda terima untuk tukar tambah..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Batal</span>
              </button>

              

              <button
                type="submit"
                disabled={loading}
                className="flex-1 group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark py-4 rounded-2xl font-bold hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-midas-dark border-t-transparent rounded-full animate-spin"></div>
                    <span className="relative">Mengupdate...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="relative">Update Produk</span>
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

export default EditProduct;