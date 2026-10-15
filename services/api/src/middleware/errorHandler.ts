import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any;

  constructor(message: string, statusCode: number = 400, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `File is too large. Maximum size is ${Math.round(env.MAX_FILE_SIZE / (1024 * 1024))}MB`;
    } else {
      message = err.message;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please authenticate again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in or refresh your session.';
  }

  // Handle PostgreSQL specific errors
  if (err.code === '23505') {
    // Unique violation
    statusCode = 409;
    message = err.detail || 'A record with this information already exists.';
  } else if (err.code === '23503') {
    // Foreign key violation
    statusCode = 400;
    message = 'Referenced resource does not exist or cannot be deleted due to dependencies.';
  } else if (err.code === '22P02') {
    // Invalid text representation (e.g., bad UUID)
    statusCode = 400;
    message = 'Invalid ID or parameter format.';
  }

  const response: Record<string, any> = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    response.stack = err.stack;
    console.error('SERVER ERROR 500:', err);
  }

  res.status(statusCode).json(response);
};
