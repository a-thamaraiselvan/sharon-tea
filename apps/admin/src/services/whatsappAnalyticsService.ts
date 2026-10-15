import { apiClient } from '../lib/apiClient';
import { WhatsAppAnalyticsData, ApiResponse } from '../types';

export const whatsappAnalyticsService = {
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
  }): Promise<WhatsAppAnalyticsData> {
    const response = await apiClient.get<ApiResponse<WhatsAppAnalyticsData>>(
      '/WhatsAppOrder/GetAnalyticsSummary',
      { params }
    );
    return response.data.data;
  },
};
