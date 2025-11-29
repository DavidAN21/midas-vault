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

export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getMyProducts: () => api.get('/my-products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // 🔥 PERBAIKAN: Tambah headers multipart untuk update juga
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
  verifyProduct: (id, data) => api.patch(`/verifications/${id}`, data),
  getVerified: () => api.get('/verifications/verified'),
};

// Admin API
export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getPendingVerifications: () => api.get('/verifications/pending'),
  verifyProduct: (id, data) => api.patch(`/verifications/${id}`, data),
};

export default api;
