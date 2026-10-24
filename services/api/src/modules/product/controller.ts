import { Request, Response, NextFunction } from 'express';
import { productService } from './service.js';
import { paginatedResponse, successResponse } from '../../utils/response.js';

export const formatPublicProduct = (p: any) => ({
  id: p.id,
  name: (p.name || '').replace(/\bchai\b/gi, 'Tea'),
  slug: p.slug,
  categoryId: p.category_id || p.categoryId || null,
  category: p.category || null,
  badge: p.badge || null,
  isFeatured: p.is_featured ?? p.isFeatured ?? false,
  shortDescription: (p.short_description || p.shortDescription || null)?.replace(/\bchai\b/gi, 'tea'),
  description: (p.description || null)?.replace(/\bchai\b/gi, 'tea'),
  price: typeof p.price === 'string' ? parseFloat(p.price) : Number(p.price) || 0,
  originalPrice: p.original_price
    ? typeof p.original_price === 'string'
      ? parseFloat(p.original_price)
      : p.original_price
    : p.originalPrice
    ? typeof p.originalPrice === 'string'
      ? parseFloat(p.originalPrice)
      : p.originalPrice
    : null,
  packSize: p.pack_size || p.packSize || p.weight || '250g',
  weight: p.pack_size || p.packSize || p.weight || '250g',
  ingredients: p.ingredients || null,
  brewingInstructions:
    (p.preparation_instructions || p.preparationInstructions || p.brewingInstructions || null)?.replace(/\bchai\b/gi, 'tea'),
  imageUrl: p.image_url || p.imageUrl || null,
  isAvailable: p.is_available ?? p.isAvailable ?? true,
  inStock: p.is_available ?? p.isAvailable ?? true,
});

export const formatAdminProduct = (p: any) => ({
  ...formatPublicProduct(p),
  category_id: p.category_id || p.categoryId || null,
  is_featured: p.is_featured ?? p.isFeatured ?? false,
  short_description: p.short_description || p.shortDescription || null,
  original_price: p.original_price ?? p.originalPrice ?? null,
  pack_size: p.pack_size || p.packSize || p.weight || '250g',
  preparation_instructions: p.preparation_instructions || p.preparationInstructions || null,
  image_url: p.image_url || p.imageUrl || null,
  is_available: p.is_available ?? p.isAvailable ?? true,
  sortOrder: Number(p.sort_order ?? p.sortOrder ?? 0),
  sort_order: Number(p.sort_order ?? p.sortOrder ?? 0),
  createdAt: p.created_at || p.createdAt,
  updatedAt: p.updated_at || p.updatedAt,
});

export class ProductController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productService.getPublicProducts();
      const sanitized = products.map(formatPublicProduct);
      successResponse(res, sanitized, 'Available products retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPublicDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getPublicProductDetail(req.params.id as string);
      successResponse(res, formatPublicProduct(product), 'Product detail retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, isAvailable, page, limit } = req.query;
      const result = await productService.getAllProducts({
        search: search as string | undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      const sanitized = result.items.map(formatAdminProduct);
      paginatedResponse(res, sanitized, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = Boolean((req as any).user && ['ADMIN', 'STAFF'].includes((req as any).user.role));
      const product = await productService.getProductById(req.params.id as string);
      successResponse(res, isAdmin ? formatAdminProduct(product) : formatPublicProduct(product), 'Product retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      successResponse(res, formatAdminProduct(product), 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.updateProduct(req.params.id as string, req.body);
      successResponse(res, formatAdminProduct(product), 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.deleteProduct(req.params.id as string);
      successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
