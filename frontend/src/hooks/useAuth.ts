'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth, logout: clearAuth } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<{ data: AuthResponse }>(
        '/api/auth/login',
        credentials,
      );
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      router.push('/dashboard');
      return data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<{ data: AuthResponse }>(
        '/api/auth/register',
        registerData,
      );
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      router.push('/dashboard');
      return data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch {
      // ignore
    } finally {
      clearAuth();
      router.push('/auth/login');
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await axiosInstance.post<{ data: AuthResponse }>(
        '/api/auth/refresh-token',
        {},
        { withCredentials: true },
      );
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      return data.data;
    } catch {
      clearAuth();
      router.push('/auth/login');
      return null;
    }
  };

  return { login, register, logout, refreshToken, loading, error };
}
