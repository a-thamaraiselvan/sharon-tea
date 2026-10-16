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
    image_url?: string;
    imageUrl?: string;
    cta_text?: string | null;
    ctaText?: string | null;
    cta_link?: string | null;
    ctaLink?: string | null;
    secondary_cta_text?: string | null;
    secondaryCtaText?: string | null;
    secondary_cta_link?: string | null;
    secondaryCtaLink?: string | null;
    sort_order?: number;
    sortOrder?: number;
    is_active?: boolean;
    isActive?: boolean;
  }): Promise<HeroSlideRecord> {
    const imageUrl = data.image_url || data.imageUrl;
    if (!data.title || !imageUrl) {
      throw new AppError('Title and image URL are required for hero slide', 400);
    }
    return heroSlideRepository.createSlide({
      ...data,
      image_url: imageUrl,
      cta_text: data.cta_text ?? data.ctaText,
      cta_link: data.cta_link ?? data.ctaLink,
      secondary_cta_text: data.secondary_cta_text ?? data.secondaryCtaText,
      secondary_cta_link: data.secondary_cta_link ?? data.secondaryCtaLink,
      sort_order: data.sort_order ?? data.sortOrder,
      is_active: data.is_active ?? data.isActive,
    });
  }

  async updateSlide(
    id: string,
    data: {
      title?: string;
      subtitle?: string | null;
      image_url?: string;
      imageUrl?: string;
      cta_text?: string | null;
      ctaText?: string | null;
      cta_link?: string | null;
      ctaLink?: string | null;
      secondary_cta_text?: string | null;
      secondaryCtaText?: string | null;
      secondary_cta_link?: string | null;
      secondaryCtaLink?: string | null;
      sort_order?: number;
      sortOrder?: number;
      is_active?: boolean;
      isActive?: boolean;
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
