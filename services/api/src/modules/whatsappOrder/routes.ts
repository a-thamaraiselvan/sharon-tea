import { Router } from 'express';
import { whatsappOrderController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Grandma's Ladle PascalCase endpoints
router.post('/TrackOrderClick', (req, res, next) => whatsappOrderController.track(req, res, next));
router.get('/GetOrderClicks', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  whatsappOrderController.getAnalytics(req, res, next)
);
router.get('/GetAnalyticsSummary', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  whatsappOrderController.getAnalytics(req, res, next)
);

// Fallbacks
router.post('/track', (req, res, next) => whatsappOrderController.track(req, res, next));
router.post('/', (req, res, next) => whatsappOrderController.track(req, res, next));
router.get('/analytics', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  whatsappOrderController.getAnalytics(req, res, next)
);
router.get('/', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  whatsappOrderController.getAnalytics(req, res, next)
);

export default router;
