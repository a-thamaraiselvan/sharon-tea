import { Router } from 'express';
import { galleryController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Handle list request: if admin token provided, return all; otherwise return active public gallery items
const handleList = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    return galleryController.getAll(req, res, next);
  }
  return galleryController.getPublic(req, res, next);
};

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicGallery', (req, res, next) => galleryController.getPublic(req, res, next));
router.get('/GetGallery', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  galleryController.getAll(req, res, next)
);
router.get('/GetGalleryById/:id', optionalAuthenticate, (req, res, next) =>
  galleryController.getAll(req, res, next)
);
router.post('/CreateGallery', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.create(req, res, next)
);
router.put('/UpdateGallery/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.update(req, res, next)
);
router.delete('/DeleteGallery/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.delete(req, res, next)
);
router.patch('/UpdateGallerySortOrder', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.getAll(req, res, next)
);

// Fallbacks
router.get('/public', (req, res, next) => galleryController.getPublic(req, res, next));
router.get('/', optionalAuthenticate, handleList);
router.get('/:id', optionalAuthenticate, (req, res, next) => galleryController.getAll(req, res, next));
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.create(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.update(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  galleryController.delete(req, res, next)
);

export default router;
