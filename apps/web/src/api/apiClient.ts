import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can attach auth headers or client trace IDs here if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.warn(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.warn('[API Network Error]: No response received from server. Operating with fallback data.');
    } else {
      console.warn('[API Setup Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
