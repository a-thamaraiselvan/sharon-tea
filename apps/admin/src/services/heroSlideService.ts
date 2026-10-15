import { apiClient } from '../lib/apiClient';
import {
  HeroSlide,
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
  ApiResponse,
} from '../types';

export const heroSlideService = {
  async getAll(): Promise<HeroSlide[]> {
    const response = await apiClient.get<ApiResponse<HeroSlide[]>>('/HeroSlide/GetHeroSlides');
    return response.data.data;
  },

  async getById(id: string): Promise<HeroSlide> {
    const response = await apiClient.get<ApiResponse<HeroSlide>>(`/HeroSlide/GetHeroSlideById/${id}`);
    return response.data.data;
  },

  async create(data: CreateHeroSlideInput): Promise<HeroSlide> {
    const response = await apiClient.post<ApiResponse<HeroSlide>>('/HeroSlide/CreateHeroSlide', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateHeroSlideInput): Promise<HeroSlide> {
    const response = await apiClient.put<ApiResponse<HeroSlide>>(`/HeroSlide/UpdateHeroSlide/${id}`, data);
    return response.data.data;
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
