import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { standardLimiter } from './middleware/rateLimiter.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

// Module routes
import authRoutes from './modules/auth/routes.js';
import menuCategoryRoutes from './modules/menuCategory/routes.js';
import menuItemRoutes from './modules/menuItem/routes.js';
import whatsappOrderRoutes from './modules/whatsappOrder/routes.js';
import franchiseRoutes from './modules/franchise/routes.js';
import contactRoutes from './modules/contact/routes.js';
import outletRoutes from './modules/outlet/routes.js';
import galleryRoutes from './modules/gallery/routes.js';
import heroSlideRoutes from './modules/heroSlide/routes.js';
import businessSettingRoutes from './modules/businessSetting/routes.js';
import uploadRoutes from './modules/upload/routes.js';
import deliveryPartnerRoutes from './modules/deliveryPartner/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = (): Express => {
  const app = express();

  // Trust proxy for rate limiting behind reverse proxies (Nginx / Cloudflare / AWS ALB)
  app.set('trust proxy', 1);

  // Security headers with relaxed crossOriginResourcePolicy for public uploaded assets
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Check against env.corsOriginsList with wildcard support (*, *.cloudfront.net, etc.)
        const isAllowed = env.corsOriginsList.some((allowed) => {
          if (allowed === '*' || allowed === origin) return true;
          if (allowed.includes('*')) {
            const pattern = '^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
            return new RegExp(pattern).test(origin);
          }
          return false;
        });

        if (
          isAllowed ||
          env.NODE_ENV === 'development' ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          return callback(null, true);
        }

        console.warn(`[CORS Blocked] Origin "${origin}" not in allowed list:`, env.corsOriginsList);
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );

  // HTTP Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  const publicDir = path.resolve(__dirname, '../public');
  app.use(express.static(publicDir));
  app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

  // Rate Limiting
  app.use('/api', standardLimiter);

  // Health check routes
  const healthCheckHandler = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      brand: 'Sharon Tea and Coffee API',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: '1.0.0',
    });
  };

  app.get('/health', healthCheckHandler);
  app.get('/api/health', healthCheckHandler);
  app.get('/api/v1/health', healthCheckHandler);

  // Register API modules - Pure Grandma's Ladle PascalCase Standard
  const registerRoutes = (router: express.Router) => {
    // Auth
    router.use('/Auth', authRoutes);

    // Product Category
    router.use('/ProductCategory', menuCategoryRoutes);

    // Product (covers beverages and packaged retail blends)
    router.use('/Product', menuItemRoutes);

    // WhatsApp Orders & Analytics
    router.use('/WhatsAppOrder', whatsappOrderRoutes);

    // Franchise Enquiries
    router.use('/FranchiseEnquiry', franchiseRoutes);

    // Contact Enquiries
    router.use('/ContactEnquiry', contactRoutes);

    // Outlets
    router.use('/Outlet', outletRoutes);

    // Gallery
    router.use('/Gallery', galleryRoutes);

    // Hero Slides
    router.use('/HeroSlide', heroSlideRoutes);

    // Business Settings
    router.use('/BusinessSetting', businessSettingRoutes);

    // Delivery Partners
    router.use('/DeliveryPartner', deliveryPartnerRoutes);
    router.use('/delivery-partners', deliveryPartnerRoutes);

    // Upload
    router.use('/Upload', uploadRoutes);
  };

  const v1Router = express.Router();
  registerRoutes(v1Router);

  app.use('/api/v1', v1Router);
  app.use('/api', v1Router); // Alias for convenience

  // 404 Route Handler
  app.use('*', (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint ${req.originalUrl} not found on this server`, 404));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
