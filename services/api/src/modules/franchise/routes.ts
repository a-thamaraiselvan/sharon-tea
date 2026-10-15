import { Router } from 'express';
import { franchiseController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { enquiryLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Grandma's Ladle PascalCase endpoints
router.post('/CreateFranchiseEnquiry', enquiryLimiter, (req, res, next) =>
  franchiseController.submit(req, res, next)
);
router.get('/GetFranchiseEnquiries', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getAll(req, res, next)
);
router.get('/GetFranchiseEnquiryById/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getById(req, res, next)
);
router.put('/UpdateFranchiseEnquiry/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.update(req, res, next)
);
router.delete('/DeleteFranchiseEnquiry/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.delete(req, res, next)
);

// Fallbacks
router.post('/submit', enquiryLimiter, (req, res, next) => franchiseController.submit(req, res, next));
router.post('/enquiries', enquiryLimiter, (req, res, next) => franchiseController.submit(req, res, next));
router.post('/', enquiryLimiter, (req, res, next) => franchiseController.submit(req, res, next));
router.get('/enquiries', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getAll(req, res, next)
);
router.get('/', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getAll(req, res, next)
);
router.get('/enquiries/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getById(req, res, next)
);
router.get('/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  franchiseController.getById(req, res, next)
);
router.put('/enquiries/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.update(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.update(req, res, next)
);
router.delete('/enquiries/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.delete(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  franchiseController.delete(req, res, next)
);

export default router;
