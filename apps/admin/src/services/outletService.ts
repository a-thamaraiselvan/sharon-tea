import { apiClient } from '../lib/apiClient';
import {
  Outlet,
  CreateOutletInput,
  UpdateOutletInput,
  ApiResponse,
} from '../types';

export const outletService = {
  async getAll(): Promise<Outlet[]> {
    const response = await apiClient.get<ApiResponse<Outlet[]>>('/Outlet/GetOutlets');
    return response.data.data;
  },

  async getById(id: string): Promise<Outlet> {
    const response = await apiClient.get<ApiResponse<Outlet>>(`/Outlet/GetOutletById/${id}`);
    return response.data.data;
  },

  async create(data: CreateOutletInput): Promise<Outlet> {
    const response = await apiClient.post<ApiResponse<Outlet>>('/Outlet/CreateOutlet', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateOutletInput): Promise<Outlet> {
    const response = await apiClient.put<ApiResponse<Outlet>>(`/Outlet/UpdateOutlet/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Outlet/DeleteOutlet/${id}`);
  },

  async toggleActive(id: string, isActive: boolean): Promise<Outlet> {
    const response = await apiClient.put<ApiResponse<Outlet>>(`/Outlet/UpdateOutlet/${id}`, {
      isActive,
    });
    return response.data.data;
  },
};
