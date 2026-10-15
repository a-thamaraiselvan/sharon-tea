import { create } from 'zustand';
import { User, AuthTokens } from '../types';
import { secureStorage } from '../lib/secureStorage';

interface StoredAuth {
  tokens: AuthTokens | null;
  user: User | null;
}

const AUTH_STORAGE_KEY = 'sharon_auth_state';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: User) => void;
}

// Read persisted data on module load
const getInitialState = (): {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
} => {
  try {
    const saved = secureStorage.getItem<StoredAuth>(AUTH_STORAGE_KEY);
    if (saved && saved.tokens?.accessToken) {
      return {
        accessToken: saved.tokens.accessToken,
        refreshToken: saved.tokens.refreshToken,
        user: saved.user,
        isAuthenticated: true,
      };
    }
  } catch (err) {
    console.error('Error hydrating auth state:', err);
  }

  return {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  };
};

const initial = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,

  login: (tokens: AuthTokens, user: User) => {
    secureStorage.setItem(AUTH_STORAGE_KEY, { tokens, user });
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    secureStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setTokens: (tokens: AuthTokens) => {
    const currentUser = get().user;
    secureStorage.setItem(AUTH_STORAGE_KEY, { tokens, user: currentUser });
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    const { accessToken, refreshToken } = get();
    if (accessToken && refreshToken) {
      secureStorage.setItem(AUTH_STORAGE_KEY, {
        tokens: { accessToken, refreshToken },
        user,
      });
    }
    set({ user });
  },
}));
