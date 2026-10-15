import { apiClient } from '../lib/apiClient';
import { ApiResponse } from '../types';

export interface UploadResult {
  url: string;
  key?: string;
  originalName?: string;
  size?: number;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post<ApiResponse<UploadResult>>(
      '/Upload/Image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Support both response.data.data.url or response.data.data directly
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data as unknown as UploadResult;
  },
};
