import { Router } from 'express';
import { menuCategoryController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Handle list request: if admin token provided, return all; otherwise return active public categories
const handleList = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return menuCategoryController.getAll(req, res, next);
  }
  return menuCategoryController.getPublic(req, res, next);
};

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicProductCategories', (req, res, next) => menuCategoryController.getPublic(req, res, next));
router.get('/GetProductCategories', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  menuCategoryController.getAll(req, res, next)
);
router.get('/GetProductCategoryById/:id', optionalAuthenticate, (req, res, next) =>
  menuCategoryController.getById(req, res, next)
);
router.post('/CreateProductCategory', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.create(req, res, next)
);
router.put('/UpdateProductCategory/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.update(req, res, next)
);
router.patch('/UpdateProductCategory/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.update(req, res, next)
);
router.delete('/DeleteProductCategory/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.delete(req, res, next)
);
router.patch('/UpdateProductCategorySortOrder', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.getAll(req, res, next)
);
router.post('/UpdateProductCategorySortOrder', authenticate, authorize('ADMIN'), (req, res, next) =>
  menuCategoryController.getAll(req, res, next)
);

// Fallbacks / Root routes
router.get('/public', (req, res, next) => menuCategoryController.getPublic(req, res, next));
router.get('/', optionalAuthenticate, handleList);
router.get('/:id', optionalAuthenticate, (req, res, next) => menuCategoryController.getById(req, res, next));
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) => menuCategoryController.create(req, res, next));
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) => menuCategoryController.update(req, res, next));
router.patch('/:id', authenticate, authorize('ADMIN'), (req, res, next) => menuCategoryController.update(req, res, next));
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) => menuCategoryController.delete(req, res, next));

export default router;
