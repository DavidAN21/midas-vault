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
    image: null
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
        image: null
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
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
      submitData.append('_method', 'PUT');
      if (formData.image) submitData.append('image', formData.image);

      await productAPI.update(id, submitData);
      alert('Produk berhasil diupdate!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Gagal update produk');
    } finally {
      setLoading(false);
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Produk *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Produk (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-midas-gold"
              />
              <p className="text-sm text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah gambar</p>
            </div>

            <div className="flex space-x-4">
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
