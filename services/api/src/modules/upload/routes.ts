import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './controller.js';
import { authenticate } from '../../middleware/authenticate.js';
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

// Grandma's Ladle PascalCase endpoints
router.post(
  '/Image',
  uploadLimiter,
  authenticate,
  authorize('ADMIN', 'STAFF'),
  upload.single('image'),
  (req, res, next) => uploadController.uploadImage(req, res, next)
);

router.post(
  '/UploadImage',
  uploadLimiter,
  authenticate,
  authorize('ADMIN', 'STAFF'),
  upload.single('image'),
  (req, res, next) => uploadController.uploadImage(req, res, next)
);

// Fallbacks
router.post(
  '/image',
  uploadLimiter,
  authenticate,
  authorize('ADMIN', 'STAFF'),
  upload.single('image'),
  (req, res, next) => uploadController.uploadImage(req, res, next)
);

export default router;
