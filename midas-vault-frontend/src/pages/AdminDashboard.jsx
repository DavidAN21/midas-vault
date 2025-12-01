import React, { useState, useEffect } from 'react';
import { verificationAPI, adminAPI } from '../services/api';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  
  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState({
    pending: 1,
    approved: 1,
    rejected: 1
  });
  const [itemsPerPage] = useState(10);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    fetchData();
    fetchRejectedProducts();
    fetchApprovedProducts();
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

  const fetchRejectedProducts = async () => {
    try {
      const response = await verificationAPI.getRejected();
      setRejectedProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching rejected products:', error);
    }
  };

  const fetchApprovedProducts = async () => {
    try {
      const response = await verificationAPI.getApproved();
      setApprovedProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching approved products:', error);
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
        
        // Refresh semua data
        fetchData();
        fetchRejectedProducts();
        fetchApprovedProducts();
        
      } catch (error) {
        console.error('Verification error:', error);
        alert(error.response?.data?.message || 'Gagal memverifikasi produk');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Fungsi untuk mendapatkan data yang ditampilkan berdasarkan tab aktif
  const getCurrentData = () => {
    switch (activeTab) {
      case 'pending':
        return pendingVerifications;
      case 'approved':
        return approvedProducts;
      case 'rejected':
        return rejectedProducts;
      default:
        return [];
    }
  };

  // Fungsi untuk mendapatkan data yang dipaginasi
  const getPaginatedData = () => {
    const data = getCurrentData();
    const startIndex = (currentPage[activeTab] - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Fungsi untuk mendapatkan total halaman
  const getTotalPages = () => {
    const data = getCurrentData();
    return Math.ceil(data.length / itemsPerPage);
  };

  // Fungsi untuk mengganti halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage({
      ...currentPage,
      [activeTab]: pageNumber
    });
  };

  // Fungsi untuk merender pagination
  const renderPagination = () => {
    const totalPages = getTotalPages();
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage[activeTab] - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Tombol Previous
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage[activeTab] - 1)}
        disabled={currentPage[activeTab] === 1}
        className={`px-3 py-2 rounded-lg font-medium flex items-center space-x-1 ${
          currentPage[activeTab] === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Sebelumnya</span>
      </button>
    );

    // Tombol halaman pertama
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage[activeTab] === 1
              ? 'bg-gradient-to-r from-midas-gold to-yellow-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Tombol halaman tengah
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage[activeTab] === i
              ? 'bg-gradient-to-r from-midas-gold to-yellow-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Tombol halaman terakhir
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentPage[activeTab] === totalPages
              ? 'bg-gradient-to-r from-midas-gold to-yellow-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Tombol Next
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage[activeTab] + 1)}
        disabled={currentPage[activeTab] === totalPages}
        className={`px-3 py-2 rounded-lg font-medium flex items-center space-x-1 ${
          currentPage[activeTab] === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span>Selanjutnya</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return (
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Menampilkan {((currentPage[activeTab] - 1) * itemsPerPage) + 1} - {Math.min(currentPage[activeTab] * itemsPerPage, getCurrentData().length)} dari {getCurrentData().length} item
        </div>
        <div className="flex items-center space-x-2">
          {pages}
        </div>
      </div>
    );
  };

  // Fungsi untuk mendapatkan pesan empty state berdasarkan tab
  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'pending':
        return {
          title: "Tidak ada produk yang perlu diverifikasi",
          message: "Semua produk sudah terverifikasi",
          icon: "pending",
          color: "yellow"
        };
      case 'approved':
        return {
          title: "Belum ada produk yang disetujui",
          message: "Produk yang disetujui akan muncul di sini",
          icon: "approved",
          color: "green"
        };
      case 'rejected':
        return {
          title: "Belum ada produk yang ditolak",
          message: "Produk yang ditolak akan muncul di sini",
          icon: "rejected",
          color: "red"
        };
      default:
        return {
          title: "Tidak ada data",
          message: "",
          icon: "default",
          color: "gray"
        };
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {/* Total Users */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 hover:border-blue-200 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {overview.total_users || 0}
              </div>
              <div className="text-gray-600 font-semibold">Total Pengguna</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Semua pengguna terdaftar
                </div>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                {overview.total_products || 0}
              </div>
              <div className="text-gray-600 font-semibold">Total Produk</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Semua produk di sistem
                </div>
              </div>
            </div>
          </div>

          {/* Approved Verifications */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 hover:border-green-200 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {overview.approved_verifications || 0}
              </div>
              <div className="text-gray-600 font-semibold">Disetujui</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Produk yang lolos verifikasi
                </div>
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 hover:border-amber-200 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                {overview.pending_verifications || 0}
              </div>
              <div className="text-gray-600 font-semibold">Pending</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                  Menunggu verifikasi admin
                </div>
              </div>
            </div>
          </div>

          {/* Rejected Verifications */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-100 hover:border-red-200 hover:shadow-3xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {overview.rejected_verifications || 0}
              </div>
              <div className="text-gray-600 font-semibold">Ditolak</div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Tidak memenuhi syarat
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Cards - Premium Design */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Statistik Sistem</h2>
              <p className="text-gray-600">Analisis mendalam tentang performa platform</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Data real-time</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Produk Tersedia */}
            <div className="group bg-gradient-to-br from-blue-50/50 to-white rounded-2xl border border-blue-100 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Tersedia
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{overview.available_products || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Produk Tersedia</div>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((overview.available_products || 0) / (overview.total_products || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(((overview.available_products || 0) / (overview.total_products || 1)) * 100)}% dari total produk
              </div>
            </div>

            {/* Terjual */}
            <div className="group bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl border border-emerald-100 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  Terjual
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{overview.sold_products || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Produk Terjual</div>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((overview.sold_products || 0) / (overview.total_products || 1)) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(((overview.sold_products || 0) / (overview.total_products || 1)) * 100)}% dari total produk
              </div>
            </div>

            {/* Transaksi */}
            <div className="group bg-gradient-to-br from-purple-50/50 to-white rounded-2xl border border-purple-100 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Penjualan
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{overview.total_transactions || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Total Penjualan</div>
              </div>
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-1"></div>
              <div className="flex items-center text-xs text-gray-500">  
              </div>
            </div>

            {/* Barter */}
            <div className="group bg-gradient-to-br from-violet-50/50 to-white rounded-2xl border border-violet-100 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-violet-100 to-violet-200 rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                  Barter
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{overview.total_barters || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Transaksi Barter</div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-violet-500 rounded-full mr-1"></div>
                </div>
              </div>
            </div>

            {/* Tukar Tambah */}
            <div className="group bg-gradient-to-br from-orange-50/50 to-white rounded-2xl border border-orange-100 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-200 rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  Tukar Tambah
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{overview.total_trade_ins || 0}</div>
                <div className="text-sm text-gray-600 font-semibold">Tukar Tambah</div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verifikasi Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Verifikasi</h2>
              <p className="text-gray-600">Kelola verifikasi produk pengguna</p>
            </div>
            <button 
              onClick={() => {
                fetchData();
                fetchRejectedProducts();
                fetchApprovedProducts();
                // Reset halaman ke 1 saat refresh
                setCurrentPage({
                  pending: 1,
                  approved: 1,
                  rejected: 1
                });
              }}
              className="group bg-gradient-to-r from-midas-gold to-yellow-500 text-midas-dark px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('pending');
                // Reset halaman saat pindah tab
                if (currentPage.pending !== 1) {
                  setCurrentPage(prev => ({ ...prev, pending: 1 }));
                }
              }}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${
                activeTab === 'pending'
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-100 text-yellow-700 border-b-2 border-yellow-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pending ({pendingVerifications.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('approved');
                // Reset halaman saat pindah tab
                if (currentPage.approved !== 1) {
                  setCurrentPage(prev => ({ ...prev, approved: 1 }));
                }
              }}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${
                activeTab === 'approved'
                  ? 'bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Disetujui ({approvedProducts.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('rejected');
                // Reset halaman saat pindah tab
                if (currentPage.rejected !== 1) {
                  setCurrentPage(prev => ({ ...prev, rejected: 1 }));
                }
              }}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-300 ${
                activeTab === 'rejected'
                  ? 'bg-gradient-to-r from-red-50 to-pink-100 text-red-700 border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ditolak ({rejectedProducts.length})</span>
              </div>
            </button>
          </div>

          {/* Content berdasarkan Tab */}
          {(() => {
            const paginatedData = getPaginatedData();
            const emptyState = getEmptyStateMessage();

            if (paginatedData.length === 0) {
              return (
                <div className={`text-center py-16 bg-gradient-to-br from-${emptyState.color}-50 to-${emptyState.color}-100 rounded-2xl border-2 border-dashed border-${emptyState.color}-300`}>
                  <div className={`w-20 h-20 bg-${emptyState.color}-200 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <svg className={`w-10 h-10 text-${emptyState.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {emptyState.icon === 'pending' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {emptyState.icon === 'approved' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      )}
                      {emptyState.icon === 'rejected' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <h4 className={`text-xl font-semibold text-${emptyState.color}-700 mb-2`}>{emptyState.title}</h4>
                  <p className={`text-${emptyState.color}-600`}>{emptyState.message}</p>
                </div>
              );
            }

            return (
              <>
                <div className="space-y-6">
                  {paginatedData.map(product => (
                    <div key={product.id} className={`bg-gradient-to-br from-${activeTab === 'pending' ? 'yellow' : activeTab === 'approved' ? 'green' : 'red'}-50 to-${activeTab === 'pending' ? 'amber' : activeTab === 'approved' ? 'emerald' : 'pink'}-100 rounded-2xl p-6 border-l-4 border-${activeTab === 'pending' ? 'yellow' : activeTab === 'approved' ? 'green' : 'red'}-400 hover:shadow-lg transition-all duration-300`}>
                      <div className="flex items-start space-x-6">
                        <img 
                          src={product.image_url || '/images/default-product.jpg'} 
                          alt={product.name} 
                          className="w-24 h-24 object-cover rounded-2xl border-2 border-gray-200 shadow-md" 
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h4>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                            </div>
                            {activeTab === 'pending' ? (
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
                            ) : (
                              <span className={`bg-${activeTab === 'approved' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded-xl font-semibold`}>
                                {activeTab === 'approved' ? '✓ Disetujui' : '✗ Ditolak'}
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white rounded-xl p-3 border border-gray-200">
                              <span className="font-semibold text-gray-700 block mb-1">Harga</span>
                              <p className="text-midas-gold font-bold text-lg">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                            {activeTab === 'pending' ? (
                              <>
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
                              </>
                            ) : (
                              <>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                  <span className="font-semibold text-gray-700 block mb-1">
                                    {activeTab === 'approved' ? 'Disetujui Oleh' : 'Ditolak Oleh'}
                                  </span>
                                  <p className="text-gray-600 font-medium">{product.verifier?.name || 'Admin'}</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                  <span className="font-semibold text-gray-700 block mb-1">Penjual</span>
                                  <p className="text-gray-600 font-medium">{product.user?.name}</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 border border-gray-200">
                                  <span className="font-semibold text-gray-700 block mb-1">Tanggal</span>
                                  <p className="text-gray-600 font-medium">
                                    {new Date(product.verified_at).toLocaleDateString('id-ID')}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {renderPagination()}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;