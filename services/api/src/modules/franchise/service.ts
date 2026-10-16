import { franchiseRepository } from './repository.js';
import { FranchiseEnquiryRecord, PaginatedResult } from '../../types/index.js';
import { generateEnquiryId } from '../../utils/idGenerator.js';
import { AppError } from '../../middleware/errorHandler.js';

export class FranchiseService {
  async submitEnquiry(data: {
    full_name?: string;
    fullName?: string;
    phone: string;
    email: string;
    city: string;
    investment_budget?: string;
    investmentBudget?: string;
    message?: string | null;
  }): Promise<FranchiseEnquiryRecord> {
    const full_name = (data.full_name || data.fullName || '').trim();
    const phone = (data.phone || '').trim();
    const email = (data.email || '').trim();
    const city = (data.city || '').trim();
    const investment_budget = (data.investment_budget || data.investmentBudget || '').trim();
    const message = data.message ? String(data.message).trim() : null;

    if (!full_name || !phone || !email || !city || !investment_budget) {
      throw new AppError('All required fields (name, phone, email, city, budget) must be filled', 400);
    }

    const businessId = generateEnquiryId('FRANCHISE');
    return franchiseRepository.createEnquiry({
      full_name,
      phone,
      email,
      city,
      investment_budget,
      message,
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
