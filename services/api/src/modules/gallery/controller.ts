import { Request, Response, NextFunction } from 'express';
import { galleryService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicGalleryImage = (img: any) => ({
  id: img.id,
  title: img.title,
  category: img.category,
  imageUrl: img.image_url || img.imageUrl || null,
  image_url: img.image_url || img.imageUrl || null,
  caption: img.caption || null,
  sortOrder: img.sort_order ?? img.sortOrder ?? 0,
  sort_order: img.sort_order ?? img.sortOrder ?? 0,
  isActive: img.is_active ?? img.isActive ?? true,
  is_active: img.is_active ?? img.isActive ?? true,
});

export class GalleryController {
  async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const images = await galleryService.getPublicImages(category);
      const sanitized = images.map(formatPublicGalleryImage);
      successResponse(res, sanitized, 'Gallery images retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const images = await galleryService.getAllImages(category);
      const sanitized = images.map(formatPublicGalleryImage);
      successResponse(res, sanitized, 'All gallery images retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await galleryService.createImage(req.body);
      successResponse(res, formatPublicGalleryImage(image), 'Gallery image added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await galleryService.updateImage(req.params.id as string, req.body);
      successResponse(res, formatPublicGalleryImage(image), 'Gallery image updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await galleryService.deleteImage(req.params.id as string);
      successResponse(res, null, 'Gallery image deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const galleryController = new GalleryController();
