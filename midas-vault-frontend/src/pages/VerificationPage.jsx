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
      if (!notes) return; // User cancel
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
        
        // Refresh data
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
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' },
      'approved': { color: 'bg-green-100 text-green-800', text: 'Disetujui' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Ditolak' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midas-dark mb-2">Verifikasi Produk</h1>
            <p className="text-gray-600">Kelola verifikasi produk dari pengguna</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-midas-gold text-midas-dark'
                : 'text-gray-600 hover:text-midas-dark'
            }`}
          >
            Pending ({pendingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'verified'
                ? 'bg-midas-gold text-midas-dark'
                : 'text-gray-600 hover:text-midas-dark'
            }`}
          >
            Terverifikasi ({verifiedProducts.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === 'pending' ? (
            /* PENDING PRODUCTS */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Produk Menunggu Verifikasi</h2>
                <button 
                  onClick={fetchData}
                  className="bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              {pendingProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-lg font-semibold">Tidak ada produk yang perlu diverifikasi</p>
                  <p className="text-sm">Semua produk sudah terverifikasi</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingProducts.map(product => (
                    <div key={product.id} className="border-2 border-yellow-200 rounded-xl p-6 bg-yellow-50">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={product.image_url || '/images/default-product.jpg'} 
                            alt={product.name} 
                            className="w-32 h-32 object-cover rounded-lg shadow-md" 
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                              <div className="flex items-center gap-4 mb-3">
                                {getStatusBadge('pending')}
                                <span className="text-sm text-gray-500">
                                  Diajukan oleh: <strong>{product.user?.name}</strong>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-midas-gold mb-2">
                                {new Intl.NumberFormat('id-ID', { 
                                  style: 'currency', 
                                  currency: 'IDR' 
                                }).format(product.price)}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>

                          {/* Product Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="font-semibold text-gray-700">Kategori:</span>
                              <p className="text-gray-600 capitalize">{product.category}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Kondisi:</span>
                              <p className="text-gray-600 capitalize">{product.condition}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Barter:</span>
                              <p className="text-gray-600">{product.allow_barter ? '✅ Diizinkan' : '❌ Tidak'}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-yellow-200">
                            <button
                              onClick={() => handleVerify(product.id, 'approved')}
                              disabled={verifying === product.id}
                              className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {verifying === product.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Memproses...
                                </>
                              ) : (
                                <>
                                  ✓ Setujui Produk
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleVerify(product.id, 'rejected')}
                              disabled={verifying === product.id}
                              className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              ✕ Tolak Produk
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Produk Terverifikasi</h2>
                <button 
                  onClick={fetchData}
                  className="bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Refresh Data
                </button>
              </div>

              {verifiedProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-lg font-semibold">Belum ada produk terverifikasi</p>
                  <p className="text-sm">Produk yang disetujui akan muncul di sini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {verifiedProducts.map(product => (
                    <div key={product.id} className="border border-green-200 rounded-xl p-4 bg-green-50">
                      <img 
                        src={product.image_url || '/images/default-product.jpg'} 
                        alt={product.name} 
                        className="w-full h-48 object-cover rounded-lg mb-4" 
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                          {getStatusBadge(product.verification_status)}
                        </div>
                        <p className="text-midas-gold font-bold text-lg">
                          {new Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR' 
                          }).format(product.price)}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Oleh: {product.user?.name}</span>
                          <span className="capitalize">{product.condition}</span>
                        </div>
                        {product.verified_at && (
                          <p className="text-xs text-gray-400">
                            Disetujui: {new Date(product.verified_at).toLocaleDateString('id-ID')}
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