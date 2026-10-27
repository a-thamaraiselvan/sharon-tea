import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env based on NODE_ENV and current dir
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/sharon_db'),
  JWT_ACCESS_SECRET: z.string().default('sharon_access_secret_super_secure_key_change_in_production_2026'),
  JWT_REFRESH_SECRET: z.string().default('sharon_refresh_secret_super_secure_key_change_in_production_2026'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174,https://sharon.novacodex.in,https://sharonadmin.novacodex.in,https://novacodex.in'),
  UPLOAD_MODE: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('public/uploads'),
  MAX_FILE_SIZE: z.string().transform((val) => parseInt(val, 10)).default('5242880'),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().default('sharon-tea-media'),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOriginsList: parsed.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export type Env = typeof env;
