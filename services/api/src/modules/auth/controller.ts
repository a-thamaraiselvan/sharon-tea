import { Response, NextFunction } from 'express';
import { authService } from './service.js';
import { AuthRequest } from '../../types/index.js';
import { successResponse } from '../../utils/response.js';
import { AppError } from '../../middleware/errorHandler.js';

export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      const result = await authService.login(email, password);
      successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
      }

      const tokens = await authService.refreshTokens(refreshToken);
      successResponse(res, tokens, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?.userId;
      await authService.logout(refreshToken, userId);
      successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await authService.getCurrentUser(req.user.userId);
      successResponse(res, user, 'User details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
      }

      await authService.changePassword(req.user.userId, currentPassword, newPassword);
      successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
