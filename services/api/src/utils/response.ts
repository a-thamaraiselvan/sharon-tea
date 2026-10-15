import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
): Response => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(responseBody);
};

export const errorResponse = (
  res: Response,
  message: string = 'Operation failed',
  statusCode: number = 400,
  errors: any = null
): Response => {
  const responseBody: ApiResponse = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

export const paginatedResponse = <T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Data retrieved successfully'
): Response => {
  const totalPages = Math.ceil(total / limit) || 1;
  const responseBody: ApiResponse<T[]> = {
    success: true,
    message,
    data: items,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages,
    },
  };
  return res.status(200).json(responseBody);
};
