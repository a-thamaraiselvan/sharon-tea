import { Router } from 'express';
import { businessSettingController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Handle settings read: if admin token provided, return full settings; otherwise return public settings
const handleSettings = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return businessSettingController.getAll(req, res, next);
  }
  return businessSettingController.getPublic(req, res, next);
};

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicBusinessSettings', (req, res, next) => businessSettingController.getPublic(req, res, next));
router.get('/GetBusinessSettings', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  businessSettingController.getAll(req, res, next)
);
router.put('/UpdateBusinessSettings', authenticate, authorize('ADMIN'), (req, res, next) =>
  businessSettingController.update(req, res, next)
);
router.post('/UpdateBusinessSettings', authenticate, authorize('ADMIN'), (req, res, next) =>
  businessSettingController.update(req, res, next)
);

// Fallbacks
router.get('/public', (req, res, next) => businessSettingController.getPublic(req, res, next));
router.get('/', optionalAuthenticate, handleSettings);
router.put('/', authenticate, authorize('ADMIN'), (req, res, next) =>
  businessSettingController.update(req, res, next)
);

export default router;
