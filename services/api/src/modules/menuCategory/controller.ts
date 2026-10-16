import { Request, Response, NextFunction } from 'express';
import { menuCategoryService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicMenuCategory = (c: any) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  type: c.type || 'menu',
  description: c.description || null,
  image_url: c.image_url || c.imageUrl || null,
  imageUrl: c.image_url || c.imageUrl || null,
  sort_order: Number(c.sort_order ?? c.sortOrder ?? 0),
  sortOrder: Number(c.sort_order ?? c.sortOrder ?? 0),
  display_order: Number(c.sort_order ?? c.sortOrder ?? 0),
  displayOrder: Number(c.sort_order ?? c.sortOrder ?? 0),
  is_active: c.is_active ?? c.isActive ?? true,
  isActive: c.is_active ?? c.isActive ?? true,
  createdAt: c.created_at || c.createdAt,
  updatedAt: c.updated_at || c.updatedAt,
});

export class MenuCategoryController {
  async getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      const categories = await menuCategoryService.getPublicCategories(type);
      const sanitized = categories.map(formatPublicMenuCategory);
      successResponse(res, sanitized, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      const categories = await menuCategoryService.getAllCategories(type);
      const sanitized = categories.map(formatPublicMenuCategory);
      successResponse(res, sanitized, 'All categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await menuCategoryService.getCategoryById(req.params.id as string);
      successResponse(res, formatPublicMenuCategory(category), 'Category details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await menuCategoryService.createCategory({
        ...req.body,
        type: req.body.type || 'menu',
      });
      successResponse(res, formatPublicMenuCategory(created), 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await menuCategoryService.updateCategory(req.params.id as string, req.body);
      successResponse(res, formatPublicMenuCategory(updated), 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await menuCategoryService.deleteCategory(req.params.id as string);
      successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const menuCategoryController = new MenuCategoryController();
