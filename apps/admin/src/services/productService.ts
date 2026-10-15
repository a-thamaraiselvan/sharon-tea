import { apiClient } from '../lib/apiClient';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ApiResponse,
} from '../types';

export const productService = {
  async getAll(params?: { search?: string }): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/Product/GetProducts', {
      params: { ...params, type: 'retail' },
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/Product/GetProductById/${id}`);
    return response.data.data;
  },

  async create(data: CreateProductInput): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/Product/CreateProduct', {
      ...data,
      type: 'retail',
    });
    return response.data.data;
  },

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/Product/UpdateProduct/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Product/DeleteProduct/${id}`);
  },

  async toggleAvailability(id: string, isAvailable: boolean): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(`/Product/UpdateProductAvailability/${id}`, {
      isAvailable,
    });
    return response.data.data;
  },
};
