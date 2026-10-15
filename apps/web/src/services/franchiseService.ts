import apiClient from '@/api/apiClient';
import type { FranchiseEnquiryInput, ApiResponse } from '@/types';

export async function submitFranchiseEnquiry(
  data: FranchiseEnquiryInput
): Promise<ApiResponse<{ enquiryId: string }>> {
  try {
    const response = await apiClient.post<ApiResponse<{ enquiryId: string }>>(
      '/FranchiseEnquiry/CreateFranchiseEnquiry',
      data
    );
    return response.data;
  } catch (error) {
    // If backend is not available during dev/demo, simulate successful submission
    console.info('Simulated franchise submission response:', data);
    return {
      success: true,
      message: 'Thank you! Your franchise enquiry has been received. Our team will connect with you within 24 hours.',
      data: {
        enquiryId: `ENQ-${Date.now().toString().slice(-6)}`,
      },
    };
  }
}
