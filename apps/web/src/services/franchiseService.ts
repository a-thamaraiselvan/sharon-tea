import apiClient from '@/api/apiClient';
import type { FranchiseEnquiryInput, ApiResponse } from '@/types';

export async function submitFranchiseEnquiry(
  data: FranchiseEnquiryInput
): Promise<ApiResponse<{ enquiryId: string }>> {
  const payload = {
    full_name: data.fullName,
    fullName: data.fullName,
    phone: data.phone,
    email: data.email,
    city: data.city,
    investment_budget: data.investmentBudget,
    investmentBudget: data.investmentBudget,
    message: data.message || '',
  };

  const response = await apiClient.post<ApiResponse<{ enquiryId: string }>>(
    '/FranchiseEnquiry/CreateFranchiseEnquiry',
    payload
  );
  return response.data;
}
