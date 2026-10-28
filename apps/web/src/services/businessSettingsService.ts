import apiClient from '@/api/apiClient';
import type { BusinessSettings, ApiResponse } from '@/types';
import { setDynamicWhatsAppNumber } from '@/utils/whatsappLink';

export const FALLBACK_BUSINESS_SETTINGS: BusinessSettings = {
  brandName: 'Sharon Tea and Coffee',
  tagline: 'Every Cup, A Moment to Savour.',
  phone: '+91 99169 99209',
  whatsappNumber: '919916999209',
  email: 'contact@sharonteaandcoffee.com',
  address: '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038',
  cupsServedCount: 8000,
  outletsCount: 6,
  socialLinks: {
    instagram: 'https://www.instagram.com/sharon_tea__official?rpxt=MWMweHplZWZjMmV0aQ%3D%3D&utm_source=qr',
    facebook: 'https://facebook.com/sharonteaandcoffee',
    youtube: 'https://youtube.com/@sharonteaandcoffee',
    twitter: 'https://twitter.com/sharonteaandcoffee',
  },
};

export async function getPublicBusinessSettings(): Promise<BusinessSettings> {
  try {
    const response = await apiClient.get<ApiResponse<BusinessSettings>>('/BusinessSetting/GetPublicBusinessSettings');
    if (response.data?.data) {
      const data = response.data.data;
      const waNum = data.whatsappNumber || (data as any).whatsapp_number;
      if (waNum) {
        setDynamicWhatsAppNumber(waNum);
      }
      return data;
    }
  } catch {
    // Return fallback settings
  }
  setDynamicWhatsAppNumber(FALLBACK_BUSINESS_SETTINGS.whatsappNumber);
  return FALLBACK_BUSINESS_SETTINGS;
}
