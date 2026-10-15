import { apiClient } from '../lib/apiClient';
import {
  BusinessSettings,
  UpdateBusinessSettingsInput,
  ApiResponse,
} from '../types';

export const businessSettingsService = {
  async get(): Promise<BusinessSettings> {
    const response = await apiClient.get<ApiResponse<BusinessSettings>>('/BusinessSetting/GetBusinessSettings');
    return response.data.data;
  },

  async update(data: UpdateBusinessSettingsInput): Promise<BusinessSettings> {
    const response = await apiClient.put<ApiResponse<BusinessSettings>>('/BusinessSetting/UpdateBusinessSettings', data);
    return response.data.data;
  },
};
