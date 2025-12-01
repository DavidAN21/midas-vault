import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug request
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
    headers: config.headers
  });

  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401) {
      console.log('Token expired or invalid. Logging out...');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  updateUser: (data) => api.put('/user', data),
};

// Tambahkan di productAPI:
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getAllIncludingPending: (params = {}) => api.get('/all-products', { params }), // New endpoint
  getMyProducts: () => api.get('/my-products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) => 
    api.post(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const transactionAPI = {
  create: (data) => api.post('/transactions', data),
  getMyTransactions: () => api.get('/my-transactions'),
  confirm: (id) => api.patch(`/transactions/${id}/confirm`),
  cancel: (id) => api.patch(`/transactions/${id}/cancel`),
  getById: (id) => api.get(`/transactions/${id}`),
};

// =====================
// 🔄 UPDATED BARTER API
// =====================
export const barterAPI = {
  create: (data) => api.post('/barters', data),
  getMyBarters: () => api.get('/my-barters'),
  accept: (id) => api.patch(`/barters/${id}/accept`),
  reject: (id) => api.patch(`/barters/${id}/reject`),
  complete: (id) => api.patch(`/barters/${id}/complete`),
  cancel: (id) => api.patch(`/barters/${id}/cancel`), // ✅ TAMBAH INI
};

// =======================
// 🔄 UPDATED TRADE-IN API
// =======================
export const tradeInAPI = {
  create: (data) => api.post('/trade-ins', data),
  getMyTradeIns: () => api.get('/my-trade-ins'),
  accept: (id) => api.patch(`/trade-ins/${id}/accept`),
  reject: (id) => api.patch(`/trade-ins/${id}/reject`),
  pay: (id) => api.patch(`/trade-ins/${id}/pay`),
  cancel: (id) => api.patch(`/trade-ins/${id}/cancel`), // Tambah ini
};

// =======================
// VERIFICATION & ADMIN API
// =======================
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/${userId}`),
};

// Verification API
export const verificationAPI = {
  getPending: () => api.get('/verifications/pending'),
  getApproved: () => api.get('/verifications/verified'),
  getRejected: () => api.get('/verifications/rejected'),
  verifyProduct: (id, data) => api.patch(`/verifications/${id}`, data),
};

// Admin API
export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getPendingVerifications: () => api.get('/verifications/pending'),
  verifyProduct: (id, data) => api.patch(`/verifications/${id}`, data),
};

export default api;
