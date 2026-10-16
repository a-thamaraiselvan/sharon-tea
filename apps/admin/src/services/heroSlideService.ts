import { apiClient } from '../lib/apiClient';
import {
  HeroSlide,
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
  ApiResponse,
} from '../types';

const normalizeSlide = (s: any): HeroSlide => ({
  id: s.id,
  title: s.title,
  subtitle: s.subtitle ?? '',
  imageUrl: s.imageUrl || s.image_url || '',
  image_url: s.imageUrl || s.image_url || '',
  ctaText: s.ctaText || s.cta_text || '',
  cta_text: s.ctaText || s.cta_text || '',
  ctaLink: s.ctaLink || s.cta_link || '',
  cta_link: s.ctaLink || s.cta_link || '',
  sortOrder: Number(s.sortOrder ?? s.sort_order ?? 0),
  sort_order: Number(s.sortOrder ?? s.sort_order ?? 0),
  isActive: Boolean(s.isActive ?? s.is_active ?? true),
  is_active: Boolean(s.isActive ?? s.is_active ?? true),
  createdAt: s.createdAt || s.created_at || '',
  updatedAt: s.updatedAt || s.updated_at || '',
});

export const heroSlideService = {
  async getAll(): Promise<HeroSlide[]> {
    const response = await apiClient.get<ApiResponse<HeroSlide[]>>('/HeroSlide/GetHeroSlides');
    const items = response.data.data || [];
    return items.map(normalizeSlide);
  },

  async getById(id: string): Promise<HeroSlide> {
    const response = await apiClient.get<ApiResponse<HeroSlide>>(`/HeroSlide/GetHeroSlideById/${id}`);
    return normalizeSlide(response.data.data);
  },

  async create(data: CreateHeroSlideInput): Promise<HeroSlide> {
    const payload = {
      ...data,
      imageUrl: data.imageUrl,
      image_url: data.imageUrl,
      ctaText: data.ctaText,
      cta_text: data.ctaText,
      ctaLink: data.ctaLink,
      cta_link: data.ctaLink,
      sortOrder: data.sortOrder,
      sort_order: data.sortOrder,
      isActive: data.isActive,
      is_active: data.isActive,
    };
    const response = await apiClient.post<ApiResponse<HeroSlide>>('/HeroSlide/CreateHeroSlide', payload);
    return normalizeSlide(response.data.data);
  },

  async update(id: string, data: UpdateHeroSlideInput): Promise<HeroSlide> {
    const payload: any = { ...data };
    if (data.imageUrl !== undefined) {
      payload.imageUrl = data.imageUrl;
      payload.image_url = data.imageUrl;
    }
    if (data.ctaText !== undefined) {
      payload.ctaText = data.ctaText;
      payload.cta_text = data.ctaText;
    }
    if (data.ctaLink !== undefined) {
      payload.ctaLink = data.ctaLink;
      payload.cta_link = data.ctaLink;
    }
    if (data.sortOrder !== undefined) {
      payload.sortOrder = data.sortOrder;
      payload.sort_order = data.sortOrder;
    }
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive;
      payload.is_active = data.isActive;
    }
    const response = await apiClient.put<ApiResponse<HeroSlide>>(`/HeroSlide/UpdateHeroSlide/${id}`, payload);
    return normalizeSlide(response.data.data);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/HeroSlide/DeleteHeroSlide/${id}`);
  },

  async toggleActive(id: string, isActive: boolean): Promise<HeroSlide> {
    const response = await apiClient.put<ApiResponse<HeroSlide>>(`/HeroSlide/UpdateHeroSlide/${id}`, {
      isActive,
    });
    return response.data.data;
  },

  async updateSortOrder(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    await apiClient.patch('/HeroSlide/UpdateHeroSlideSortOrder', { items });
  },
};
