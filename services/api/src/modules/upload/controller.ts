import { Response, NextFunction } from 'express';
import { uploadService } from './service.js';
import { AuthRequest } from '../../types/index.js';
import { successResponse } from '../../utils/response.js';
import { AppError } from '../../middleware/errorHandler.js';

export class UploadController {
  async uploadImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let file = req.file;

      if (!file && (req as any).files) {
        const filesObj = (req as any).files;
        if (Array.isArray(filesObj)) {
          file = filesObj[0];
        } else {
          file =
            filesObj['image']?.[0] ||
            filesObj['file']?.[0] ||
            (Object.values(filesObj) as any[])[0]?.[0];
        }
      }

      if (!file) {
        throw new AppError(
          'No image file provided. Please attach an "image" or "file" field in your form-data.',
          400
        );
      }

      const hostHeader = req.get('host');
      const media = await uploadService.processAndUploadImage(
        file,
        req.user?.userId,
        hostHeader
      );

      successResponse(
        res,
        {
          id: media.id,
          fileName: media.file_name,
          url: media.s3_url,
          s3Url: media.s3_url,
          s3_url: media.s3_url,
          mimeType: media.mime_type,
          sizeBytes: media.size_bytes,
        },
        'Image uploaded and saved successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
