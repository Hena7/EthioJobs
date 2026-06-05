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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
      updateToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'ethiojobs-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
