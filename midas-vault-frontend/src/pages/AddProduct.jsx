import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: 'good',
    price: '',
    image: null,

    // Barter & Trade-in fields
    allow_barter: false,
    barter_preferences: '',
    allow_trade_in: false,
    trade_in_value: '',
    trade_in_preferences: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      alert('Admin tidak bisa upload produk');
      navigate('/admin');
      return;
    }
  }, [navigate]);

  const categories = ['Fashion', 'Electronics', 'Books', 'Hobbies', 'Home', 'Other'];

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

    // Validasi manual di frontend
    if (!formData.name.trim()) {
      setError('Nama produk wajib diisi');
      setLoading(false);
      return;
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      setError('Deskripsi minimal 10 karakter');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Kategori wajib dipilih');
      setLoading(false);
      return;
    }

    if (!formData.price || formData.price < 1000) {
      setError('Harga minimal Rp 1.000');
      setLoading(false);
      return;
    }

    if (!formData.image) {
      setError('Gambar produk wajib diupload');
      setLoading(false);
      return;
    }


    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('condition', formData.condition);
      submitData.append('price', formData.price);      
      submitData.append('allow_barter', formData.allow_barter ? '1' : '0');
      submitData.append('barter_preferences', formData.barter_preferences || '');
      submitData.append('allow_trade_in', formData.allow_trade_in ? '1' : '0');
      submitData.append('trade_in_value', formData.trade_in_value || '');
      submitData.append('trade_in_preferences', formData.trade_in_preferences || '');
      
    if (formData.image) {
          submitData.append('image', formData.image);
        }

        console.log('Data yang dikirim:', {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          price: formData.price,
          allow_barter: formData.allow_barter,
          allow_trade_in: formData.allow_trade_in,
        });

        await productAPI.create(submitData);
        alert('Produk berhasil diupload! Menunggu verifikasi admin.');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error response:', error.response);
        if (error.response?.data?.errors) {
          // Tampilkan error validasi dari backend
          const errorMessages = Object.values(error.response.data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(error.response?.data?.message || 'Gagal upload produk');
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-midas-dark mb-6">Upload Produk</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ========================
                BASIC PRODUCT FIELDS
            ========================= */}
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
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
                placeholder="Contoh: Jaket Hoodie"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
                placeholder="Jelaskan kondisi produk..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
                >
                  <option value="excellent">Sangat Baik</option>
                  <option value="good">Baik</option>
                  <option value="fair">Cukup</option>
                  <option value="poor">Kurang Baik</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harga (Rp) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1000"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
                placeholder="Contoh: 250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Produk *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!formData.image}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
              />
            </div>

            {/* =========================
                BARTER OPTION
            ========================== */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-midas-dark mb-4">⚖️ Opsi Barter</h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allow_barter"
                  name="allow_barter"
                  checked={formData.allow_barter}
                  onChange={handleChange}
                  className="w-4 h-4 text-midas-gold"
                />
                <label htmlFor="allow_barter" className="ml-2">Izinkan penawaran barter</label>
              </div>

              {formData.allow_barter && (
                <div>
                  <label className="block mb-2">Preferensi Barter</label>
                  <textarea
                    name="barter_preferences"
                    value={formData.barter_preferences}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-midas-gold"
                    placeholder="Produk apa yang Anda inginkan?"
                  />
                </div>
              )}
            </div>

            {/* =========================
                TRADE-IN OPTION
            ========================== */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-midas-dark mb-4">🔄 Opsi Tukar Tambah</h3>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allow_trade_in"
                  name="allow_trade_in"
                  checked={formData.allow_trade_in}
                  onChange={handleChange}
                  className="w-4 h-4 text-midas-gold"
                />
                <label htmlFor="allow_trade_in" className="ml-2">Izinkan tukar tambah</label>
              </div>

              {formData.allow_trade_in && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2">Nilai Tukar Tambah (Rp)</label>
                    <input
                      type="number"
                      name="trade_in_value"
                      value={formData.trade_in_value}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-midas-gold"
                      placeholder="Kosongkan untuk default (70%)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Nilai default:  
                      <strong>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
                          .format((formData.price || 0) * 0.7)}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2">Preferensi Tukar Tambah</label>
                    <textarea
                      name="trade_in_preferences"
                      rows={3}
                      value={formData.trade_in_preferences}
                      onChange={handleChange}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-midas-gold"
                      placeholder="Produk apa yang Anda terima?"
                    />
                  </div>
                </>
              )}
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-midas-gold text-midas-dark py-3 rounded-xl hover:bg-yellow-500 transition disabled:opacity-50"
              >
                {loading ? 'Mengupload...' : 'Upload Produk'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
