import { Router } from 'express';
import { authController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Grandma's Ladle PascalCase endpoints
router.post('/Login', authLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/RefreshToken', authLimiter, (req, res, next) => authController.refreshToken(req, res, next));
router.post('/Logout', (req, res, next) => authController.logout(req, res, next));
router.get('/GetCurrentUser', authenticate, (req, res, next) => authController.getCurrentUser(req, res, next));
router.get('/Me', authenticate, (req, res, next) => authController.getCurrentUser(req, res, next));
router.post('/ChangePassword', authenticate, (req, res, next) => authController.changePassword(req, res, next));

// Case aliases
router.post('/login', authLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/refresh-token', authLimiter, (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getCurrentUser(req, res, next));
router.post('/change-password', authenticate, (req, res, next) => authController.changePassword(req, res, next));

export default router;
