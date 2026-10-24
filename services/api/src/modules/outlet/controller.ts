import { Request, Response, NextFunction } from 'express';
import { outletService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicOutlet = (o: any) => ({
  id: o.id,
  name: o.name,
  slug: o.slug || o.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  address: o.address,
  city: o.city || 'Bangalore',
  state: o.state || 'Karnataka',
  pincode: o.pincode || null,
  phone: o.phone,
  hours: o.hours || o.operating_hours || o.operatingHours || '6:00 AM - 11:00 PM',
  googleMapsUrl: o.maps_url || o.google_maps_url || o.googleMapsUrl || '',
  embedUrl: o.embed_url || o.embedUrl || (o.address ? `https://maps.google.com/maps?q=${encodeURIComponent(o.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null),
  imageUrl: o.image_url || o.imageUrl || null,
  isMainBranch: Boolean(o.is_main_branch || o.isMainBranch || o.name?.includes('Head Branch')),
  latitude: o.latitude ? Number(o.latitude) : null,
  longitude: o.longitude ? Number(o.longitude) : null,
});

export const formatAdminOutlet = (o: any) => ({
  ...formatPublicOutlet(o),
  operatingHours: o.hours || o.operating_hours || o.operatingHours || '6:00 AM - 11:00 PM',
  operating_hours: o.hours || o.operating_hours || o.operatingHours || '6:00 AM - 11:00 PM',
  mapsUrl: o.maps_url || o.google_maps_url || o.googleMapsUrl || '',
  maps_url: o.maps_url || o.google_maps_url || o.googleMapsUrl || '',
  image_url: o.image_url || o.imageUrl || null,
  is_main_branch: Boolean(o.is_main_branch || o.isMainBranch || o.name?.includes('Head Branch')),
  isActive: o.is_active ?? o.isActive ?? true,
  is_active: o.is_active ?? o.isActive ?? true,
  sortOrder: Number(o.sort_order ?? o.sortOrder ?? 0),
  sort_order: Number(o.sort_order ?? o.sortOrder ?? 0),
  createdAt: o.created_at || o.createdAt,
  updatedAt: o.updated_at || o.updatedAt,
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
      const sanitized = outlets.map(formatAdminOutlet);
      successResponse(res, sanitized, 'All outlets retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = Boolean((req as any).user && ['ADMIN', 'STAFF'].includes((req as any).user.role));
      const outlet = await outletService.getOutletById(req.params.id as string);
      successResponse(res, isAdmin ? formatAdminOutlet(outlet) : formatPublicOutlet(outlet), 'Outlet details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlet = await outletService.createOutlet(req.body);
      successResponse(res, formatAdminOutlet(outlet), 'Outlet created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const outlet = await outletService.updateOutlet(req.params.id as string, req.body);
      successResponse(res, formatAdminOutlet(outlet), 'Outlet updated successfully');
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
