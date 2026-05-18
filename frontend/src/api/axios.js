import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

console.log("🔍 [Debug] import.meta.env.VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
console.log("🌐 [Debug] Axios baseURL resolved to:", api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });
        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access_token);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
