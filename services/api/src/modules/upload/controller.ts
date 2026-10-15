import { Response, NextFunction } from 'express';
import { uploadService } from './service.js';
import { AuthRequest } from '../../types/index.js';
import { successResponse } from '../../utils/response.js';
import { AppError } from '../../middleware/errorHandler.js';

export class UploadController {
  async uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError('No image file provided. Please attach an image field.', 400);
      }

      const media = await uploadService.processAndUploadImage(
        req.file,
        req.user?.userId
      );

      successResponse(
        res,
        {
          id: media.id,
          fileName: media.file_name,
          url: media.s3_url,
          mimeType: media.mime_type,
          sizeBytes: media.size_bytes,
        },
        'Image uploaded and compressed successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
