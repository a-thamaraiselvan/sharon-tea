import { Request, Response, NextFunction } from 'express';
import { contactService } from './service.js';
import { paginatedResponse, successResponse } from '../../utils/response.js';

export class ContactController {
  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const enquiry = await contactService.submitEnquiry(req.body);
      successResponse(res, enquiry, 'Thank you! Your message has been received.', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search, page, limit } = req.query;
      const result = await contactService.getAllEnquiries({
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
      const enquiry = await contactService.getEnquiryById(req.params.id as string);
      successResponse(res, enquiry, 'Contact enquiry retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await contactService.updateEnquiry(req.params.id as string, status);
      successResponse(res, updated, 'Contact enquiry status updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await contactService.deleteEnquiry(req.params.id as string);
      successResponse(res, null, 'Contact enquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
