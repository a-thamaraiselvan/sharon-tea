import { menuItemRepository } from './repository.js';
import { menuCategoryRepository } from '../menuCategory/repository.js';
import { MenuItemRecord, PaginatedResult } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class MenuItemService {
  async getPublicItems(categoryId?: string): Promise<MenuItemRecord[]> {
    return menuItemRepository.findPublicItems(categoryId);
  }

  async getAllItems(options: {
    categoryId?: string;
    search?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<MenuItemRecord>> {
    return menuItemRepository.findAllItems(options);
  }

  async getItemById(id: string): Promise<MenuItemRecord> {
    const item = await menuItemRepository.findItemById(id);
    if (!item) {
      throw new AppError('Menu item not found', 404);
    }
    return item;
  }

  async createItem(data: {
    category_id?: string;
    categoryId?: string;
    name: string;
    slug?: string;
    short_description?: string | null;
    shortDescription?: string | null;
    price: number | string;
    image_url?: string | null;
    imageUrl?: string | null;
    is_available?: boolean;
    isAvailable?: boolean;
    is_vegetarian?: boolean;
    isVegetarian?: boolean;
    sort_order?: number;
    sortOrder?: number;
  }): Promise<MenuItemRecord> {
    const categoryId = data.category_id || data.categoryId;
    if (!categoryId) {
      throw new AppError('Category ID is required', 400);
    }
    const category = await menuCategoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError('Invalid category ID. Category does not exist.', 400);
    }

    const slug = data.slug
      ? slugify(data.slug)
      : `${category.slug}-${slugify(data.name)}`;

    return menuItemRepository.createItem({
      category_id: categoryId,
      name: data.name,
      slug,
      short_description: data.short_description !== undefined ? data.short_description : data.shortDescription,
      price: Number(data.price) || 0,
      image_url: data.image_url !== undefined ? data.image_url : data.imageUrl,
      is_available: data.is_available ?? data.isAvailable ?? true,
      is_vegetarian: data.is_vegetarian ?? data.isVegetarian ?? true,
      sort_order: Number(data.sort_order ?? data.sortOrder ?? 0),
    });
  }

  async updateItem(
    id: string,
    data: {
      category_id?: string;
      categoryId?: string;
      name?: string;
      slug?: string;
      short_description?: string | null;
      shortDescription?: string | null;
      price?: number | string;
      image_url?: string | null;
      imageUrl?: string | null;
      is_available?: boolean;
      isAvailable?: boolean;
      is_vegetarian?: boolean;
      isVegetarian?: boolean;
      sort_order?: number;
      sortOrder?: number;
    }
  ): Promise<MenuItemRecord> {
    const existing = await menuItemRepository.findItemById(id);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    const categoryId = data.category_id || data.categoryId;
    if (categoryId && categoryId !== existing.category_id) {
      const category = await menuCategoryRepository.findCategoryById(categoryId);
      if (!category) {
        throw new AppError('Invalid category ID', 400);
      }
    }

    if (data.slug) {
      data.slug = slugify(data.slug);
    }

    const updated = await menuItemRepository.updateItem(id, data);
    if (!updated) {
      throw new AppError('Failed to update menu item', 500);
    }
    return updated;
  }

  async toggleAvailability(id: string, isAvailable?: boolean): Promise<MenuItemRecord> {
    const existing = await menuItemRepository.findItemById(id);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    const updated = await menuItemRepository.toggleAvailability(id, isAvailable);
    if (!updated) {
      throw new AppError('Failed to update item availability', 500);
    }
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    const existing = await menuItemRepository.findItemById(id);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    const deleted = await menuItemRepository.softDeleteItem(id);
    if (!deleted) {
      throw new AppError('Failed to delete menu item', 500);
    }
  }
}

export const menuItemService = new MenuItemService();
