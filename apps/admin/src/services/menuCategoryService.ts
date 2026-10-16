import { apiClient } from '../lib/apiClient';
import {
  MenuCategory,
  CreateMenuCategoryInput,
  UpdateMenuCategoryInput,
  ApiResponse,
} from '../types';

export const menuCategoryService = {
  async getAll(params?: { type?: 'menu' | 'product' }): Promise<MenuCategory[]> {
    const response = await apiClient.get<ApiResponse<MenuCategory[]>>('/ProductCategory/GetProductCategories', {
      params,
    });
    return (response.data.data || []).map((c: any) => ({
      ...c,
      sortOrder: Number(c.sortOrder ?? c.sort_order ?? 0),
      isActive: c.isActive ?? c.is_active ?? true,
      imageUrl: c.imageUrl || c.image_url || null,
      type: c.type || 'menu',
    }));
  },

  async getById(id: string): Promise<MenuCategory> {
    const response = await apiClient.get<ApiResponse<MenuCategory>>(`/ProductCategory/GetProductCategoryById/${id}`);
    return response.data.data;
  },

  async create(data: CreateMenuCategoryInput): Promise<MenuCategory> {
    const payload = {
      ...data,
      sortOrder: data.sortOrder,
      sort_order: data.sortOrder,
      isActive: data.isActive,
      is_active: data.isActive,
      imageUrl: data.imageUrl,
      image_url: data.imageUrl,
    };
    const response = await apiClient.post<ApiResponse<MenuCategory>>('/ProductCategory/CreateProductCategory', payload);
    return response.data.data;
  },

  async update(id: string, data: UpdateMenuCategoryInput): Promise<MenuCategory> {
    const payload: any = { ...data };
    if (data.sortOrder !== undefined) {
      payload.sortOrder = data.sortOrder;
      payload.sort_order = data.sortOrder;
    }
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive;
      payload.is_active = data.isActive;
    }
    if (data.imageUrl !== undefined) {
      payload.imageUrl = data.imageUrl;
      payload.image_url = data.imageUrl;
    }
    const response = await apiClient.put<ApiResponse<MenuCategory>>(`/ProductCategory/UpdateProductCategory/${id}`, payload);
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

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  },

  async bulkCreate(items: CreateMenuCategoryInput[]): Promise<MenuCategory[]> {
    return Promise.all(items.map((item) => this.create(item)));
  },
};
