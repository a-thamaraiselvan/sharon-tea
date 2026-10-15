import { Router } from 'express';
import { outletController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Handle list request: if admin token provided, return all; otherwise return active public outlets
const handleList = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return outletController.getAll(req, res, next);
  }
  return outletController.getPublic(req, res, next);
};

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicOutlets', (req, res, next) => outletController.getPublic(req, res, next));
router.get('/GetOutlets', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  outletController.getAll(req, res, next)
);
router.get('/GetOutletById/:id', optionalAuthenticate, (req, res, next) =>
  outletController.getById(req, res, next)
);
router.post('/CreateOutlet', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.create(req, res, next)
);
router.put('/UpdateOutlet/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.update(req, res, next)
);
router.patch('/UpdateOutlet/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.update(req, res, next)
);
router.delete('/DeleteOutlet/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.delete(req, res, next)
);

// Fallbacks
router.get('/public', (req, res, next) => outletController.getPublic(req, res, next));
router.get('/', optionalAuthenticate, handleList);
router.get('/:id', optionalAuthenticate, (req, res, next) => outletController.getById(req, res, next));
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.create(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.update(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  outletController.delete(req, res, next)
);

export default router;
