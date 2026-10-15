import { businessSettingRepository } from './repository.js';
import { BusinessSettingRecord } from '../../types/index.js';

export class BusinessSettingService {
  async getPublicSettings(): Promise<any> {
    const settings = await businessSettingRepository.getSettings();
    if (!settings) {
      return {
        brandName: 'Sharon Tea Stall',
        brand_name: 'Sharon Tea Stall',
        tagline: 'Authentic Chai & Moments of Warmth',
        phone: '+91 98765 43210',
        email: 'contact@sharonteastall.com',
        whatsappNumber: '919876543210',
        whatsapp_number: '919876543210',
        address: 'Chennai, Tamil Nadu',
        operatingHours: '6:00 AM - 11:00 PM Everyday',
        operating_hours: '6:00 AM - 11:00 PM Everyday',
        logoUrl: '/Sharon_logo.jpg',
        logo_url: '/Sharon_logo.jpg',
        faviconUrl: '/favicon.ico',
        favicon_url: '/favicon.ico',
        announcementText: null,
        announcement_text: null,
        announcementActive: false,
        announcement_active: false,
      };
    }

    return {
      brandName: settings.brand_name,
      brand_name: settings.brand_name,
      tagline: settings.tagline,
      description: settings.description,
      phone: settings.phone,
      email: settings.email,
      whatsappNumber: settings.whatsapp_number,
      whatsapp_number: settings.whatsapp_number,
      address: settings.address,
      operatingHours: settings.operating_hours,
      operating_hours: settings.operating_hours,
      fssaiLicense: settings.fssai_license,
      fssai_license: settings.fssai_license,
      socialLinks: settings.social_links,
      social_links: settings.social_links,
      logoUrl: settings.logo_url || '/Sharon_logo.jpg',
      logo_url: settings.logo_url || '/Sharon_logo.jpg',
      faviconUrl: settings.favicon_url || '/favicon.ico',
      favicon_url: settings.favicon_url || '/favicon.ico',
      announcementText: settings.announcement_active ? settings.announcement_text : null,
      announcement_text: settings.announcement_active ? settings.announcement_text : null,
      announcementActive: settings.announcement_active,
      announcement_active: settings.announcement_active,
    };
  }

  async getAllSettings(): Promise<BusinessSettingRecord | null> {
    return businessSettingRepository.getSettings();
  }

  async updateSettings(data: {
    brand_name?: string;
    tagline?: string | null;
    description?: string | null;
    phone?: string | null;
    email?: string | null;
    whatsapp_number?: string | null;
    address?: string | null;
    operating_hours?: string | null;
    fssai_license?: string | null;
    social_links?: Record<string, string>;
    announcement_text?: string | null;
    announcement_active?: boolean;
  }): Promise<BusinessSettingRecord> {
    return businessSettingRepository.updateSettings(data);
  }
}

export const businessSettingService = new BusinessSettingService();
