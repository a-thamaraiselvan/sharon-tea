import apiClient from '@/api/apiClient';
import type { ContactEnquiryInput, ApiResponse } from '@/types';

export async function submitContactEnquiry(
  data: ContactEnquiryInput
): Promise<ApiResponse<{ id: string }>> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    '/ContactEnquiry/CreateContactEnquiry',
    data
  );
  return response.data;
}
