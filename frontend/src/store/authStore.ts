import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        setCookie('accessToken', accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        removeCookie('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      updateToken: (accessToken) => {
        setCookie('accessToken', accessToken);
        set({ accessToken });
      },
    }),
    {
      name: 'ethiojobs-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
