import React, { useState, useEffect } from 'react';
import { verificationAPI } from '../services/api';
import Loader from '../components/Loader';

const VerificationPage = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [verifiedProducts, setVerifiedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
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
      const [pendingResponse, verifiedResponse] = await Promise.all([
        verificationAPI.getPending(),
        verificationAPI.getVerified()
      ]);
      
      setPendingProducts(pendingResponse.data.data || []);
      setVerifiedProducts(verifiedResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching verification data:', error);
      alert('Gagal memuat data verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (productId, status, notes = '') => {
    const action = status === 'approved' ? 'menyetujui' : 'menolak';
    
    if (!notes && status === 'rejected') {
      notes = prompt(`Alasan penolakan produk:`);
      if (!notes) return;
    }

    if (confirm(`Apakah Anda yakin ingin ${action} produk ini?`)) {
      setVerifying(productId);
      try {
        const finalNotes = notes || (status === 'approved' 
          ? 'Produk memenuhi syarat verifikasi' 
          : 'Produk tidak memenuhi syarat verifikasi');
          
        await verificationAPI.verifyProduct(productId, { 
          status, 
          notes: finalNotes 
        });
        
        alert(`Produk berhasil ${status === 'approved' ? 'diverifikasi' : 'ditolak'}!`);
        fetchData();
      } catch (error) {
        console.error('Verification error:', error);
        alert(error.response?.data?.message || 'Gagal memverifikasi produk');
      } finally {
        setVerifying(null);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Menunggu',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'approved': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Disetujui',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      'rejected': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Ditolak',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center space-x-1`}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Verifikasi Produk
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-midas-gold to-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-midas-dark" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xl text-gray-600">Kelola verifikasi produk dari pengguna</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 inline-flex border border-gray-100">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pending ({pendingProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'verified'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Terverifikasi ({verifiedProducts.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {activeTab === 'pending' ? (
            /* PENDING PRODUCTS */
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Produk Menunggu Verifikasi</span>
                  </h2>
                  <p className="text-gray-600">Produk yang membutuhkan persetujuan verifikasi</p>
                </div>
                <button 
                  onClick={fetchData}
                  className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Data</span>
                </button>
              </div>

              {pendingProducts.length === 0 ? (
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
                  {pendingProducts.map(product => (
                    <div key={product.id} className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border-l-4 border-yellow-400 hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={product.image_url || '/images/default-product.jpg'} 
                            alt={product.name} 
                            className="w-32 h-32 object-cover rounded-2xl border-2 border-yellow-200 shadow-md" 
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                              <div className="flex items-center gap-4 mb-3">
                                {getStatusBadge('pending')}
                                <span className="text-sm text-gray-600 flex items-center space-x-1">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span>Oleh: <strong>{product.user?.name}</strong></span>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR' 
                                }).format(product.price)}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>

                          {/* Product Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white rounded-xl p-3 border border-gray-200">
                              <span className="font-semibold text-gray-700 block mb-1">Kategori</span>
                              <p className="text-gray-600 capitalize">{product.category}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-gray-200">
                              <span className="font-semibold text-gray-700 block mb-1">Kondisi</span>
                              <p className="text-gray-600 capitalize">{product.condition}</p>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-gray-200">
                              <span className="font-semibold text-gray-700 block mb-1">Barter</span>
                              <p className="text-gray-600 flex items-center space-x-1">
                                {product.allow_barter ? (
                                  <>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Diizinkan</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Tidak</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-yellow-200">
                            <button
                              onClick={() => handleVerify(product.id, 'approved')}
                              disabled={verifying === product.id}
                              className="group flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                              {verifying === product.id ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Memproses...</span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Setujui Produk</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleVerify(product.id, 'rejected')}
                              disabled={verifying === product.id}
                              className="group flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Tolak Produk</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* VERIFIED PRODUCTS */
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span>Produk Terverifikasi</span>
                  </h2>
                  <p className="text-gray-600">Produk yang sudah disetujui dan aktif di marketplace</p>
                </div>
                <button 
                  onClick={fetchData}
                  className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Data</span>
                </button>
              </div>

              {verifiedProducts.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum ada produk terverifikasi</h4>
                  <p className="text-gray-500">Produk yang disetujui akan muncul di sini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {verifiedProducts.map(product => (
                    <div key={product.id} className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-l-4 border-green-400 hover:shadow-lg transition-all duration-300 group">
                      <img 
                        src={product.image_url || '/images/default-product.jpg'} 
                        alt={product.name} 
                        className="w-full h-48 object-cover rounded-xl mb-4 border-2 border-green-200 group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 line-clamp-2 flex-1">{product.name}</h4>
                          {getStatusBadge(product.verification_status)}
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
                          {new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR' 
                          }).format(product.price)}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{product.user?.name}</span>
                          </span>
                          <span className="capitalize">{product.condition}</span>
                        </div>
                        {product.verified_at && (
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Disetujui: {new Date(product.verified_at).toLocaleDateString('id-ID')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;