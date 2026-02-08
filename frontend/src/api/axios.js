// Axios instance configuration - Will be implemented in Step 5
import axios from 'axios';

const resolveBaseUrl = () => {
  const envBase = import.meta?.env?.VITE_API_BASE_URL;
  if (envBase) {
    return envBase;
  }
  return '/api'; // Use Vite proxy (http://localhost:3000/api -> http://localhost:5000/api)
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
