import { apiClient } from '../lib/apiClient';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ApiResponse,
} from '../types';

export const productService = {
  async getAll(params?: { search?: string; categoryId?: string }): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/Product/GetProducts', {
      params: { ...params, type: 'retail' },
    });
    return (response.data.data || []).map((p: any) => ({
      ...p,
      price: Number(p.price ?? 0),
      originalPrice: p.originalPrice != null ? Number(p.originalPrice) : (p.original_price != null ? Number(p.original_price) : null),
      sortOrder: Number(p.sortOrder ?? p.sort_order ?? 0),
      packSize: p.packSize || p.pack_size || '250g Pouch',
      isAvailable: p.isAvailable ?? p.is_available ?? true,
      categoryId: p.categoryId || p.category_id || null,
      category: p.category || p.categoryName || p.category_name || null,
      imageUrl: p.imageUrl || p.image_url || null,
      shortDescription: p.shortDescription || p.short_description || null,
      preparationInstructions: p.preparationInstructions || p.preparation_instructions || null,
    }));
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/Product/GetProductById/${id}`);
    return response.data.data;
  },

  async create(data: CreateProductInput): Promise<Product> {
    const payload = {
      ...data,
      type: 'retail',
      short_description: data.shortDescription,
      original_price: data.originalPrice,
      pack_size: data.packSize,
      image_url: data.imageUrl,
      sort_order: data.sortOrder,
      is_available: data.isAvailable,
      category_id: data.categoryId,
      preparation_instructions: data.preparationInstructions,
    };
    const response = await apiClient.post<ApiResponse<Product>>('/Product/CreateProduct', payload);
    return response.data.data;
  },

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const payload = {
      ...data,
      type: 'retail',
      short_description: data.shortDescription,
      original_price: data.originalPrice,
      pack_size: data.packSize,
      image_url: data.imageUrl,
      sort_order: data.sortOrder,
      is_available: data.isAvailable,
      category_id: data.categoryId,
      preparation_instructions: data.preparationInstructions,
    };
    const response = await apiClient.put<ApiResponse<Product>>(`/Product/UpdateProduct/${id}`, payload);
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

  async bulkDelete(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  },

  async bulkCreate(items: CreateProductInput[]): Promise<Product[]> {
    return Promise.all(items.map((item) => this.create(item)));
  },
};
