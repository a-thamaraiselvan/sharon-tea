import { businessSettingRepository } from './repository.js';
import { BusinessSettingRecord } from '../../types/index.js';

export class BusinessSettingService {
  async getPublicSettings(): Promise<any> {
    const settings = await businessSettingRepository.getSettings();
    if (!settings) {
      return {
        brandName: 'Sharon Tea and Coffee',
        brand_name: 'Sharon Tea and Coffee',
        tagline: 'Authentic Tea & Coffee Moments',
        phone: '+91 98765 43210',
        email: 'contact@sharonteaandcoffee.com',
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
        isCartEnabled: true,
        is_cart_enabled: true,
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
      isCartEnabled: settings.is_cart_enabled !== false,
      is_cart_enabled: settings.is_cart_enabled !== false,
    };
  }

  async getAllSettings(): Promise<any> {
    const s = await businessSettingRepository.getSettings();
    if (!s) return null;
    return {
      ...s,
      brandName: s.brand_name,
      tagline: s.tagline,
      description: s.description,
      phone: s.phone,
      email: s.email,
      whatsappNumber: s.whatsapp_number,
      address: s.address,
      operatingHours: s.operating_hours,
      fssaiLicense: s.fssai_license,
      socialLinks: s.social_links,
      announcement: {
        text: s.announcement_text,
        isActive: s.announcement_active,
      },
      announcementText: s.announcement_text,
      announcementActive: s.announcement_active,
      isCartEnabled: s.is_cart_enabled !== false,
      is_cart_enabled: s.is_cart_enabled !== false,
      logoUrl: s.logo_url || '/Sharon_logo.jpg',
      faviconUrl: s.favicon_url || '/favicon.ico',
    };
  }

  async updateSettings(data: any): Promise<any> {
    const mapped = {
      brand_name: data.brand_name ?? data.brandName,
      tagline: data.tagline,
      description: data.description,
      phone: data.phone,
      email: data.email,
      whatsapp_number: data.whatsapp_number ?? data.whatsappNumber,
      address: data.address,
      operating_hours: data.operating_hours ?? data.operatingHours,
      fssai_license: data.fssai_license ?? data.fssaiLicense,
      social_links: data.social_links ?? data.socialLinks,
      announcement_text: data.announcement_text ?? data.announcement?.text ?? data.announcementText,
      announcement_active: data.announcement_active ?? data.announcement?.isActive ?? data.announcementActive,
      is_cart_enabled: data.is_cart_enabled ?? data.isCartEnabled,
    };
    const s = await businessSettingRepository.updateSettings(mapped);
    return {
      ...s,
      brandName: s.brand_name,
      tagline: s.tagline,
      description: s.description,
      phone: s.phone,
      email: s.email,
      whatsappNumber: s.whatsapp_number,
      address: s.address,
      operatingHours: s.operating_hours,
      fssaiLicense: s.fssai_license,
      socialLinks: s.social_links,
      announcement: {
        text: s.announcement_text,
        isActive: s.announcement_active,
      },
      announcementText: s.announcement_text,
      announcementActive: s.announcement_active,
      isCartEnabled: s.is_cart_enabled !== false,
      is_cart_enabled: s.is_cart_enabled !== false,
      logoUrl: s.logo_url || '/Sharon_logo.jpg',
      faviconUrl: s.favicon_url || '/favicon.ico',
    };
  }
}

export const businessSettingService = new BusinessSettingService();
