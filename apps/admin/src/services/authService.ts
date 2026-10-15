import { apiClient } from '../lib/apiClient';
import {
  AuthResponse,
  LoginCredentials,
  ChangePasswordPayload,
  User,
  ApiResponse,
} from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<any>>('/Auth/Login', credentials);
    const data = response.data.data;
    const accessToken = data.tokens?.accessToken || data.accessToken;
    const refreshToken = data.tokens?.refreshToken || data.refreshToken;
    const user: User = {
      ...data.user,
      fullName: data.user?.fullName || data.user?.name || 'Administrator',
    };
    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
      '/Auth/RefreshToken',
      { refreshToken }
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/Auth/Logout');
    } catch (e) {
      console.warn('Backend logout call failed or endpoint unavailable:', e);
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/Auth/Me');
    return response.data.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.post('/Auth/ChangePassword', payload);
  },
};
