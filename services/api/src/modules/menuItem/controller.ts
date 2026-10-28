import { Request, Response, NextFunction } from 'express';
import { menuItemService } from './service.js';
import { paginatedResponse, successResponse } from '../../utils/response.js';

export const formatPublicMenuItem = (m: any) => ({
  id: m.id,
  categoryId: m.category_id || m.categoryId,
  categoryName: m.category_name || m.categoryName || undefined,
  categorySlug: m.category_slug || m.categorySlug || undefined,
  name: (m.name || '').replace(/\bchai\b/gi, 'Tea'),
  slug: m.slug,
  description: (m.short_description || m.shortDescription || m.description || null)?.replace(/\bchai\b/gi, 'tea'),
  shortDescription: (m.short_description || m.shortDescription || m.description || null)?.replace(/\bchai\b/gi, 'tea'),
  price: typeof m.price === 'string' ? parseFloat(m.price) : Number(m.price) || 0,
  imageUrl: m.image_url || m.imageUrl || null,
  isAvailable: m.is_available ?? m.isAvailable ?? true,
  isVegetarian: m.is_vegetarian !== false && m.isVegetarian !== false,
  isBestseller: m.sort_order === 1 || Boolean(m.is_bestseller || m.isBestseller),
});

export const formatAdminMenuItem = (m: any) => ({
  id: m.id,
  categoryId: m.category_id || m.categoryId,
  category_id: m.category_id || m.categoryId,
  categoryName: m.category_name || m.categoryName || undefined,
  category_name: m.category_name || m.categoryName || undefined,
  categorySlug: m.category_slug || m.categorySlug || undefined,
  category_slug: m.category_slug || m.categorySlug || undefined,
  name: m.name,
  slug: m.slug,
  description: m.short_description || m.shortDescription || m.description || null,
  short_description: m.short_description || m.shortDescription || m.description || null,
  shortDescription: m.short_description || m.shortDescription || m.description || null,
  price: typeof m.price === 'string' ? parseFloat(m.price) : Number(m.price) || 0,
  imageUrl: m.image_url || m.imageUrl || null,
  image_url: m.image_url || m.imageUrl || null,
  isAvailable: m.is_available ?? m.isAvailable ?? true,
  is_available: m.is_available ?? m.isAvailable ?? true,
  isVegetarian: m.is_vegetarian !== false && m.isVegetarian !== false,
  is_vegetarian: m.is_vegetarian !== false && m.isVegetarian !== false,
  isBestseller: m.sort_order === 1 || Boolean(m.is_bestseller || m.isBestseller),
  is_bestseller: m.sort_order === 1 || Boolean(m.is_bestseller || m.isBestseller),
  sortOrder: Number(m.sort_order ?? m.sortOrder ?? 0),
  sort_order: Number(m.sort_order ?? m.sortOrder ?? 0),
  createdAt: m.created_at || m.createdAt,
  updatedAt: m.updated_at || m.updatedAt,
});

export class MenuItemController {
  async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryId = (req.query.categoryId || req.query.category) as string | undefined;
      const items = await menuItemService.getPublicItems(categoryId);
      const sanitized = items.map(formatPublicMenuItem);
      successResponse(res, sanitized, 'Menu items retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId, search, isAvailable, page, limit } = req.query;

      const result = await menuItemService.getAllItems({
        categoryId: categoryId as string | undefined,
        search: search as string | undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      });

      const sanitized = result.items.map(formatAdminMenuItem);
      paginatedResponse(res, sanitized, result.total, result.page, result.limit);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuItemService.getItemById(req.params.id as string);
      successResponse(res, formatPublicMenuItem(item), 'Menu item retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuItemService.createItem(req.body);
      successResponse(res, formatPublicMenuItem(item), 'Menu item created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuItemService.updateItem(req.params.id as string, req.body);
      successResponse(res, formatPublicMenuItem(item), 'Menu item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAvailable =
        req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : undefined;
      const item = await menuItemService.toggleAvailability(req.params.id as string, isAvailable);
      successResponse(res, formatPublicMenuItem(item), 'Item availability updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await menuItemService.deleteItem(req.params.id as string);
      successResponse(res, null, 'Menu item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const menuItemController = new MenuItemController();
