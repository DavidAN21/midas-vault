import React, { useState, useEffect } from 'react';
import { verificationAPI, adminAPI } from '../services/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Redirect jika bukan admin
    if (user.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewResponse, verificationsResponse] = await Promise.all([
        adminAPI.getOverview(),
        verificationAPI.getPending()
      ]);
      
      setOverview(overviewResponse.data.data);
      setPendingVerifications(verificationsResponse.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (productId, status) => {
    const action = status === 'approved' ? 'menyetujui' : 'menolak';
    
    if (confirm(`Apakah Anda yakin ingin ${action} produk ini?`)) {
      try {
        const notes = status === 'approved' 
          ? 'Produk memenuhi syarat verifikasi' 
          : 'Produk tidak memenuhi syarat verifikasi';
          
        await verificationAPI.verifyProduct(productId, { 
          status, 
          notes 
        });
        
        alert(`Produk berhasil ${status === 'approved' ? 'diverifikasi' : 'ditolak'}!`);
        
        // Jika ditolak, hapus dari list pending
        if (status === 'rejected') {
          setPendingVerifications(prev => prev.filter(p => p.id !== productId));
        } else {
          fetchData(); // Refresh data untuk approved
        }
      } catch (error) {
        console.error('Verification error:', error);
        alert(error.response?.data?.message || 'Gagal memverifikasi produk');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midas-dark mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang, {user.name}! 👑</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-midas-gold mb-2">{overview.total_users || 0}</div>
            <div className="text-gray-600">Total Pengguna</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-midas-gold mb-2">{overview.total_products || 0}</div>
            <div className="text-gray-600">Total Produk</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-midas-gold mb-2">{overview.total_transactions || 0}</div>
            <div className="text-gray-600">Total Transaksi</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl font-bold text-midas-gold mb-2">{overview.pending_verifications || 0}</div>
            <div className="text-gray-600">Verifikasi Pending</div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Verifikasi Produk Pending</h2>
            <button 
              onClick={fetchData}
              className="bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
            >
              Refresh
            </button>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">✅</div>
              <p>Tidak ada produk yang perlu diverifikasi</p>
              <p className="text-sm">Semua produk sudah terverifikasi</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map(product => (
                <div key={product.id} className="border rounded-xl p-4 border-l-4 border-yellow-400">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={product.image_url || '/images/default-product.jpg'} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded-lg" 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="font-semibold text-gray-700">Harga:</span>
                          <p className="text-midas-gold font-bold">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR' 
                            }).format(product.price)}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Kategori:</span>
                          <p className="text-gray-600">{product.category}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Kondisi:</span>
                          <p className="text-gray-600 capitalize">{product.condition}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Penjual:</span>
                          <p className="text-gray-600">{product.user?.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleVerify(product.id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors whitespace-nowrap"
                      >
                        ✓ Setujui
                      </button>
                      <button
                        onClick={() => handleVerify(product.id, 'rejected')}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors whitespace-nowrap"
                      >
                        ✕ Tolak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;