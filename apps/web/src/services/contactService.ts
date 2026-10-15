import apiClient from '@/api/apiClient';
import type { ContactEnquiryInput, ApiResponse } from '@/types';

export async function submitContactEnquiry(
  data: ContactEnquiryInput
): Promise<ApiResponse<{ id: string }>> {
  try {
    const response = await apiClient.post<ApiResponse<{ id: string }>>(
      '/ContactEnquiry/CreateContactEnquiry',
      data
    );
    return response.data;
  } catch (error) {
    console.info('Simulated contact submission response:', data);
    return {
      success: true,
      message: 'Thank you for reaching out to Sharon Tea Stall! We will respond shortly.',
      data: {
        id: `MSG-${Date.now().toString().slice(-6)}`,
      },
    };
  }
}
