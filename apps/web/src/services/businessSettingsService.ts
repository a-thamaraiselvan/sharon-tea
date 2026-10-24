import apiClient from '@/api/apiClient';
import type { BusinessSettings, ApiResponse } from '@/types';

export const FALLBACK_BUSINESS_SETTINGS: BusinessSettings = {
  brandName: 'Sharon Tea and Coffee',
  tagline: 'Every Cup, A Moment to Savour.',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'contact@sharonteastall.com',
  address: '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038',
  cupsServedCount: 8000,
  outletsCount: 6,
  socialLinks: {
    instagram: 'https://www.instagram.com/sharon_tea__official?rpxt=MWMweHplZWZjMmV0aQ%3D%3D&utm_source=qr',
    facebook: 'https://facebook.com/sharonteastall',
    youtube: 'https://youtube.com/@sharonteastall',
    twitter: 'https://twitter.com/sharonteastall',
  },
};

export async function getPublicBusinessSettings(): Promise<BusinessSettings> {
  try {
    const response = await apiClient.get<ApiResponse<BusinessSettings>>('/BusinessSetting/GetPublicBusinessSettings');
    if (response.data?.data) {
      return response.data.data;
    }
  } catch {
    // Return fallback settings
  }
  return FALLBACK_BUSINESS_SETTINGS;
}
