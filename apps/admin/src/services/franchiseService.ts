import { apiClient } from '../lib/apiClient';
import {
  FranchiseEnquiry,
  UpdateFranchiseEnquiryInput,
  ApiResponse,
} from '../types';

export const franchiseService = {
  async list(params?: { status?: string; search?: string }): Promise<FranchiseEnquiry[]> {
    const response = await apiClient.get<ApiResponse<FranchiseEnquiry[]>>('/FranchiseEnquiry/GetFranchiseEnquiries', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<FranchiseEnquiry> {
    const response = await apiClient.get<ApiResponse<FranchiseEnquiry>>(`/FranchiseEnquiry/GetFranchiseEnquiryById/${id}`);
    return response.data.data;
  },

  async update(id: string, data: UpdateFranchiseEnquiryInput): Promise<FranchiseEnquiry> {
    const response = await apiClient.put<ApiResponse<FranchiseEnquiry>>(
      `/FranchiseEnquiry/UpdateFranchiseEnquiry/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/FranchiseEnquiry/DeleteFranchiseEnquiry/${id}`);
  },
};
