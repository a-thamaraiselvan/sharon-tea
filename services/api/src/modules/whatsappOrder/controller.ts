import { Request, Response, NextFunction } from 'express';
import { whatsappOrderService } from './service.js';
import { successResponse } from '../../utils/response.js';

export class WhatsappOrderController {
  async track(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productName, product_name, productId, product_id, quantity, customerPhone, customer_phone } = req.body;
      const record = await whatsappOrderService.trackOrderClick({
        product_name: product_name || productName,
        product_id: product_id || productId,
        quantity: quantity,
        customer_phone: customer_phone || customerPhone,
      });
      successResponse(res, record, 'WhatsApp click tracked successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await whatsappOrderService.getAnalytics();
      successResponse(res, analytics, 'WhatsApp analytics retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const whatsappOrderController = new WhatsappOrderController();
