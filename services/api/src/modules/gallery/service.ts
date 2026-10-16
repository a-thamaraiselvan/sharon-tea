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

  async createImage(data: any): Promise<GalleryImageRecord> {
    const imageUrl = data.image_url || data.imageUrl;
    if (!imageUrl) {
      throw new AppError('Image URL is required', 400);
    }
    return galleryRepository.createImage({
      ...data,
      image_url: imageUrl,
      sort_order: data.sort_order ?? data.sortOrder,
      is_active: data.is_active ?? data.isActive,
    });
  }

  async updateImage(id: string, data: any): Promise<GalleryImageRecord> {
    const existing = await galleryRepository.findImageById(id);
    if (!existing) {
      throw new AppError('Gallery image not found', 404);
    }

    const updated = await galleryRepository.updateImage(id, {
      ...data,
      image_url: data.image_url !== undefined ? data.image_url : data.imageUrl,
      sort_order: data.sort_order !== undefined ? data.sort_order : data.sortOrder,
      is_active: data.is_active !== undefined ? data.is_active : data.isActive,
    });
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
