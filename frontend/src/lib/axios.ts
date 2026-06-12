import axios from 'axios';
import { API_BASE_URL } from './constants';
import type { AuthState } from '@/store/authStore';

let store: {
  getState: () => AuthState;
} | null = null;

function getStore() {
  if (!store) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    store = require('../store/authStore').useAuthStore;
  }
  return store;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const state = getStore()?.getState();
  if (state?.accessToken) {
    config.headers.Authorization = `Bearer ${state.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = getStore()?.getState().refreshToken;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          { token: refreshToken },
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          getStore()?.getState().updateToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        getStore()?.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
