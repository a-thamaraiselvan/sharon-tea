import { apiClient } from '../lib/apiClient';
import {
  GalleryItem,
  CreateGalleryItemInput,
  UpdateGalleryItemInput,
  GalleryCategory,
  ApiResponse,
} from '../types';

export const galleryService = {
  async getAll(category?: GalleryCategory): Promise<GalleryItem[]> {
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>('/Gallery/GetGallery', {
      params: category ? { category } : undefined,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<GalleryItem> {
    const response = await apiClient.get<ApiResponse<GalleryItem>>(`/Gallery/GetGalleryById/${id}`);
    return response.data.data;
  },

  async create(data: CreateGalleryItemInput): Promise<GalleryItem> {
    const response = await apiClient.post<ApiResponse<GalleryItem>>('/Gallery/CreateGallery', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateGalleryItemInput): Promise<GalleryItem> {
    const response = await apiClient.put<ApiResponse<GalleryItem>>(`/Gallery/UpdateGallery/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Gallery/DeleteGallery/${id}`);
  },

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await apiClient.patch('/Gallery/UpdateGallerySortOrder', { items });
  },
};
