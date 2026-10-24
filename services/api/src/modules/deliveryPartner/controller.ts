import { Request, Response, NextFunction } from 'express';
import { deliveryPartnerService } from './service.js';
import { successResponse } from '../../utils/response.js';

export class DeliveryPartnerController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partners = await deliveryPartnerService.getPublicPartners();
      successResponse(res, partners, 'Active delivery partners retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partners = await deliveryPartnerService.getAllPartners();
      successResponse(res, partners, 'All delivery partners retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = Boolean((req as any).user && ['ADMIN', 'STAFF'].includes((req as any).user.role));
      const partner = await deliveryPartnerService.getPartnerById(req.params.id as string, isAdmin);
      successResponse(res, partner, 'Delivery partner retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partner = await deliveryPartnerService.createPartner(req.body);
      successResponse(res, partner, 'Delivery partner created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const partner = await deliveryPartnerService.updatePartner(req.params.id as string, req.body);
      successResponse(res, partner, 'Delivery partner updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await deliveryPartnerService.deletePartner(req.params.id as string);
      successResponse(res, null, 'Delivery partner deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body;
      const count = await deliveryPartnerService.bulkDeletePartners(ids);
      successResponse(res, { count }, `${count} delivery partners deleted successfully`);
    } catch (error) {
      next(error);
    }
  }

  async toggleActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : Boolean(req.body.is_active);
      const partner = await deliveryPartnerService.toggleActive(req.params.id as string, isActive);
      successResponse(res, partner, 'Delivery partner status updated');
    } catch (error) {
      next(error);
    }
  }
}

export const deliveryPartnerController = new DeliveryPartnerController();
