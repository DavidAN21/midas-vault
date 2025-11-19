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


  
  // ===============================
  // ✅ Konfirmasi & Batalkan Transaksi
  // ===============================
  const handleConfirmTransaction = async (transactionId) => {
    if (confirm('Konfirmasi bahwa barang sudah diterima pembeli?')) {
      try {
        await transactionAPI.confirm(transactionId);
        alert('Transaksi berhasil dikonfirmasi!');
        fetchData(); // Refresh data
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal mengonfirmasi transaksi');
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
    if (confirm ('Konfirmasi barter selesai?')) {
      try {
        await barterAPI.complete(barterId);
        alert('Barter selesai!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menyelesaikan barter');
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

  const handleCancelTransaction = async (transactionId) => {
    if (confirm('Batalkan transaksi ini?')) {
      try {
        await transactionAPI.cancel(transactionId);
        alert('Transaksi berhasil dibatalkan!');
        fetchData(); // Refresh data
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan transaksi');
      }
    }
  };

  // ===============================
  // 🧩 Verifikasi Produk (Admin)
  // ===============================
  const handleVerify = async (productId, status) => {
    const action = status === 'approved' ? 'menyetujui' : 'menolak';

    if (confirm(`Apakah Anda yakin ingin ${action} produk ini?`)) {
      try {
        const notes =
          status === 'approved'
            ? 'Produk memenuhi syarat verifikasi'
            : 'Produk tidak memenuhi syarat verifikasi';

        await verificationAPI.verifyProduct(productId, { status, notes });

        alert(`Produk berhasil ${status === 'approved' ? 'diverifikasi' : 'ditolak'}!`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Verification error:', error);
        alert(error.response?.data?.message || 'Gagal memverifikasi produk');
      }
    }
  };

  // ===============================
  // 🏷️ Warna & Teks Status
  // ===============================
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

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  
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

  // ===============================
  // 🧭 Tabs
  // ===============================
  const tabs = [
    { id: 'products', name: 'Produk Saya' },
    { id: 'transactions', name: 'Transaksi' },
    { id: 'barters', name: 'Barter' },
    { id: 'trade-ins', name: 'Tukar Tambah' },
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'verifications', name: 'Verifikasi Produk' });
  }

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

  


  // ===============================
  // 🖼️ Render Produk Saya
  // ===============================
  const renderProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Produk Saya</h3>
        <a 
          href="/add-product" 
          className="bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
        >
          + Upload Produk
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
            <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-midas-gold font-bold text-lg mb-2">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
            </p>
            
            {/* Status Verifikasi */}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
              <span className={`px-2 py-1 rounded-full ${
                product.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                product.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {product.verification_status === 'approved' ? '✓ Terverifikasi' :
                product.verification_status === 'rejected' ? '✗ Ditolak' : '⏳ Menunggu Verifikasi'}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                product.status === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status === 'available' ? 'Tersedia' : 'Terjual'}
              </span>
            </div>

            {/* Notes jika ditolak */}
            {product.verification_status === 'rejected' && product.verifications && product.verifications.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                <p className="text-red-700 text-sm">
                  <strong>Alasan ditolak:</strong> {product.verifications[0].notes}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <a
                href={`/edit-product/${product.id}`}
                className="flex-1 bg-blue-500 text-white text-center py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Edit
              </a>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1 bg-red-500 text-white text-center py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ===============================
  // 💸 Render Transaksi Saya
  // ===============================
  const renderTransactions = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Transaksi Saya</h3>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">💸</div>
          <p>Belum ada transaksi</p>
          <p className="text-sm">
            Transaksi akan muncul di sini setelah Anda membeli atau menjual produk
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-midas-gold"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">
                    {transaction.product?.name}
                  </h4>
                  <p className="text-midas-gold font-bold text-xl">
                    {formatPrice(transaction.amount)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {getStatusText(transaction.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <p>
                    <strong>Pembeli:</strong> {transaction.buyer?.name}
                  </p>
                  <p>
                    <strong>Penjual:</strong> {transaction.seller?.name}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Referensi:</strong> {transaction.payment_reference}
                  </p>
                  <p>
                    <strong>Tanggal:</strong>{' '}
                    {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {user.id === transaction.seller_id &&
                  transaction.status === 'escrow' && (
                    <button
                      onClick={() => handleConfirmTransaction(transaction.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Konfirmasi Selesai
                    </button>
                  )}

                {(user.id === transaction.buyer_id ||
                  user.id === transaction.seller_id) &&
                  transaction.status === 'escrow' && (
                    <button
                      onClick={() => handleCancelTransaction(transaction.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Batalkan
                    </button>
                  )}

                {transaction.status === 'completed' && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">
                    ✅ Transaksi Selesai
                  </span>
                )}

                {transaction.status === 'refunded' && (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-xl font-semibold">
                    ❌ Transaksi Dibatalkan
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ===============================
  // 🔍 Render Verifikasi Produk
  // ===============================
  const renderVerifications = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Verifikasi Produk</h3>
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
          {pendingVerifications.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={product.image_url || '/images/default-product.jpg'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-semibold text-gray-700">Harga:</span>
                      <p className="text-midas-gold font-bold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Kategori:</span>
                      <p className="text-gray-600">{product.category}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Kondisi:</span>
                      <p className="text-gray-600 capitalize">
                        {product.condition}
                      </p>
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
  );

  const renderBarters = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">⚖️ Penawaran Barter</h3>
      
      {barters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">⚖️</div>
          <p>Belum ada penawaran barter</p>
          <p className="text-sm">Penawaran barter akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {barters.map(barter => (
            <div key={barter.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">Penawaran Barter</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBarterStatusColor(barter.status)}`}>
                    {getBarterStatusText(barter.status)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(barter.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Produk yang Ditukar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {barter.requester_id === user.id ? 'Produk Anda:' : 'Ditawarkan:'}
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={barter.requester_product?.image_url} 
                      alt={barter.requester_product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{barter.requester_product?.name}</p>
                      <p className="text-midas-gold text-sm">{formatPrice(barter.requester_product?.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {barter.receiver_id === user.id ? 'Produk Anda:' : 'Diminta:'}
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={barter.receiver_product?.image_url} 
                      alt={barter.receiver_product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{barter.receiver_product?.name}</p>
                      <p className="text-midas-gold text-sm">{formatPrice(barter.receiver_product?.price)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Konfirmasi */}
              {barter.status === 'accepted' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <h5 className="font-semibold text-blue-800 mb-2">Status Konfirmasi:</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{barter.requester?.name}:</span>
                      <span className={`ml-2 ${barter.requester_confirmed ? 'text-green-600 font-semibold' : 'text-yellow-600'}`}>
                        {barter.requester_confirmed ? '✓ Sudah konfirmasi' : '⏳ Menunggu'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">{barter.receiver?.name}:</span>
                      <span className={`ml-2 ${barter.receiver_confirmed ? 'text-green-600 font-semibold' : 'text-yellow-600'}`}>
                        {barter.receiver_confirmed ? '✓ Sudah konfirmasi' : '⏳ Menunggu'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Pengguna */}
              <div className="text-sm text-gray-600 mb-3">
                <p>
                  <strong>
                    {barter.requester_id === user.id ? 'Anda menawarkan' : `${barter.requester?.name} menawarkan`}
                  </strong> barter kepada{' '}
                  <strong>
                    {barter.receiver_id === user.id ? 'Anda' : barter.receiver?.name}
                  </strong>
                </p>
                {barter.notes && (
                  <p className="mt-2"><strong>Catatan:</strong> {barter.notes}</p>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="flex space-x-2">
                {barter.receiver_id === user.id && barter.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptBarter(barter.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleRejectBarter(barter.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Tolak
                    </button>
                  </>
                )}

                {barter.status === 'accepted' && (
                  <>
                    <button
                      onClick={() => handleCompleteBarter(barter.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      {barter.requester_id === user.id && barter.requester_confirmed ? '✓ Anda Sudah Konfirmasi' :
                      barter.receiver_id === user.id && barter.receiver_confirmed ? '✓ Anda Sudah Konfirmasi' :
                      'Konfirmasi Selesai'}
                    </button>
                    
                    <button
                      onClick={() => handleCancelBarter(barter.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Batalkan
                    </button>
                  </>
                )}

                {barter.status === 'completed' && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">
                    ✅ Barter Selesai
                  </span>
                )}

                {barter.status === 'rejected' && (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-xl font-semibold">
                    ❌ Barter Ditolak
                  </span>
                )}

                {barter.status === 'cancelled' && (
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl font-semibold">
                    ❌ Barter Dibatalkan
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Tambah function handleCancelBarter
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

  const renderTradeIns = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">🔄 Penawaran Tukar Tambah</h3>
      
      {tradeIns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🔄</div>
          <p>Belum ada penawaran tukar tambah</p>
          <p className="text-sm">Penawaran tukar tambah akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tradeIns.map(tradeIn => (
            <div key={tradeIn.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">Penawaran Tukar Tambah</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTradeInStatusColor(tradeIn.status)}`}>
                    {getTradeInStatusText(tradeIn.status)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(tradeIn.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Produk yang Ditukar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {tradeIn.buyer_id === user.id ? 'Produk Anda:' : 'Ditawarkan:'}
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={tradeIn.old_product?.image_url} 
                      alt={tradeIn.old_product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{tradeIn.old_product?.name}</p>
                      <p className="text-midas-gold text-sm">{formatPrice(tradeIn.old_product?.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {tradeIn.seller_id === user.id ? 'Produk Anda:' : 'Diminta:'}
                  </p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={tradeIn.new_product?.image_url} 
                      alt={tradeIn.new_product?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{tradeIn.new_product?.name}</p>
                      <p className="text-midas-gold text-sm">{formatPrice(tradeIn.new_product?.price)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Harga */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Harga produk baru:</span>
                    <p className="font-semibold">{formatPrice(tradeIn.new_product?.price)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Harga produk Anda:</span>
                    <p className="font-semibold">{formatPrice(tradeIn.old_product?.price)}</p>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <span className="text-gray-600">Selisih yang harus dibayar:</span>
                    <p className="font-semibold text-midas-gold text-lg">{formatPrice(tradeIn.price_difference)}</p>
                  </div>
                  {tradeIn.price_difference === 0 && (
                    <div className="col-span-2 text-center">
                      <span className="text-green-600 text-sm font-semibold">
                        🎉 Tukar tambah tanpa biaya tambahan!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Pengguna */}
              <div className="text-sm text-gray-600 mb-3">
                <p>
                  <strong>
                    {tradeIn.buyer_id === user.id ? 'Anda menawarkan' : `${tradeIn.buyer?.name} menawarkan`}
                  </strong> tukar tambah kepada{' '}
                  <strong>
                    {tradeIn.seller_id === user.id ? 'Anda' : tradeIn.seller?.name}
                  </strong>
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex space-x-2 flex-wrap gap-2">
                {tradeIn.seller_id === user.id && tradeIn.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptTradeIn(tradeIn.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Terima
                    </button>
                  </>
                )}

                {tradeIn.buyer_id === user.id && tradeIn.status === 'accepted' && (
                  <button
                    onClick={() => handlePayTradeIn(tradeIn.id)}
                    className="bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Bayar {formatPrice(tradeIn.price_difference)}
                  </button>
                )}

                {/* Tombol Cancel untuk semua status yang aktif */}
                {(tradeIn.status === 'pending' || tradeIn.status === 'accepted') && (
                  <button
                    onClick={() => handleCancelTradeIn(tradeIn.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Batalkan
                  </button>
                )}

                {tradeIn.status === 'completed' && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-semibold">
                    ✅ Tukar Tambah Selesai
                  </span>
                )}

                {tradeIn.status === 'rejected' && (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-xl font-semibold">
                    ❌ Tukar Tambah Ditolak
                  </span>
                )}

                {tradeIn.status === 'cancelled' && (
                  <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl font-semibold">
                    ❌ Tukar Tambah Dibatalkan
                  </span>
                )}
              </div>

              {/* Info jika produk sudah tidak available */}
              {(tradeIn.old_product?.status !== 'available' || tradeIn.new_product?.status !== 'available') && 
              tradeIn.status !== 'completed' && tradeIn.status !== 'cancelled' && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ Salah satu produk sudah tidak tersedia. Transaksi mungkin perlu dibatalkan.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

    


  // ===============================
  // 🧱 Tampilan Utama Dashboard
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midas-dark mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user.name}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-midas-gold text-midas-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <Loader />
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
};

export default Dashboard;
