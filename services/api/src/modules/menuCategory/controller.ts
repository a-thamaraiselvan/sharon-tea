import { Request, Response, NextFunction } from 'express';
import { menuCategoryService } from './service.js';
import { successResponse } from '../../utils/response.js';

export const formatPublicMenuCategory = (c: any) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description || null,
  image_url: c.image_url || c.imageUrl || null,
  imageUrl: c.image_url || c.imageUrl || null,
  sort_order: c.sort_order ?? c.sortOrder ?? 0,
  sortOrder: c.sort_order ?? c.sortOrder ?? 0,
  display_order: c.sort_order ?? c.sortOrder ?? 0,
  displayOrder: c.sort_order ?? c.sortOrder ?? 0,
  is_active: c.is_active ?? c.isActive ?? true,
  isActive: c.is_active ?? c.isActive ?? true,
});

export class MenuCategoryController {
  async getPublic(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await menuCategoryService.getPublicCategories();
      const sanitized = categories.map(formatPublicMenuCategory);
      successResponse(res, sanitized, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await menuCategoryService.getAllCategories();
      successResponse(res, categories, 'All categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await menuCategoryService.getCategoryById(req.params.id as string);
      successResponse(res, category, 'Category details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await menuCategoryService.createCategory(req.body);
      successResponse(res, created, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await menuCategoryService.updateCategory(req.params.id as string, req.body);
      successResponse(res, updated, 'Category updated successfully');
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
