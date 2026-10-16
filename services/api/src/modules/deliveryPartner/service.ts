import { deliveryPartnerRepository } from './repository.js';
import { DeliveryPartnerRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class DeliveryPartnerService {
  private formatPartner(record: DeliveryPartnerRecord) {
    return {
      ...record,
      id: record.id,
      name: record.name,
      slug: record.slug,
      logoUrl: record.logo_url,
      partnerUrl: record.partner_url,
      badgeText: record.badge_text,
      description: record.description,
      isActive: record.is_active,
      sortOrder: record.sort_order,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  async getPublicPartners(): Promise<any[]> {
    const list = await deliveryPartnerRepository.findPublic();
    return list.map(this.formatPartner);
  }

  async getAllPartners(): Promise<any[]> {
    const list = await deliveryPartnerRepository.findAll();
    return list.map(this.formatPartner);
  }

  async getPartnerById(id: string): Promise<any> {
    const partner = await deliveryPartnerRepository.findById(id);
    if (!partner) {
      throw new AppError('Delivery partner not found', 404);
    }
    return this.formatPartner(partner);
  }

  async createPartner(data: any): Promise<any> {
    const name = data.name;
    const slug = data.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const logo_url = data.logo_url ?? data.logoUrl ?? null;
    const partner_url = data.partner_url ?? data.partnerUrl ?? null;
    const badge_text = data.badge_text ?? data.badgeText ?? null;
    const description = data.description ?? null;
    const sort_order = Number(data.sort_order ?? data.sortOrder ?? 0);
    const is_active = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);

    const created = await deliveryPartnerRepository.create({
      name,
      slug,
      logo_url,
      partner_url,
      badge_text,
      description,
      sort_order,
      is_active,
    });
    return this.formatPartner(created);
  }

  async updatePartner(id: string, data: any): Promise<any> {
    const existing = await deliveryPartnerRepository.findById(id);
    if (!existing) {
      throw new AppError('Delivery partner not found', 404);
    }

    const payload: any = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.logo_url !== undefined || data.logoUrl !== undefined) {
      payload.logo_url = data.logo_url ?? data.logoUrl;
    }
    if (data.partner_url !== undefined || data.partnerUrl !== undefined) {
      payload.partner_url = data.partner_url ?? data.partnerUrl;
    }
    if (data.badge_text !== undefined || data.badgeText !== undefined) {
      payload.badge_text = data.badge_text ?? data.badgeText;
    }
    if (data.description !== undefined) payload.description = data.description;
    if (data.sort_order !== undefined || data.sortOrder !== undefined) {
      payload.sort_order = Number(data.sort_order ?? data.sortOrder);
    }
    if (data.is_active !== undefined || data.isActive !== undefined) {
      payload.is_active = Boolean(data.is_active ?? data.isActive);
    }

    const updated = await deliveryPartnerRepository.update(id, payload);
    return this.formatPartner(updated!);
  }

  async deletePartner(id: string): Promise<boolean> {
    const existing = await deliveryPartnerRepository.findById(id);
    if (!existing) {
      throw new AppError('Delivery partner not found', 404);
    }
    return deliveryPartnerRepository.delete(id);
  }

  async bulkDeletePartners(ids: string[]): Promise<number> {
    return deliveryPartnerRepository.bulkDelete(ids);
  }

  async toggleActive(id: string, isActive: boolean): Promise<any> {
    const existing = await deliveryPartnerRepository.findById(id);
    if (!existing) {
      throw new AppError('Delivery partner not found', 404);
    }
    const updated = await deliveryPartnerRepository.toggleActive(id, isActive);
    return this.formatPartner(updated!);
  }
}

export const deliveryPartnerService = new DeliveryPartnerService();
