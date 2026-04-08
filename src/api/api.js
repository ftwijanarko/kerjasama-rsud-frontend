import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token and set Content-Type appropriately
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let axios auto-detect Content-Type for FormData (multipart)
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// === Auth ===
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// === Dashboard ===
export const getDashboardSummary = () => api.get('/dashboard/summary');

// === Mitra ===
export const getMitraList = (search) => api.get('/mitra', { params: { search } });
export const getMitra = (id) => api.get(`/mitra/${id}`);
export const createMitra = (data) => api.post('/mitra', data);
export const updateMitra = (id, data) => api.put(`/mitra/${id}`, data);
export const deleteMitra = (id) => api.delete(`/mitra/${id}`);

// === Kerjasama ===
export const getKerjasamaList = (params) => api.get('/kerjasama', { params });
export const getKerjasama = (id) => api.get(`/kerjasama/${id}`);
export const createKerjasama = (data) => api.post('/kerjasama', data);
export const updateKerjasama = (id, data) => api.put(`/kerjasama/${id}`, data);
export const deleteKerjasama = (id) => api.delete(`/kerjasama/${id}`);
export const approveKerjasama = (id, data) => api.put(`/kerjasama/${id}/approve`, data);
export const rejectKerjasama = (id, data) => api.put(`/kerjasama/${id}/reject`, data);

// === Dokumen ===
export const getDokumenList = (kerjasamaId) => api.get(`/kerjasama/${kerjasamaId}/dokumen`);
export const uploadDokumen = (kerjasamaId, formData) =>
  api.post(`/kerjasama/${kerjasamaId}/dokumen`, formData);
export const downloadDokumen = (id) =>
  api.get(`/dokumen/${id}/download`, { responseType: 'blob' });
export const deleteDokumen = (id) => api.delete(`/dokumen/${id}`);

// === Settings ===
export const getSettings = () => api.get('/settings');
export const getSettingByKey = (key) => api.get(`/settings/key/${key}`);
export const createSetting = (data) => api.post('/settings', data);
export const updateSetting = (id, data) => api.put(`/settings/${id}`, data);
export const deleteSetting = (id) => api.delete(`/settings/${id}`);

// === Users ===
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// === Audit Trail ===
export const getAuditTrails = () => api.get('/audit-trail');
export const getAuditByKerjasama = (id) => api.get(`/audit-trail/kerjasama/${id}`);

export default api;
