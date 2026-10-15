import { Router } from 'express';
import { productController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Handle list request: if admin token provided, return all; otherwise return available public items
const handleList = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return productController.getAll(req, res, next);
  }
  return productController.getPublic(req, res, next);
};

// Public & hybrid listing routes
router.get('/public', (req, res, next) => productController.getPublic(req, res, next));
router.get('/public/:id', (req, res, next) => productController.getPublicDetail(req, res, next));
router.get('/', optionalAuthenticate, handleList);

// Admin routes
router.get('/:id', optionalAuthenticate, (req, res, next) => productController.getById(req, res, next));
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) =>
  productController.create(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  productController.update(req, res, next)
);
router.patch('/:id/availability', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  productController.update(req, res, next)
);
router.put('/:id/availability', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  productController.update(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  productController.delete(req, res, next)
);

export default router;
