import React, { useState, useEffect } from 'react';
import { productAPI, transactionAPI, adminAPI } from '../services/api';
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
          if (transactionAPI.getMyTransactions) {
            const transactionsResponse = await transactionAPI.getMyTransactions();
            setTransactions(transactionsResponse.data.data);
          }
          break;
        }
        case 'verifications': {
          if (user.role === 'admin') {
            const verificationsResponse = await adminAPI.getPendingVerifications();
            setPendingVerifications(verificationsResponse.data.data);
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

  const handleVerify = async (productId, status) => {
    if (confirm(`Apakah Anda yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} produk ini?`)) {
      try {
        await adminAPI.verifyProduct(productId, { 
          status, 
          notes: status === 'approved' ? 'Produk memenuhi syarat' : 'Produk tidak memenuhi syarat' 
        });
        alert(`Produk berhasil ${status === 'approved' ? 'diverifikasi' : 'ditolak'}!`);
        fetchData();
      } catch (error) {
        alert('Gagal memverifikasi produk');
      }
    }
  };

  const tabs = [
    { id: 'products', name: 'Produk Saya' },
    { id: 'transactions', name: 'Transaksi' },
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'verifications', name: 'Verifikasi Produk' });
  }

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
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full ${product.verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {product.verified_at ? 'Verified' : 'Pending'}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                product.status === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVerifications = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Verifikasi Produk</h3>
      <div className="space-y-4">
        {pendingVerifications.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-start space-x-4">
              <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-midas-gold font-bold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                </p>
                <p className="text-sm text-gray-500">Oleh: {product.user?.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerify(product.id, 'approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  Setujui
                </button>
                <button
                  onClick={() => handleVerify(product.id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        ))}
        {pendingVerifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada produk yang perlu diverifikasi
          </div>
        )}
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Transaksi</h3>
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Belum ada transaksi
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{tx.product?.name || 'Produk tidak ditemukan'}</h4>
                <p className="text-gray-600 text-sm">Status: {tx.status}</p>
              </div>
              <p className="text-midas-gold font-bold">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
              {activeTab === 'verifications' && renderVerifications()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
