import { franchiseRepository } from './repository.js';
import { FranchiseEnquiryRecord, PaginatedResult } from '../../types/index.js';
import { generateEnquiryId } from '../../utils/idGenerator.js';
import { AppError } from '../../middleware/errorHandler.js';

export class FranchiseService {
  async submitEnquiry(data: {
    full_name: string;
    phone: string;
    email: string;
    city: string;
    investment_budget: string;
    message?: string | null;
  }): Promise<FranchiseEnquiryRecord> {
    if (!data.full_name || !data.phone || !data.email || !data.city || !data.investment_budget) {
      throw new AppError('All required fields (name, phone, email, city, budget) must be filled', 400);
    }

    const businessId = generateEnquiryId('FRANCHISE');
    return franchiseRepository.createEnquiry({
      ...data,
      business_id: businessId,
    });
  }

  async getAllEnquiries(options: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<FranchiseEnquiryRecord>> {
    return franchiseRepository.findAllEnquiries(options);
  }

  async getEnquiryById(id: string): Promise<FranchiseEnquiryRecord> {
    const enquiry = await franchiseRepository.findEnquiryById(id);
    if (!enquiry) {
      throw new AppError('Franchise enquiry not found', 404);
    }
    return enquiry;
  }

  async updateEnquiry(
    id: string,
    data: {
      status?: string;
      admin_notes?: string;
    }
  ): Promise<FranchiseEnquiryRecord> {
    const existing = await franchiseRepository.findEnquiryById(id);
    if (!existing) {
      throw new AppError('Franchise enquiry not found', 404);
    }

    const updated = await franchiseRepository.updateEnquiry(id, data);
    if (!updated) {
      throw new AppError('Failed to update franchise enquiry', 500);
    }
    return updated;
  }

  async deleteEnquiry(id: string): Promise<void> {
    const existing = await franchiseRepository.findEnquiryById(id);
    if (!existing) {
      throw new AppError('Franchise enquiry not found', 404);
    }

    const deleted = await franchiseRepository.deleteEnquiry(id);
    if (!deleted) {
      throw new AppError('Failed to delete franchise enquiry', 500);
    }
  }
}

export const franchiseService = new FranchiseService();
