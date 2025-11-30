import React, { useState, useEffect } from 'react';
import { verificationAPI, adminAPI } from '../services/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
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
        
        if (status === 'rejected') {
          setPendingVerifications(prev => prev.filter(p => p.id !== productId));
        } else {
          fetchData();
        }
      } catch (error) {
        console.error('Verification error:', error);
        alert(error.response?.data?.message || 'Gagal memverifikasi produk');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Dashboard Admin
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-midas-gold to-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-midas-dark" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600">Selamat datang, <span className="font-semibold text-midas-gold">{user.name}</span>!</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{overview.total_users || 0}</div>
            <div className="text-gray-600 font-semibold">Total Pengguna</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{overview.total_products || 0}</div>
            <div className="text-gray-600 font-semibold">Total Produk</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{overview.total_transactions || 0}</div>
            <div className="text-gray-600 font-semibold">Total Transaksi</div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{overview.pending_verifications || 0}</div>
            <div className="text-gray-600 font-semibold">Verifikasi Pending</div>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span>Verifikasi Produk Pending</span>
              </h2>
              <p className="text-gray-600">Produk yang menunggu persetujuan verifikasi</p>
            </div>
            <button 
              onClick={fetchData}
              className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada produk yang perlu diverifikasi</h4>
              <p className="text-gray-500">Semua produk sudah terverifikasi</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingVerifications.map(product => (
                <div key={product.id} className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border-l-4 border-yellow-400 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-6">
                    <img 
                      src={product.image_url || '/images/default-product.jpg'} 
                      alt={product.name} 
                      className="w-24 h-24 object-cover rounded-2xl border-2 border-yellow-200 shadow-md" 
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleVerify(product.id, 'approved')}
                            className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Setujui</span>
                          </button>
                          <button
                            onClick={() => handleVerify(product.id, 'rejected')}
                            className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <span className="font-semibold text-gray-700 block mb-1">Harga</span>
                          <p className="text-midas-gold font-bold text-lg">
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR' 
                            }).format(product.price)}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <span className="font-semibold text-gray-700 block mb-1">Kategori</span>
                          <p className="text-gray-600 font-medium">{product.category}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <span className="font-semibold text-gray-700 block mb-1">Kondisi</span>
                          <p className="text-gray-600 font-medium capitalize">{product.condition}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                          <span className="font-semibold text-gray-700 block mb-1">Penjual</span>
                          <p className="text-gray-600 font-medium">{product.user?.name}</p>
                        </div>
                      </div>
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