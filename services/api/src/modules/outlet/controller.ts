import { Request, Response, NextFunction } from 'express';
import { outletService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicOutlet = (o: any) => ({
  id: o.id,
  name: o.name,
  address: o.address,
  city: o.city || 'Bangalore',
  state: o.state || 'Karnataka',
  pincode: o.pincode || null,
  phone: o.phone,
  hours: o.hours || o.operating_hours || '6:00 AM - 11:00 PM',
  operating_hours: o.hours || o.operating_hours || '6:00 AM - 11:00 PM',
  googleMapsUrl: o.maps_url || o.google_maps_url || o.googleMapsUrl || '',
  google_maps_url: o.maps_url || o.google_maps_url || o.googleMapsUrl || '',
  embedUrl: o.embed_url || o.embedUrl || (o.address ? `https://maps.google.com/maps?q=${encodeURIComponent(o.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null),
  embed_url: o.embed_url || o.embedUrl || (o.address ? `https://maps.google.com/maps?q=${encodeURIComponent(o.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null),
  imageUrl: o.image_url || o.imageUrl || null,
  image_url: o.image_url || o.imageUrl || null,
  isMainBranch: Boolean(o.is_main_branch || o.isMainBranch || o.name?.includes('Head Branch')),
  is_main_branch: Boolean(o.is_main_branch || o.isMainBranch || o.name?.includes('Head Branch')),
  isActive: o.is_active ?? o.isActive ?? true,
  is_active: o.is_active ?? o.isActive ?? true,
});

export class OutletController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlets = await outletService.getPublicOutlets();
      const sanitized = outlets.map(formatPublicOutlet);
      successResponse(res, sanitized, 'Active outlets retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlets = await outletService.getAllOutlets();
      successResponse(res, outlets, 'All outlets retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlet = await outletService.getOutletById(req.params.id as string);
      successResponse(res, outlet, 'Outlet details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlet = await outletService.createOutlet(req.body);
      successResponse(res, outlet, 'Outlet created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlet = await outletService.updateOutlet(req.params.id as string, req.body);
      successResponse(res, outlet, 'Outlet updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await outletService.deleteOutlet(req.params.id as string);
      successResponse(res, null, 'Outlet deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const outletController = new OutletController();
