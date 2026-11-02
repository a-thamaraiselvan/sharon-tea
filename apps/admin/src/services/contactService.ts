import { apiClient } from '../lib/apiClient';
import {
  ContactEnquiry,
  UpdateContactEnquiryInput,
  ApiResponse,
} from '../types';

export const contactService = {
  async list(params?: { status?: string; search?: string }): Promise<ContactEnquiry[]> {
    const response = await apiClient.get<ApiResponse<ContactEnquiry[]>>('/ContactEnquiry/GetContactEnquiries', {
      params,
    });
    const items = response.data?.data;
    if (Array.isArray(items)) {
      return items.map((item: any) => ({
        ...item,
        businessId: item.businessId || item.business_id || '',
        createdAt: item.createdAt || item.created_at || '',
        updatedAt: item.updatedAt || item.updated_at || '',
        adminNotes: item.adminNotes || item.admin_notes || '',
      }));
    }
    return [];
  },

  async getById(id: string): Promise<ContactEnquiry> {
    const response = await apiClient.get<ApiResponse<ContactEnquiry>>(`/ContactEnquiry/GetContactEnquiryById/${id}`);
    return response.data.data;
  },

  async update(id: string, data: UpdateContactEnquiryInput): Promise<ContactEnquiry> {
    const response = await apiClient.put<ApiResponse<ContactEnquiry>>(
      `/ContactEnquiry/UpdateContactEnquiry/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/ContactEnquiry/DeleteContactEnquiry/${id}`);
  },
};
