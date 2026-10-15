import { whatsappOrderRepository, WhatsappAnalytics } from './repository.js';
import { WhatsappOrderClickRecord } from '../../types/index.js';
import { generateBusinessId } from '../../utils/idGenerator.js';
import { AppError } from '../../middleware/errorHandler.js';

export class WhatsappOrderService {
  async trackOrderClick(data: {
    product_id?: string | null;
    product_name: string;
    quantity?: number;
    customer_phone?: string | null;
  }): Promise<WhatsappOrderClickRecord> {
    if (!data.product_name) {
      throw new AppError('Product name is required for order tracking', 400);
    }

    const businessId = generateBusinessId('WA');
    return whatsappOrderRepository.logClick({
      business_id: businessId,
      product_id: data.product_id || null,
      product_name: data.product_name,
      quantity: data.quantity && data.quantity > 0 ? data.quantity : 1,
      customer_phone: data.customer_phone || null,
    });
  }

  async getAnalytics(): Promise<WhatsappAnalytics> {
    return whatsappOrderRepository.getAnalytics();
  }
}

export const whatsappOrderService = new WhatsappOrderService();
