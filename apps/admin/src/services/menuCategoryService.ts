import { apiClient } from '../lib/apiClient';
import {
  MenuCategory,
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  ApiResponse,
} from '../types';

export const menuCategoryService = {
  async getAll(): Promise<MenuCategory[]> {
    const response = await apiClient.get<ApiResponse<MenuCategory[]>>('/ProductCategory/GetProductCategories');
    return response.data.data;
  },

  async getById(id: string): Promise<MenuCategory> {
    const response = await apiClient.get<ApiResponse<MenuCategory>>(`/ProductCategory/GetProductCategoryById/${id}`);
    return response.data.data;
  },

  async create(data: CreateMenuCategoryInput): Promise<MenuCategory> {
    const response = await apiClient.post<ApiResponse<MenuCategory>>('/ProductCategory/CreateProductCategory', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateMenuCategoryInput): Promise<MenuCategory> {
    const response = await apiClient.put<ApiResponse<MenuCategory>>(`/ProductCategory/UpdateProductCategory/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/ProductCategory/DeleteProductCategory/${id}`);
  },

  async toggleActive(id: string, isActive: boolean): Promise<MenuCategory> {
    const response = await apiClient.put<ApiResponse<MenuCategory>>(`/ProductCategory/UpdateProductCategory/${id}`, {
      isActive,
    });
    return response.data.data;
  },

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await apiClient.patch('/ProductCategory/UpdateProductCategorySortOrder', { items });
  },
};
