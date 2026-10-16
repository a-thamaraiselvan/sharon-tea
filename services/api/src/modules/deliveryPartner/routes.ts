import { Router } from 'express';
import { deliveryPartnerController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Grandma's Ladle PascalCase endpoints
router.get('/GetPublicDeliveryPartners', (req, res, next) =>
  deliveryPartnerController.getPublic(req, res, next)
);
router.get('/GetDeliveryPartners', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  deliveryPartnerController.getAll(req, res, next)
);
router.get('/GetDeliveryPartnerById/:id', (req, res, next) =>
  deliveryPartnerController.getById(req, res, next)
);
router.post('/CreateDeliveryPartner', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.create(req, res, next)
);
router.put('/UpdateDeliveryPartner/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.update(req, res, next)
);
router.delete('/DeleteDeliveryPartner/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.delete(req, res, next)
);
router.post('/BulkDeleteDeliveryPartners', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.bulkDelete(req, res, next)
);
router.patch('/ToggleDeliveryPartnerActive/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.toggleActive(req, res, next)
);

// RESTful routes
router.get('/public', (req, res, next) => deliveryPartnerController.getPublic(req, res, next));
router.get('/', authenticate, authorize('ADMIN', 'STAFF'), (req, res, next) =>
  deliveryPartnerController.getAll(req, res, next)
);
router.get('/:id', (req, res, next) => deliveryPartnerController.getById(req, res, next));
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.create(req, res, next)
);
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.update(req, res, next)
);
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) =>
  deliveryPartnerController.delete(req, res, next)
);

export default router;
