import { galleryRepository } from './repository.js';
import { GalleryImageRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class GalleryService {
  async getPublicImages(category?: string): Promise<GalleryImageRecord[]> {
    return galleryRepository.findPublicImages(category);
  }

  async getAllImages(category?: string): Promise<GalleryImageRecord[]> {
    return galleryRepository.findAllImages(category);
  }

  async createImage(data: {
    image_url: string;
    caption?: string | null;
    category?: string | null;
    sort_order?: number;
  }): Promise<GalleryImageRecord> {
    if (!data.image_url) {
      throw new AppError('Image URL is required', 400);
    }
    return galleryRepository.createImage(data);
  }

  async updateImage(
    id: string,
    data: {
      image_url?: string;
      caption?: string | null;
      category?: string | null;
      sort_order?: number;
    }
  ): Promise<GalleryImageRecord> {
    const existing = await galleryRepository.findImageById(id);
    if (!existing) {
      throw new AppError('Gallery image not found', 404);
    }

    const updated = await galleryRepository.updateImage(id, data);
    if (!updated) {
      throw new AppError('Failed to update gallery image', 500);
    }
    return updated;
  }

  async deleteImage(id: string): Promise<void> {
    const existing = await galleryRepository.findImageById(id);
    if (!existing) {
      throw new AppError('Gallery image not found', 404);
    }

    const deleted = await galleryRepository.deleteImage(id);
    if (!deleted) {
      throw new AppError('Failed to delete gallery image', 500);
    }
  }
}

export const galleryService = new GalleryService();
