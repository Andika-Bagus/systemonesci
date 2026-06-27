import axios from 'axios';

// Ensure API_BASE_URL has /api suffix and no trailing slash issues
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.itmsci.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
  timeout: 30000, // 30 second timeout for most requests
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on actual 401 response, not on timeout or network errors
    // But skip logout for OJS Secure routes - let them handle their own auth
    if (error.response?.status === 401 && !error.config?.url?.includes('/ojs-secure/')) {
      // Token expired or invalid for main system
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    // For timeout, OJS secure routes, or other errors, just reject without logging out
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (email: string, password: string) => api.post('/login', { email, password }, { timeout: 15000 }), // 15 second timeout for login
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// Websites
export const websiteAPI = {
  getAll: () => api.get('/websites'),
  getById: (id: number) => api.get(`/websites/${id}`),
  create: (data: any) => api.post('/websites', data),
  update: (id: number, data: any) => api.put(`/websites/${id}`, data),
  delete: (id: number) => api.delete(`/websites/${id}`),
};

// OJS Instances
export const ojsAPI = {
  getAll: () => api.get('/ojs-instances'),
  getById: (id: number) => api.get(`/ojs-instances/${id}`),
  create: (data: any) => api.post('/ojs-instances', data),
  update: (id: number, data: any) => api.put(`/ojs-instances/${id}`, data),
  delete: (id: number) => api.delete(`/ojs-instances/${id}`),
};

// SOP Webs
export const sopWebAPI = {
  getAll: () => api.get('/sop-webs'),
  getById: (id: number) => api.get(`/sop-webs/${id}`),
  create: (data: any) => api.post('/sop-webs', data),
  update: (id: number, data: any) => api.put(`/sop-webs/${id}`, data),
  delete: (id: number) => api.delete(`/sop-webs/${id}`),
};

// Tickets
export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id: number) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  delete: (id: number) => api.delete(`/tickets/${id}`),
  getStats: () => api.get('/tickets-stats'),
};

// PageSpeed
export const pageSpeedAPI = {
  check: (websiteId: number) => api.post(`/page-speed/check/${websiteId}`, {}, { timeout: 300000 }), // 5 minutes timeout
  get: (websiteId: number) => api.get(`/page-speed/${websiteId}`),
  getAll: () => api.get('/page-speeds'),
  getStatsByAds: (period?: string) => api.get('/page-speed-stats-by-ads', { params: { period } }),
  getDetailedBreakdown: (period?: string) => api.get('/page-speed-detailed-breakdown', { params: { period } }),
  delete: (websiteId: number) => api.delete(`/page-speed/${websiteId}`),
};

// Notifications
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  delete: (id: number) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications'),
};

// AI Assistant
export const aiAPI = {
  chat: (message: string, websiteId?: number, includeStats?: boolean) => 
    api.post('/ai/chat', { message, website_id: websiteId, include_stats: includeStats }),
  getSuggestions: (websiteId?: number) => 
    api.get('/ai/suggestions', { params: { website_id: websiteId } }),
};

// Gambling Detection
export const gamblingAPI = {
  scan: (websiteId: number) => api.post(`/gambling/scan/${websiteId}`, {}, { timeout: 60000 }), // 60 seconds
  bulkScan: (websiteIds: number[]) => api.post('/gambling/bulk-scan', { website_ids: websiteIds }, { timeout: 300000 }), // 5 minutes for bulk scan
  getLatestScan: (websiteId: number) => api.get(`/gambling/scan/${websiteId}`),
  getAllScans: () => api.get('/gambling/scans'),
  getStats: () => api.get('/gambling/stats'),
  getByStatus: (status: string) => api.get(`/gambling/status/${status}`),
};

// Domain Expiry
export const domainAPI = {
  check: (websiteId: number) => api.post(`/domain/check/${websiteId}`, {}, { timeout: 60000 }), // 60 seconds timeout for WHOIS
  getAll: () => api.get('/domains'),
  getExpiringSoon: () => api.get('/domains/expiring-soon'),
  getStats: () => api.get('/domains/stats'),
};

export default api;
