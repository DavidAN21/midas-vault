import React, { useState, useEffect } from 'react';
import { productAPI, transactionAPI, verificationAPI, adminAPI } from '../services/api';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ===============================
  // 🔄 Ambil Data Berdasarkan Tab
  // ===============================
  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'products': {
          const productsResponse = await productAPI.getMyProducts();
          setProducts(productsResponse.data.data);
          break;
        }
        case 'transactions': {
          const transactionsResponse = await transactionAPI.getMyTransactions();
          console.log('Transactions data:', transactionsResponse.data);
          setTransactions(transactionsResponse.data.data);
          break;
        }
        case 'verifications': {
          if (user.role === 'admin') {
            try {
              const verificationsResponse = await verificationAPI.getPending();
              setPendingVerifications(verificationsResponse.data.data);
            } catch (error) {
              console.error('Error fetching verifications:', error);
              alert('Gagal memuat data verifikasi');
            }
          }
          break;
        }
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

  // ===============================
  // 🧭 Tabs
  // ===============================
  const tabs = [
    { id: 'products', name: 'Produk Saya' },
    { id: 'transactions', name: 'Transaksi' },
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

  // ===============================
  // 🧱 Tampilan Utama Dashboard
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midas-dark mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user.name}!</p>
          {user.role === 'admin' && (
            <p className="text-sm text-midas-gold font-semibold">👑 Mode Administrator</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
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


        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <Loader />
          ) : (
            <>
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'transactions' && renderTransactions()}
              {activeTab === 'verifications' &&
                user.role === 'admin' &&
                renderVerifications()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
