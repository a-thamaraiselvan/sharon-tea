import { contactRepository } from './repository.js';
import { ContactEnquiryRecord, PaginatedResult } from '../../types/index.js';
import { generateEnquiryId } from '../../utils/idGenerator.js';
import { AppError } from '../../middleware/errorHandler.js';

export class ContactService {
  async submitEnquiry(data: {
    name: string;
    email: string;
    phone?: string | null;
    message: string;
  }): Promise<ContactEnquiryRecord> {
    if (!data.name || !data.email || !data.message) {
      throw new AppError('Name, email, and message are required', 400);
    }

    const businessId = generateEnquiryId('CONTACT');
    return contactRepository.createEnquiry({
      ...data,
      business_id: businessId,
    });
  }

  async getAllEnquiries(options: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<ContactEnquiryRecord>> {
    return contactRepository.findAllEnquiries(options);
  }

  async getEnquiryById(id: string): Promise<ContactEnquiryRecord> {
    const enquiry = await contactRepository.findEnquiryById(id);
    if (!enquiry) {
      throw new AppError('Contact enquiry not found', 404);
    }
    return enquiry;
  }

  async updateEnquiry(id: string, status: string): Promise<ContactEnquiryRecord> {
    const existing = await contactRepository.findEnquiryById(id);
    if (!existing) {
      throw new AppError('Contact enquiry not found', 404);
    }

    const updated = await contactRepository.updateEnquiry(id, { status });
    if (!updated) {
      throw new AppError('Failed to update enquiry status', 500);
    }
    return updated;
  }

  async deleteEnquiry(id: string): Promise<void> {
    const existing = await contactRepository.findEnquiryById(id);
    if (!existing) {
      throw new AppError('Contact enquiry not found', 404);
    }

    const deleted = await contactRepository.deleteEnquiry(id);
    if (!deleted) {
      throw new AppError('Failed to delete contact enquiry', 500);
    }
  }
}

export const contactService = new ContactService();
