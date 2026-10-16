import { outletRepository } from './repository.js';
import { OutletRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class OutletService {
  async getPublicOutlets(): Promise<OutletRecord[]> {
    return outletRepository.findPublicOutlets();
  }

  async getAllOutlets(): Promise<OutletRecord[]> {
    return outletRepository.findAllOutlets();
  }

  async getOutletById(id: string): Promise<OutletRecord> {
    const outlet = await outletRepository.findOutletById(id);
    if (!outlet) {
      throw new AppError('Outlet not found', 404);
    }
    return outlet;
  }

  async createOutlet(data: any): Promise<OutletRecord> {
    if (!data.name || !data.address) {
      throw new AppError('Outlet name and address are required', 400);
    }
    return outletRepository.createOutlet({
      ...data,
      operating_hours: data.operating_hours ?? data.operatingHours,
      image_url: data.image_url ?? data.imageUrl,
      maps_url: data.maps_url ?? data.mapsUrl ?? data.googleMapsUrl ?? data.google_maps_url,
      is_active: data.is_active ?? data.isActive,
      sort_order: data.sort_order ?? data.sortOrder,
    });
  }

  async updateOutlet(id: string, data: any): Promise<OutletRecord> {
    const existing = await outletRepository.findOutletById(id);
    if (!existing) {
      throw new AppError('Outlet not found', 404);
    }

    const updated = await outletRepository.updateOutlet(id, {
      ...data,
      operating_hours: data.operating_hours !== undefined ? data.operating_hours : data.operatingHours,
      image_url: data.image_url !== undefined ? data.image_url : data.imageUrl,
      maps_url: data.maps_url !== undefined ? data.maps_url : (data.mapsUrl ?? data.googleMapsUrl ?? data.google_maps_url),
      is_active: data.is_active !== undefined ? data.is_active : data.isActive,
      sort_order: data.sort_order !== undefined ? data.sort_order : data.sortOrder,
    });
    if (!updated) {
      throw new AppError('Failed to update outlet', 500);
    }
    return updated;
  }

  async deleteOutlet(id: string): Promise<void> {
    const existing = await outletRepository.findOutletById(id);
    if (!existing) {
      throw new AppError('Outlet not found', 404);
    }

    const deleted = await outletRepository.deleteOutlet(id);
    if (!deleted) {
      throw new AppError('Failed to delete outlet', 500);
    }
  }
}

export const outletService = new OutletService();
