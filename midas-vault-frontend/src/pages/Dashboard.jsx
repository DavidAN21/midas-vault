import React, { useState, useEffect } from 'react';
import { productAPI, transactionAPI, barterAPI, tradeInAPI } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [barters, setBarters] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'products':
          const productsResponse = await productAPI.getMyProducts();
          setProducts(productsResponse.data.data);
          break;
        case 'transactions':
          const transactionsResponse = await transactionAPI.getMyTransactions();
          setTransactions(transactionsResponse.data.data);
          break;
        case 'barters':
          const bartersResponse = await barterAPI.getMyBarters();
          setBarters(bartersResponse.data.data);
          break;
        case 'trade-ins':
          const tradeInsResponse = await tradeInAPI.getMyTradeIns();
          setTradeIns(tradeInsResponse.data.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transaction Functions
  const handleConfirmTransaction = async (transactionId) => {
    if (confirm('Konfirmasi bahwa barang sudah diterima pembeli?')) {
      try {
        await transactionAPI.confirm(transactionId);
        alert('Transaksi berhasil dikonfirmasi!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal mengonfirmasi transaksi');
      }
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    if (confirm('Batalkan transaksi ini?')) {
      try {
        await transactionAPI.cancel(transactionId);
        alert('Transaksi berhasil dibatalkan!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan transaksi');
      }
    }
  };

  // Barter Functions
  const handleAcceptBarter = async (barterId) => {
    if (confirm('Terima penawaran barter ini?')) {
      try {
        await barterAPI.accept(barterId);
        alert('Barter diterima!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menerima barter');
      }
    }
  };

  const handleRejectBarter = async (barterId) => {
    if (confirm('Tolak penawaran barter ini?')) {
      try {
        await barterAPI.reject(barterId);
        alert('Barter ditolak!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menolak barter');
      }
    }
  };

  const handleCompleteBarter = async (barterId) => {
    if (confirm('Konfirmasi barter selesai?')) {
      try {
        await barterAPI.complete(barterId);
        alert('Barter selesai!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menyelesaikan barter');
      }
    }
  };

  const handleCancelBarter = async (barterId) => {
    if (confirm('Batalkan barter ini?')) {
      try {
        await barterAPI.cancel(barterId);
        alert('Barter dibatalkan!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan barter');
      }
    }
  };

  // Trade-In Functions
  const handleAcceptTradeIn = async (tradeInId) => {
    if (confirm('Terima penawaran tukar tambah ini?')) {
      try {
        await tradeInAPI.accept(tradeInId);
        alert('Tukar tambah diterima!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menerima tukar tambah');
      }
    }
  };

  const handleRejectTradeIn = async (tradeInId) => {
    if (confirm('Tolak penawaran tukar tambah ini?')) {
      try {
        await tradeInAPI.reject(tradeInId);
        alert('Tukar tambah ditolak!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menolak tukar tambah');
      }
    }
  };

  const handlePayTradeIn = async (tradeInId) => {
    if (confirm('Lanjutkan pembayaran selisih harga?')) {
      try {
        await tradeInAPI.pay(tradeInId);
        alert('Pembayaran berhasil! Tukar tambah selesai.');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal melakukan pembayaran');
      }
    }
  };

  const handleCancelTradeIn = async (tradeInId) => {
    if (confirm('Batalkan penawaran tukar tambah ini?')) {
      try {
        await tradeInAPI.cancel(tradeInId);
        alert('Tukar tambah dibatalkan! Produk kembali tersedia.');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan tukar tambah');
      }
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await productAPI.delete(productId);
        alert('Produk berhasil dihapus!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus produk');
      }
    }
  };

  // Helper Functions
  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      escrow: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Menunggu',
      escrow: 'Dalam Escrow',
      completed: 'Selesai',
      refunded: 'Dibatalkan',
    };
    return texts[status] || status;
  };

  const getBarterStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getBarterStatusText = (status) => {
    const texts = {
      pending: 'Menunggu',
      accepted: 'Diterima',
      rejected: 'Ditolak',
      completed: 'Selesai',
    };
    return texts[status] || status;
  };

  const getTradeInStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTradeInStatusText = (status) => {
    const texts = {
      pending: 'Menunggu',
      accepted: 'Diterima',
      rejected: 'Ditolak',
      completed: 'Selesai',
    };
    return texts[status] || status;
  };

  // Tabs Configuration
  const tabs = [
    { id: 'products', name: 'Produk Saya', icon: '📦' },
    { id: 'transactions', name: 'Transaksi', icon: '💸' },
    { id: 'barters', name: 'Barter', icon: '⚖️' },
    { id: 'trade-ins', name: 'Tukar Tambah', icon: '🔄' },
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'verifications', name: 'Verifikasi Produk', icon: '✅' });
  }

  // Render Functions
  const renderProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span>Produk Saya</span>
          </h3>
          <p className="text-gray-600">Kelola produk yang Anda jual</p>
        </div>
        <a 
          href="/add-product" 
          className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Upload Produk</span>
        </a>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum ada produk</h4>
          <p className="text-gray-500 mb-6">Mulai jual produk pertama Anda</p>
          <a 
            href="/add-product" 
            className="bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Upload Produk Pertama</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
              <div className="relative">
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.verification_status === 'approved' ? 'bg-emerald-500 text-white' :
                    product.verification_status === 'rejected' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {product.verification_status === 'approved' ? 'Terverifikasi' :
                     product.verification_status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.status === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {product.status === 'available' ? 'Tersedia' : 'Terjual'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent mb-3">
                  {formatPrice(product.price)}
                </p>

                {product.verification_status === 'rejected' && product.verifications && product.verifications.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
                    <p className="text-red-700 text-sm">
                      <strong>Alasan ditolak:</strong> {product.verifications[0].notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <a
                    href={`/edit-product/${product.id}`}
                    className="flex-1 group/btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </a>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 group/btn bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <span>Transaksi Saya</span>
        </h3>
        <p className="text-gray-600">Riwayat transaksi jual beli Anda</p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum ada transaksi</h4>
          <p className="text-gray-500">Transaksi akan muncul di sini setelah Anda membeli atau menjual produk</p>
        </div>
      ) : (
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-midas-gold hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">{transaction.product?.name}</h4>
                  <p className="text-2xl font-bold bg-gradient-to-r from-midas-gold to-yellow-500 bg-clip-text text-transparent">
                    {formatPrice(transaction.amount)}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div className="space-y-2">
                  <p><strong className="text-gray-700">Pembeli:</strong> {transaction.buyer?.name}</p>
                  <p><strong className="text-gray-700">Penjual:</strong> {transaction.seller?.name}</p>
                </div>
                <div className="space-y-2">
                  <p><strong className="text-gray-700">Referensi:</strong> {transaction.payment_reference}</p>
                  <p><strong className="text-gray-700">Tanggal:</strong> {new Date(transaction.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                {user.id === transaction.seller_id && transaction.status === 'escrow' && (
                  <button
                    onClick={() => handleConfirmTransaction(transaction.id)}
                    className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Konfirmasi Selesai</span>
                  </button>
                )}

                {(user.id === transaction.buyer_id || user.id === transaction.seller_id) && transaction.status === 'escrow' && (
                  <button
                    onClick={() => handleCancelTransaction(transaction.id)}
                    className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Batalkan</span>
                  </button>
                )}

                {transaction.status === 'completed' && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Transaksi Selesai</span>
                  </span>
                )}

                {transaction.status === 'refunded' && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Transaksi Dibatalkan</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Note: I'll continue with the other render functions (barters, trade-ins) following the same pattern
  // Due to length constraints, I've shown the pattern for products and transactions
  const renderBarters = () => (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span>Penawaran Barter</span>
        </h3>
        <p className="text-gray-600">Kelola penawaran barter Anda</p>
      </div>

      {barters.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum ada penawaran barter</h4>
          <p className="text-gray-500">Penawaran barter akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-6">
          {barters.map(barter => (
            <div key={barter.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Penawaran Barter</h4>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getBarterStatusColor(barter.status)}`}>
                    {getBarterStatusText(barter.status)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date(barter.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Produk yang Ditukar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{barter.requester_id === user.id ? 'Produk Anda' : 'Ditawarkan'}</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={barter.requester_product?.image_url} 
                      alt={barter.requester_product?.name}
                      className="w-16 h-16 object-cover rounded-xl border-2 border-purple-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{barter.requester_product?.name}</p>
                      <p className="text-midas-gold font-bold text-sm">{formatPrice(barter.requester_product?.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{barter.receiver_id === user.id ? 'Produk Anda' : 'Diminta'}</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={barter.receiver_product?.image_url} 
                      alt={barter.receiver_product?.name}
                      className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{barter.receiver_product?.name}</p>
                      <p className="text-midas-gold font-bold text-sm">{formatPrice(barter.receiver_product?.price)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Konfirmasi */}
              {barter.status === 'accepted' && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-4 mb-4">
                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Status Konfirmasi</span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{barter.requester?.name}:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        barter.requester_confirmed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {barter.requester_confirmed ? '✓ Sudah konfirmasi' : '⏳ Menunggu'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{barter.receiver?.name}:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        barter.receiver_confirmed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {barter.receiver_confirmed ? '✓ Sudah konfirmasi' : '⏳ Menunggu'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Pengguna */}
              <div className="text-sm text-gray-600 mb-6">
                <p className="mb-2">
                  <strong className="text-gray-700">
                    {barter.requester_id === user.id ? 'Anda menawarkan' : `${barter.requester?.name} menawarkan`}
                  </strong> barter kepada{' '}
                  <strong className="text-gray-700">
                    {barter.receiver_id === user.id ? 'Anda' : barter.receiver?.name}
                  </strong>
                </p>
                {barter.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-gray-700"><strong>Catatan:</strong> {barter.notes}</p>
                  </div>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap gap-3">
                {barter.receiver_id === user.id && barter.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptBarter(barter.id)}
                      className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Terima</span>
                    </button>
                    <button
                      onClick={() => handleRejectBarter(barter.id)}
                      className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Tolak</span>
                    </button>
                  </>
                )}

                {barter.status === 'accepted' && (
                  <>
                    <button
                      onClick={() => handleCompleteBarter(barter.id)}
                      className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>
                        {barter.requester_id === user.id && barter.requester_confirmed ? '✓ Anda Sudah Konfirmasi' :
                        barter.receiver_id === user.id && barter.receiver_confirmed ? '✓ Anda Sudah Konfirmasi' :
                        'Konfirmasi Selesai'}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => handleCancelBarter(barter.id)}
                      className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Batalkan</span>
                    </button>
                  </>
                )}

                {barter.status === 'completed' && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Barter Selesai</span>
                  </span>
                )}

                {barter.status === 'rejected' && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Barter Ditolak</span>
                  </span>
                )}

                {barter.status === 'cancelled' && (
                  <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Barter Dibatalkan</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTradeIns = () => (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <span>Penawaran Tukar Tambah</span>
        </h3>
        <p className="text-gray-600">Kelola penawaran tukar tambah Anda</p>
      </div>

      {tradeIns.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-600 mb-2">Belum ada penawaran tukar tambah</h4>
          <p className="text-gray-500">Penawaran tukar tambah akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tradeIns.map(tradeIn => (
            <div key={tradeIn.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Penawaran Tukar Tambah</h4>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getTradeInStatusColor(tradeIn.status)}`}>
                    {getTradeInStatusText(tradeIn.status)}
                  </span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date(tradeIn.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Produk yang Ditukar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4 border border-orange-200">
                  <p className="text-sm font-semibold text-orange-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tradeIn.buyer_id === user.id ? 'Produk Anda' : 'Ditawarkan'}</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={tradeIn.old_product?.image_url} 
                      alt={tradeIn.old_product?.name}
                      className="w-16 h-16 object-cover rounded-xl border-2 border-orange-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{tradeIn.old_product?.name}</p>
                      <p className="text-midas-gold font-bold text-sm">{formatPrice(tradeIn.old_product?.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-3 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tradeIn.seller_id === user.id ? 'Produk Anda' : 'Diminta'}</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={tradeIn.new_product?.image_url} 
                      alt={tradeIn.new_product?.name}
                      className="w-16 h-16 object-cover rounded-xl border-2 border-green-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-2">{tradeIn.new_product?.name}</p>
                      <p className="text-midas-gold font-bold text-sm">{formatPrice(tradeIn.new_product?.price)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Harga */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-5 mb-6">
                <h5 className="font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Detail Harga</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <span className="text-gray-600 text-xs block mb-1">Harga Baru</span>
                    <p className="font-bold text-gray-900">{formatPrice(tradeIn.new_product?.price)}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 text-xs block mb-1">Harga Lama</span>
                    <p className="font-bold text-gray-900">{formatPrice(tradeIn.old_product?.price)}</p>
                  </div>
                  <div className="text-center bg-gradient-to-r from-midas-gold to-yellow-500 rounded-lg p-3">
                    <span className="text-white text-xs block mb-1">Selisih</span>
                    <p className="font-bold text-white text-lg">{formatPrice(tradeIn.price_difference)}</p>
                  </div>
                </div>
                {tradeIn.price_difference === 0 && (
                  <div className="text-center mt-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                      Tukar tambah tanpa biaya tambahan!
                    </span>
                  </div>
                )}
              </div>

              {/* Info Pengguna */}
              <div className="text-sm text-gray-600 mb-6">
                <p>
                  <strong className="text-gray-700">
                    {tradeIn.buyer_id === user.id ? 'Anda menawarkan' : `${tradeIn.buyer?.name} menawarkan`}
                  </strong> tukar tambah kepada{' '}
                  <strong className="text-gray-700">
                    {tradeIn.seller_id === user.id ? 'Anda' : tradeIn.seller?.name}
                  </strong>
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap gap-3">
                {tradeIn.seller_id === user.id && tradeIn.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptTradeIn(tradeIn.id)}
                      className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Terima</span>
                    </button>
                    <button
                      onClick={() => handleRejectTradeIn(tradeIn.id)}
                      className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Tolak</span>
                    </button>
                  </>
                )}

                {tradeIn.buyer_id === user.id && tradeIn.status === 'accepted' && (
                  <button
                    onClick={() => handlePayTradeIn(tradeIn.id)}
                    className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Bayar {formatPrice(tradeIn.price_difference)}</span>
                  </button>
                )}

                {(tradeIn.status === 'pending' || tradeIn.status === 'accepted') && (
                  <button
                    onClick={() => handleCancelTradeIn(tradeIn.id)}
                    className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Batalkan</span>
                  </button>
                )}

                {tradeIn.status === 'completed' && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tukar Tambah Selesai</span>
                  </span>
                )}

                {tradeIn.status === 'rejected' && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tukar Tambah Ditolak</span>
                  </span>
                )}

                {tradeIn.status === 'cancelled' && (
                  <span className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Tukar Tambah Dibatalkan</span>
                  </span>
                )}
              </div>

              {/* Warning jika produk tidak available */}
              {(tradeIn.old_product?.status !== 'available' || tradeIn.new_product?.status !== 'available') && 
              tradeIn.status !== 'completed' && tradeIn.status !== 'cancelled' && (
                <div className="mt-4 bg-gradient-to-br from-yellow-50 to-amber-100 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm font-semibold">Salah satu produk sudah tidak tersedia</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Update the main return statement to include the new render functions
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600">Selamat datang, <span className="font-semibold text-midas-gold">{user.name}</span>!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-gray-100">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-8 py-4 text-center font-bold border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-midas-gold text-midas-gold bg-gradient-to-r from-midas-gold/5 to-yellow-500/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'transactions' && renderTransactions()}
              {activeTab === 'barters' && renderBarters()}
              {activeTab === 'trade-ins' && renderTradeIns()}
            </>
          )}
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-midas-dark to-gray-800 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600">Selamat datang, <span className="font-semibold text-midas-gold">{user.name}</span>!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden border border-gray-100">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-8 py-4 text-center font-bold border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-midas-gold text-midas-gold bg-gradient-to-r from-midas-gold/5 to-yellow-500/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'transactions' && renderTransactions()}
              {/* Add other tabs render functions here */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;