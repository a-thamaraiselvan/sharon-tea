import argon2 from 'argon2';
import { authRepository } from './repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/tokens.js';
import { AppError } from '../../middleware/errorHandler.js';
import { SafeUser, TokenPayload } from '../../types/index.js';

export class AuthService {
  async login(email: string, password: string): Promise<{
    user: SafeUser;
    accessToken: string;
    refreshToken: string;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await argon2.verify(user.password_hash, password);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      businessId: user.business_id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token in database (7 days expiry)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    const { password_hash, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshTokens(refreshTokenStr: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (!refreshTokenStr) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify token signature
    let decoded: TokenPayload;
    try {
      decoded = verifyRefreshToken(refreshTokenStr);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Check database for token existence
    const storedToken = await authRepository.findRefreshToken(refreshTokenStr);
    if (!storedToken) {
      throw new AppError('Refresh token has been revoked or does not exist', 401);
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      await authRepository.deleteRefreshToken(refreshTokenStr);
      throw new AppError('Refresh token has expired', 401);
    }

    // Check user active
    const user = await authRepository.findUserById(decoded.userId);
    if (!user || !user.is_active) {
      throw new AppError('User account not found or disabled', 401);
    }

    // Delete old refresh token (token rotation)
    await authRepository.deleteRefreshToken(refreshTokenStr);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      businessId: user.business_id,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshTokenStr?: string, userId?: string): Promise<void> {
    if (refreshTokenStr) {
      await authRepository.deleteRefreshToken(refreshTokenStr);
    } else if (userId) {
      await authRepository.deleteAllUserRefreshTokens(userId);
    }
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await argon2.verify(user.password_hash, currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters long', 400);
    }

    const newHash = await argon2.hash(newPassword);
    await authRepository.updatePassword(userId, newHash);
    // Invalidate old refresh tokens
    await authRepository.deleteAllUserRefreshTokens(userId);
  }
}

export const authService = new AuthService();
