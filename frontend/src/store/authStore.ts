import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('hoa_token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/register', userData);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/verify-otp', { email, otp });
          localStorage.setItem('hoa_token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('hoa_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set(state => ({ user: state.user ? { ...state.user, ...userData } : null }));
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'hoa-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
