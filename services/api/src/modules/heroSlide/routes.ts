import { Router } from 'express';
import { heroSlideController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public route
router.get('/GetPublicHeroSlides', (req, res, next) => heroSlideController.getPublic(req, res, next));

// Admin routes
router.get('/GetHeroSlides', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  heroSlideController.getAll(req, res, next)
);
router.get('/GetHeroSlideById/:id', optionalAuthenticate, (req, res, next) =>
  heroSlideController.getById(req, res, next)
);
router.post('/CreateHeroSlide', authenticate, authorize('ADMIN'), (req, res, next) =>
  heroSlideController.create(req, res, next)
);
router.put('/UpdateHeroSlide/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  heroSlideController.update(req, res, next)
);
router.patch('/UpdateHeroSlide/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  heroSlideController.update(req, res, next)
);
router.delete('/DeleteHeroSlide/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  heroSlideController.delete(req, res, next)
);
router.patch('/UpdateHeroSlideSortOrder', authenticate, authorize('ADMIN'), (req, res, next) =>
  heroSlideController.getAll(req, res, next)
);

export default router;
