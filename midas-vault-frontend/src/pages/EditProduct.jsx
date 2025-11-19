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
    // Tambah field baru
    allow_barter: false,
    barter_preferences: '',
    allow_trade_in: false,
    trade_in_value: '',
    trade_in_preferences: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      
      // Cek apakah user adalah pemilik produk
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
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
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
      
      // Convert boolean to 1/0 for Laravel
      submitData.append('allow_barter', formData.allow_barter ? 1 : 0);
      submitData.append('barter_preferences', formData.barter_preferences || '');
      submitData.append('allow_trade_in', formData.allow_trade_in ? 1 : 0);
      submitData.append('trade_in_value', formData.trade_in_value || '');
      submitData.append('trade_in_preferences', formData.trade_in_preferences || '');
      
      submitData.append('_method', 'PUT');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log('Sending update data:'); // Debug
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      const response = await productAPI.update(id, submitData);
      console.log('Update response:', response); // Debug
      
      if (response.data.success) {
        alert('Produk berhasil diupdate!');
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Gagal update produk');
      }
    } catch (error) {
      console.error('Update error:', error); // Debug
      setError(error.response?.data?.message || 'Gagal update produk');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await productAPI.delete(id);
        alert('Produk berhasil dihapus!');
        navigate('/dashboard');
      } catch (error) {
        alert('Gagal menghapus produk');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-midas-dark mb-6">Edit Produk</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Product Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kondisi *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
                >
                  <option value="excellent">Sangat Baik</option>
                  <option value="good">Baik</option>
                  <option value="fair">Cukup</option>
                  <option value="poor">Kurang Baik</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga (Rp) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1000"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              />
            </div>

            {/* Section Barter */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-midas-dark mb-4">⚖️ Opsi Barter</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow_barter"
                    name="allow_barter"
                    checked={formData.allow_barter}
                    onChange={handleChange}
                    className="w-4 h-4 text-midas-gold border-gray-300 rounded focus:ring-midas-gold"
                  />
                  <label htmlFor="allow_barter" className="ml-2 text-sm font-medium text-gray-700">
                    Izinkan penawaran barter untuk produk ini
                  </label>
                </div>

                {formData.allow_barter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferensi Barter
                    </label>
                    <textarea
                      name="barter_preferences"
                      value={formData.barter_preferences}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
                      placeholder="Jenis produk apa yang Anda inginkan untuk barter? (Contoh: Saya tertarik dengan elektronik, sepatu, atau buku)"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section Tukar Tambah */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-midas-dark mb-4">🔄 Opsi Tukar Tambah</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow_trade_in"
                    name="allow_trade_in"
                    checked={formData.allow_trade_in}
                    onChange={handleChange}
                    className="w-4 h-4 text-midas-gold border-gray-300 rounded focus:ring-midas-gold"
                  />
                  <label htmlFor="allow_trade_in" className="ml-2 text-sm font-medium text-gray-700">
                    Izinkan penawaran tukar tambah untuk produk ini
                  </label>
                </div>

                {formData.allow_trade_in && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Tukar Tambah (Rp) - Kosongkan untuk nilai default
                    </label>
                    <input
                      type="number"
                      name="trade_in_value"
                      value={formData.trade_in_value}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
                      placeholder="Kosongkan untuk nilai default (70% dari harga)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Nilai default: 70% dari harga jual ({new Intl.NumberFormat('id-ID', { 
                        style: 'currency', 
                        currency: 'IDR' 
                      }).format(formData.price * 0.7)})
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Produk (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-midas-gold"
              />
              <p className="text-sm text-gray-500 mt-1">
                Kosongkan jika tidak ingin mengubah gambar
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Hapus Produk
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-midas-gold text-midas-dark py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Mengupdate...' : 'Update Produk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;