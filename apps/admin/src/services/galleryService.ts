import { apiClient } from '../lib/apiClient';
import {
  GalleryItem,
  CreateGalleryItemInput,
  UpdateGalleryItemInput,
  GalleryCategory,
  ApiResponse,
} from '../types';

const normalizeGalleryItem = (g: any): GalleryItem => ({
  id: g.id,
  caption: g.caption || '',
  category: g.category || 'tea-preparation',
  imageUrl: g.imageUrl || g.image_url || '',
  image_url: g.imageUrl || g.image_url || '',
  sortOrder: Number(g.sortOrder ?? g.sort_order ?? 0),
  sort_order: Number(g.sortOrder ?? g.sort_order ?? 0),
  isActive: Boolean(g.isActive ?? g.is_active ?? true),
  is_active: Boolean(g.isActive ?? g.is_active ?? true),
  createdAt: g.createdAt || g.created_at || '',
  updatedAt: g.updatedAt || g.updated_at || g.createdAt || g.created_at || '',
});

export const galleryService = {
  async getAll(category?: GalleryCategory): Promise<GalleryItem[]> {
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>('/Gallery/GetGallery', {
      params: category ? { category } : undefined,
    });
    const items = response.data.data || [];
    return items.map(normalizeGalleryItem);
  },

  async getById(id: string): Promise<GalleryItem> {
    const response = await apiClient.get<ApiResponse<GalleryItem>>(`/Gallery/GetGalleryById/${id}`);
    return normalizeGalleryItem(response.data.data);
  },

  async create(data: CreateGalleryItemInput): Promise<GalleryItem> {
    const payload = {
      ...data,
      imageUrl: data.imageUrl,
      image_url: data.imageUrl,
      sortOrder: data.sortOrder,
      sort_order: data.sortOrder,
    };
    const response = await apiClient.post<ApiResponse<GalleryItem>>('/Gallery/CreateGallery', payload);
    return normalizeGalleryItem(response.data.data);
  },

  async update(id: string, data: UpdateGalleryItemInput): Promise<GalleryItem> {
    const payload: any = { ...data };
    if (data.imageUrl !== undefined) {
      payload.imageUrl = data.imageUrl;
      payload.image_url = data.imageUrl;
    }
    if (data.sortOrder !== undefined) {
      payload.sortOrder = data.sortOrder;
      payload.sort_order = data.sortOrder;
    }
    const response = await apiClient.put<ApiResponse<GalleryItem>>(`/Gallery/UpdateGallery/${id}`, payload);
    return normalizeGalleryItem(response.data.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/Gallery/DeleteGallery/${id}`);
  },

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await apiClient.patch('/Gallery/UpdateGallerySortOrder', { items });
  },
};
