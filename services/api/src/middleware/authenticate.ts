import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { AppError } from './errorHandler.js';

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Missing Bearer token.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please refresh your token.', 401));
    }
    return next(new AppError('Invalid or expired authentication token.', 401));
  }
};

export const optionalAuthenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
};
