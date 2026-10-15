import { apiClient } from '../lib/apiClient';
import {
  MenuItem,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  ApiResponse,
} from '../types';

export const menuItemService = {
  async getAll(params?: { categoryId?: string; search?: string }): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>('/Product/GetProducts', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<MenuItem> {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/Product/GetProductById/${id}`);
    return response.data.data;
  },

  async create(data: CreateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.post<ApiResponse<MenuItem>>('/Product/CreateProduct', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateMenuItemInput): Promise<MenuItem> {
    const response = await apiClient.put<ApiResponse<MenuItem>>(`/Product/UpdateProduct/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Product/DeleteProduct/${id}`);
  },

  async toggleAvailability(id: string, isAvailable: boolean): Promise<MenuItem> {
    const response = await apiClient.patch<ApiResponse<MenuItem>>(`/Product/UpdateProductAvailability/${id}`, {
      isAvailable,
    });
    return response.data.data;
  },
};
