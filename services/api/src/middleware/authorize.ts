import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types/index.js';
import { AppError } from './errorHandler.js';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden. You do not have permission to access this resource.', 403)
      );
    }

    next();
  };
};
