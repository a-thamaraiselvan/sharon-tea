import { Request, Response, NextFunction } from 'express';
import { heroSlideService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicHeroSlide = (s: any) => ({
  id: s.id,
  title: s.title,
  subtitle: s.subtitle || '',
  imageUrl: s.image_url || s.imageUrl || null,
  image_url: s.image_url || s.imageUrl || null,
  ctaText: s.cta_text || s.ctaText || null,
  cta_text: s.cta_text || s.ctaText || null,
  ctaLink: s.cta_link || s.ctaLink || null,
  cta_link: s.cta_link || s.ctaLink || null,
  secondaryCtaText: s.secondary_cta_text || s.secondaryCtaText || null,
  secondary_cta_text: s.secondary_cta_text || s.secondaryCtaText || null,
  secondaryCtaLink: s.secondary_cta_link || s.secondaryCtaLink || null,
  secondary_cta_link: s.secondary_cta_link || s.secondaryCtaLink || null,
  sortOrder: s.sort_order ?? s.sortOrder ?? 0,
  sort_order: s.sort_order ?? s.sortOrder ?? 0,
  displayOrder: s.sort_order ?? s.sortOrder ?? 0,
  display_order: s.sort_order ?? s.sortOrder ?? 0,
  isActive: s.is_active ?? s.isActive ?? true,
  is_active: s.is_active ?? s.isActive ?? true,
});

export class HeroSlideController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slides = await heroSlideService.getPublicSlides();
      const sanitized = slides.map(formatPublicHeroSlide);
      successResponse(res, sanitized, 'Active hero slides retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slides = await heroSlideService.getAllSlides();
      successResponse(res, slides, 'All hero slides retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slide = await heroSlideService.getSlideById(req.params.id as string);
      successResponse(res, slide, 'Hero slide details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slide = await heroSlideService.createSlide(req.body);
      successResponse(res, slide, 'Hero slide created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slide = await heroSlideService.updateSlide(req.params.id as string, req.body);
      successResponse(res, slide, 'Hero slide updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await heroSlideService.deleteSlide(req.params.id as string);
      successResponse(res, null, 'Hero slide deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const heroSlideController = new HeroSlideController();
