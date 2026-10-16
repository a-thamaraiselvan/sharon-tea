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
    return (response.data.data || []).map((m: any) => ({
      ...m,
      price: Number(m.price ?? 0),
      sortOrder: Number(m.sortOrder ?? m.sort_order ?? 0),
      isVegetarian: m.isVegetarian !== false && m.is_vegetarian !== false,
      isAvailable: m.isAvailable ?? m.is_available ?? true,
      categoryId: m.categoryId || m.category_id,
      categoryName: m.categoryName || m.category_name,
      imageUrl: m.imageUrl || m.image_url,
    }));
  },

  async getById(id: string): Promise<MenuItem> {
    const response = await apiClient.get<ApiResponse<MenuItem>>(`/Product/GetProductById/${id}`);
    return response.data.data;
  },

  async create(data: CreateMenuItemInput): Promise<MenuItem> {
    const payload = {
      ...data,
      category_id: data.categoryId,
      short_description: data.shortDescription,
      image_url: data.imageUrl,
      is_available: data.isAvailable,
      is_vegetarian: data.isVegetarian,
      sort_order: data.sortOrder,
    };
    const response = await apiClient.post<ApiResponse<MenuItem>>('/Product/CreateProduct', payload);
    return response.data.data;
  },

  async update(id: string, data: UpdateMenuItemInput): Promise<MenuItem> {
    const payload = {
      ...data,
      category_id: data.categoryId,
      short_description: data.shortDescription,
      image_url: data.imageUrl,
      is_available: data.isAvailable,
      is_vegetarian: data.isVegetarian,
      sort_order: data.sortOrder,
    };
    const response = await apiClient.put<ApiResponse<MenuItem>>(`/Product/UpdateProduct/${id}`, payload);
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

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  },
};
