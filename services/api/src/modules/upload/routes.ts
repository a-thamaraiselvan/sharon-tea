import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { uploadLimiter } from '../../middleware/rateLimiter.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/errorHandler.js';

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/avif',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          'Invalid file type. Only JPEG, PNG, WEBP, GIF, and AVIF images are allowed.',
          400
        )
      );
    }
  },
});

// Middleware for authentication: optional in local dev for seamless testing, strict in production
const uploadAuth = (req: any, res: any, next: any) => {
  if (env.NODE_ENV === 'development') {
    return optionalAuthenticate(req, res, next);
  }
  return authenticate(req, res, () => {
    authorize('ADMIN', 'STAFF')(req, res, next);
  });
};

const uploadHandler = [
  uploadLimiter,
  uploadAuth,
  upload.any(),
  (req: any, res: any, next: any) => uploadController.uploadImage(req, res, next),
];

// Grandma's Ladle PascalCase endpoints
router.post('/Image', ...uploadHandler);
router.post('/UploadImage', ...uploadHandler);

// RESTful routes
router.post('/image', ...uploadHandler);
router.post('/', ...uploadHandler);

export default router;
