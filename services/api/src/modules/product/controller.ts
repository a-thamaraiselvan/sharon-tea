import { Request, Response, NextFunction } from 'express';
import { productService } from './service.js';
import { paginatedResponse, successResponse } from '../../utils/response.js';

export const formatPublicProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category || null,
  badge: p.badge || null,
  is_featured: p.is_featured ?? p.isFeatured ?? false,
  isFeatured: p.is_featured ?? p.isFeatured ?? false,
  short_description: p.short_description || p.shortDescription || null,
  shortDescription: p.short_description || p.shortDescription || null,
  description: p.description || null,
  price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
  original_price: p.original_price
    ? typeof p.original_price === 'string'
      ? parseFloat(p.original_price)
      : p.original_price
    : p.originalPrice
    ? typeof p.originalPrice === 'string'
      ? parseFloat(p.originalPrice)
      : p.originalPrice
    : null,
  originalPrice: p.original_price
    ? typeof p.original_price === 'string'
      ? parseFloat(p.original_price)
      : p.original_price
    : p.originalPrice
    ? typeof p.originalPrice === 'string'
      ? parseFloat(p.originalPrice)
      : p.originalPrice
    : null,
  pack_size: p.pack_size || p.packSize || p.weight || null,
  packSize: p.pack_size || p.packSize || p.weight || null,
  weight: p.pack_size || p.packSize || p.weight || null,
  ingredients: p.ingredients || null,
  preparation_instructions:
    p.preparation_instructions || p.preparationInstructions || p.brewingInstructions || null,
  preparationInstructions:
    p.preparation_instructions || p.preparationInstructions || p.brewingInstructions || null,
  brewingInstructions:
    p.preparation_instructions || p.preparationInstructions || p.brewingInstructions || null,
  image_url: p.image_url || p.imageUrl || null,
  imageUrl: p.image_url || p.imageUrl || null,
  is_available: p.is_available ?? p.isAvailable ?? true,
  isAvailable: p.is_available ?? p.isAvailable ?? true,
  inStock: p.is_available ?? p.isAvailable ?? true,
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
      paginatedResponse(res, result.items, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getProductById(req.params.id as string);
      successResponse(res, product, 'Product retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.createProduct(req.body);
      successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.updateProduct(req.params.id as string, req.body);
      successResponse(res, product, 'Product updated successfully');
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
