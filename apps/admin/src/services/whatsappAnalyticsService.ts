import { apiClient } from '../lib/apiClient';
import { WhatsAppAnalyticsData, ApiResponse } from '../types';

export const whatsappAnalyticsService = {
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    productId?: string;
  }): Promise<WhatsAppAnalyticsData> {
    const response = await apiClient.get<ApiResponse<any>>(
      '/WhatsAppOrder/GetAnalyticsSummary',
      { params }
    );
    const raw = response.data?.data || {};

    // Support both pre-formatted { summary, products, dailyClicks } and raw backend { totalClicks, byProduct, dailyTrends }
    const byProduct = Array.isArray(raw.byProduct) ? raw.byProduct : [];
    const dailyTrends = Array.isArray(raw.dailyTrends) ? raw.dailyTrends : [];

    const products = Array.isArray(raw.products) && raw.products.length > 0
      ? raw.products
      : byProduct.map((p: any, idx: number) => ({
          productId: p.productId || `p-${idx + 1}`,
          productName: p.productName || p.product_name || 'Tea Order',
          totalClicks: p.totalClicks ?? p.click_count ?? 0,
          lastClickDate: p.lastClickDate || new Date().toISOString(),
        }));

    const dailyClicks = Array.isArray(raw.dailyClicks) && raw.dailyClicks.length > 0
      ? raw.dailyClicks
      : dailyTrends.map((d: any) => ({
          date: d.date,
          clicks: d.clicks ?? d.count ?? 0,
        }));

    const totalClicks = raw.summary?.totalClicks ?? raw.totalClicks ?? products.reduce((acc: number, cur: any) => acc + (cur.totalClicks || 0), 0);
    const uniqueProducts = raw.summary?.uniqueProducts ?? products.length;
    const mostPopularProduct = raw.summary?.mostPopularProduct ?? (products.length > 0 ? { name: products[0].productName, clicks: products[0].totalClicks } : null);

    return {
      summary: {
        totalClicks,
        uniqueProducts,
        mostPopularProduct,
      },
      products,
      dailyClicks,
    };
  },
};
