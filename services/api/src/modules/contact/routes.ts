import { Router } from 'express';
import { contactController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { enquiryLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Grandma's Ladle PascalCase endpoints
router.post('/CreateContactEnquiry', enquiryLimiter, (req, res, next) =>
  contactController.submit(req, res, next)
);
router.get('/GetContactEnquiries', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getAll(req, res, next)
);
router.get('/GetContactEnquiryById/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getById(req, res, next)
);
router.put('/UpdateContactEnquiry/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.update(req, res, next)
);
router.delete('/DeleteContactEnquiry/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.delete(req, res, next)
);

// Fallbacks
router.post('/submit', enquiryLimiter, (req, res, next) => contactController.submit(req, res, next));
router.post('/enquiries', enquiryLimiter, (req, res, next) => contactController.submit(req, res, next));
router.post('/', enquiryLimiter, (req, res, next) => contactController.submit(req, res, next));
router.get('/enquiries', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getAll(req, res, next)
);
router.get('/', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getAll(req, res, next)
);
router.get('/enquiries/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getAll(req, res, next)
);
router.get('/:id', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  contactController.getAll(req, res, next)
);
router.put('/enquiries/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.update(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.update(req, res, next)
);
router.delete('/enquiries/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.delete(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  contactController.delete(req, res, next)
);

export default router;
