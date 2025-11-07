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

  const tabs = [
    { id: 'products', name: 'Produk Saya' },
    { id: 'transactions', name: 'Transaksi' },
    { id: 'barters', name: 'Barter' },
    { id: 'trade-ins', name: 'Tukar Tambah' },
  ];

  const renderProducts = () => (
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
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {transactions.map(transaction => (
        <div key={transaction.id} className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{transaction.product?.name}</h3>
            <span className={`px-2 py-1 rounded-full text-sm ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {transaction.status}
            </span>
          </div>
          <p className="text-midas-gold font-bold mb-2">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.amount)}
          </p>
          <div className="text-sm text-gray-500">
            <p>Buyer: {transaction.buyer?.name}</p>
            <p>Seller: {transaction.seller?.name}</p>
            <p>Date: {new Date(transaction.created_at).toLocaleDateString('id-ID')}</p>
          </div>
          {transaction.seller_id === user.id && transaction.status === 'pending' && (
            <button
              onClick={() => handleConfirmTransaction(transaction.id)}
              className="mt-3 bg-midas-gold text-midas-dark px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
            >
              Konfirmasi
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const handleConfirmTransaction = async (transactionId) => {
    try {
      await transactionAPI.confirm(transactionId);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error confirming transaction:', error);
    }
  };

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
              {activeTab === 'barters' && (
                <div className="text-center py-8 text-gray-500">
                  Fitur barter akan segera hadir
                </div>
              )}
              {activeTab === 'trade-ins' && (
                <div className="text-center py-8 text-gray-500">
                  Fitur tukar tambah akan segera hadir
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;