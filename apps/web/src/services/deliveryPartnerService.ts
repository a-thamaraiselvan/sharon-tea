import apiClient from '@/api/apiClient';
import type { DeliveryPartner, ApiResponse } from '@/types';

export const SWIGGY_DELIVERY_URL =
  'https://www.swiggy.com/direct/brand/182245?source=swiggy-direct&subSource=generic';
export const ZOMATO_DELIVERY_URL = 'https://zoma.to/r/22048775';

export const resolvePartnerUrl = (partner: {
  slug?: string;
  name?: string;
  partnerUrl?: string | null;
  partner_url?: string | null;
}): string => {
  const slug = (partner?.slug || partner?.name || '').toLowerCase();
  const url = partner?.partnerUrl || partner?.partner_url || '';

  if (slug.includes('zomato') || url.includes('zomato.com') || url.includes('zoma.to')) {
    return ZOMATO_DELIVERY_URL;
  }
  if (slug.includes('swiggy') || url.includes('swiggy.com')) {
    return SWIGGY_DELIVERY_URL;
  }
  return url || SWIGGY_DELIVERY_URL;
};

export const FALLBACK_DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'partner-swiggy',
    name: 'Swiggy',
    slug: 'swiggy',
    logoUrl: '/images/delivery/swiggy.svg',
    partnerUrl: SWIGGY_DELIVERY_URL,
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
    partnerUrl: ZOMATO_DELIVERY_URL,
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
