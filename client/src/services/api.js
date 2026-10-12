import axios from 'axios';

// Get API base URL with fallback to deployed production backend
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  let url = (envUrl || 'https://power-max-api.vercel.app/api').trim();
  // Remove any trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure it has /api prefix if provided without it
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }
  return url;
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('pm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear session and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pm_token');
      localStorage.removeItem('pm_user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  changePassword: (data) => api.post('/auth/me/change-password', data)
};

// ─── Products ──────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  // Admin
  adminList: (params) => api.get('/products/admin/list', { params }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// ─── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  // Admin
  adminList: () => api.get('/categories/admin/list'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  // Admin
  adminList: (params) => api.get('/orders/admin/list', { params }),
  updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data)
};

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.patch('/settings', data)
};

// ─── Bridal Packages ───────────────────────────────────────────────────────
export const bridalApi = {
  list: () => api.get('/bridal'),
  getBySlug: (slug) => api.get(`/bridal/${slug}`),
  adminList: () => api.get('/bridal/admin/list'),
  create: (data) => api.post('/bridal', data),
  update: (id, data) => api.patch(`/bridal/${id}`, data),
  delete: (id) => api.delete(`/bridal/${id}`)
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getCustomerById: (id) => api.get(`/admin/customers/${id}`)
};

export default api;
