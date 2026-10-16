import apiClient from '@/api/apiClient';
import type { DeliveryPartner, ApiResponse } from '@/types';

export const FALLBACK_DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'partner-swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logoUrl: '/images/delivery/swiggy.svg',
    partnerUrl: 'https://www.swiggy.com',
    badgeText: '30-40 Mins',
    description: 'Order Sharon classic chai, special spiced brews, and evening snacks directly on Swiggy.',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'partner-zomato',
    name: 'Zomato',
    slug: 'zomato',
    logoUrl: '/images/delivery/zomato.svg',
    partnerUrl: 'https://www.zomato.com',
    badgeText: 'Live Tracking',
    description: 'Enjoy piping hot Sharon Tea and Coffee delivered fresh to your doorstep via Zomato.',
    isActive: true,
    sortOrder: 2,
  },
];

export async function getPublicDeliveryPartners(): Promise<DeliveryPartner[]> {
  try {
    const response = await apiClient.get<ApiResponse<DeliveryPartner[]>>(
      '/DeliveryPartner/GetPublicDeliveryPartners'
    );
    const data = response.data?.data;
    if (Array.isArray(data) && data.length > 0) {
      return data.filter((p) => p.isActive !== false && p.is_active !== false);
    }
  } catch {
    // API network or endpoint fallback
  }
  return FALLBACK_DELIVERY_PARTNERS;
}
