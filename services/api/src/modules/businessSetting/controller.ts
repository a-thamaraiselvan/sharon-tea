import { Request, Response, NextFunction } from 'express';
import { businessSettingService } from './service.js';
import { successResponse } from '../../utils/response.js';

export class BusinessSettingController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await businessSettingService.getPublicSettings();
      successResponse(res, settings, 'Business settings retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await businessSettingService.getAllSettings();
      successResponse(res, settings, 'All business settings retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await businessSettingService.updateSettings(req.body);
      successResponse(res, settings, 'Business settings updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const businessSettingController = new BusinessSettingController();
