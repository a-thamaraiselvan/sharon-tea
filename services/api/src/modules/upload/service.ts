import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env.js';
import { query } from '../../database/connection.js';
import { MediaRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class UploadService {
  private s3Client: S3Client | null = null;

  constructor() {
    if (env.UPLOAD_MODE === 's3' && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  async processAndUploadImage(
    file: Express.Multer.File,
    uploadedBy?: string
  ): Promise<MediaRecord> {
    if (!file || !file.buffer) {
      throw new AppError('No file uploaded or file is empty', 400);
    }

    // Process & compress with Sharp to WebP
    const uniqueId = uuidv4();
    const originalBaseName = path
      .parse(file.originalname)
      .name.toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const fileName = `${originalBaseName}-${uniqueId.slice(0, 8)}.webp`;
    const mimeType = 'image/webp';

    const compressedBuffer = await sharp(file.buffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    const sizeBytes = compressedBuffer.length;
    let s3Key = fileName;
    let s3Url = '';

    if (env.UPLOAD_MODE === 's3' && this.s3Client) {
      s3Key = `uploads/${fileName}`;
      const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: compressedBuffer,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);
      s3Url = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } else {
      // Local storage fallback
      const uploadDir = path.resolve(__dirname, '../../../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, compressedBuffer);
      s3Key = `local:${fileName}`;
      s3Url = `/uploads/${fileName}`;
    }

    // Save record to media table
    const insertRes = await query<MediaRecord>(
      `INSERT INTO media (file_name, s3_key, s3_url, mime_type, size_bytes, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [fileName, s3Key, s3Url, mimeType, sizeBytes, uploadedBy || null]
    );

    return insertRes.rows[0];
  }
}

export const uploadService = new UploadService();
