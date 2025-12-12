import axios from 'axios';
import { Toast } from '@/components/ui/toast';

const instance = axios.create({
  baseURL: import.meta.env.VITE_URI,
  withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const response = await instance.post('/login', {}, {
          headers: { Authorization: localStorage.getItem('authToken') }
        });

        if (response.status === 200) {
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh failure
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
        Toast.error('Session expired. Please login again.');
      }
    }

    return Promise.reject(error);
  }
);

export default instance;