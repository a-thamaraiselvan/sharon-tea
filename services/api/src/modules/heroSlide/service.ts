import { heroSlideRepository } from './repository.js';
import { HeroSlideRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class HeroSlideService {
  async getPublicSlides(): Promise<HeroSlideRecord[]> {
    return heroSlideRepository.findPublicSlides();
  }

  async getAllSlides(): Promise<HeroSlideRecord[]> {
    return heroSlideRepository.findAllSlides();
  }

  async getSlideById(id: string): Promise<HeroSlideRecord> {
    const slide = await heroSlideRepository.findSlideById(id);
    if (!slide) {
      throw new AppError('Hero slide not found', 404);
    }
    return slide;
  }

  async createSlide(data: {
    title: string;
    subtitle?: string | null;
    image_url: string;
    cta_text?: string | null;
    cta_link?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<HeroSlideRecord> {
    if (!data.title || !data.image_url) {
      throw new AppError('Title and image URL are required for hero slide', 400);
    }
    return heroSlideRepository.createSlide(data);
  }

  async updateSlide(
    id: string,
    data: {
      title?: string;
      subtitle?: string | null;
      image_url?: string;
      cta_text?: string | null;
      cta_link?: string | null;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<HeroSlideRecord> {
    const existing = await heroSlideRepository.findSlideById(id);
    if (!existing) {
      throw new AppError('Hero slide not found', 404);
    }

    const updated = await heroSlideRepository.updateSlide(id, data);
    if (!updated) {
      throw new AppError('Failed to update hero slide', 500);
    }
    return updated;
  }

  async deleteSlide(id: string): Promise<void> {
    const existing = await heroSlideRepository.findSlideById(id);
    if (!existing) {
      throw new AppError('Hero slide not found', 404);
    }

    const deleted = await heroSlideRepository.deleteSlide(id);
    if (!deleted) {
      throw new AppError('Failed to delete hero slide', 500);
    }
  }
}

export const heroSlideService = new HeroSlideService();
