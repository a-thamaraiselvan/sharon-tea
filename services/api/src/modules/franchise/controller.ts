import { Request, Response, NextFunction } from 'express';
import { franchiseService } from './service.js';
import { paginatedResponse, successResponse } from '../../utils/response.js';

export class FranchiseController {
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiry = await franchiseService.submitEnquiry(req.body);
      successResponse(res, enquiry, 'Franchise enquiry submitted successfully. Our team will contact you soon.', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search, page, limit } = req.query;
      const result = await franchiseService.getAllEnquiries({
        status: status as string | undefined,
        search: search as string | undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      paginatedResponse(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiry = await franchiseService.getEnquiryById(req.params.id as string);
      successResponse(res, enquiry, 'Franchise enquiry details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await franchiseService.updateEnquiry(req.params.id as string, req.body);
      successResponse(res, updated, 'Franchise enquiry updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await franchiseService.deleteEnquiry(req.params.id as string);
      successResponse(res, null, 'Franchise enquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const franchiseController = new FranchiseController();
