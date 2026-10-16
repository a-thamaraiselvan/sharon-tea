import { apiClient } from '../lib/apiClient';
import {
  DeliveryPartner,
  CreateDeliveryPartnerInput,
  UpdateDeliveryPartnerInput,
  ApiResponse,
} from '../types';

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

export const deliveryPartnerService = {
  async getAll(): Promise<DeliveryPartner[]> {
    try {
      const response = await apiClient.get<ApiResponse<DeliveryPartner[]>>('/DeliveryPartner/GetDeliveryPartners');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return FALLBACK_DELIVERY_PARTNERS;
    } catch {
      return FALLBACK_DELIVERY_PARTNERS;
    }
  },

  async getById(id: string): Promise<DeliveryPartner> {
    const response = await apiClient.get<ApiResponse<DeliveryPartner>>(`/DeliveryPartner/GetDeliveryPartnerById/${id}`);
    return response.data.data;
  },

  async create(data: CreateDeliveryPartnerInput): Promise<DeliveryPartner> {
    const response = await apiClient.post<ApiResponse<DeliveryPartner>>('/DeliveryPartner/CreateDeliveryPartner', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateDeliveryPartnerInput): Promise<DeliveryPartner> {
    const response = await apiClient.put<ApiResponse<DeliveryPartner>>(`/DeliveryPartner/UpdateDeliveryPartner/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/DeliveryPartner/DeleteDeliveryPartner/${id}`);
  },

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.post('/DeliveryPartner/BulkDeleteDeliveryPartners', { ids });
    } catch {
      await Promise.all(ids.map((id) => this.delete(id)));
    }
  },

  async toggleActive(id: string, isActive: boolean): Promise<DeliveryPartner> {
    const response = await apiClient.patch<ApiResponse<DeliveryPartner>>(`/DeliveryPartner/ToggleDeliveryPartnerActive/${id}`, {
      isActive,
    });
    return response.data.data;
  },
};
