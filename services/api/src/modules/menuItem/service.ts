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
    category_id: string;
    name: string;
    slug?: string;
    short_description?: string | null;
    price: number;
    image_url?: string | null;
    is_available?: boolean;
    sort_order?: number;
  }): Promise<MenuItemRecord> {
    const category = await menuCategoryRepository.findCategoryById(data.category_id);
    if (!category) {
      throw new AppError('Invalid category ID. Category does not exist.', 400);
    }

    const slug = data.slug
      ? slugify(data.slug)
      : `${category.slug}-${slugify(data.name)}`;

    return menuItemRepository.createItem({
      category_id: data.category_id,
      name: data.name,
      slug,
      short_description: data.short_description,
      price: data.price,
      image_url: data.image_url,
      is_available: data.is_available ?? true,
      sort_order: data.sort_order ?? 0,
    });
  }

  async updateItem(
    id: string,
    data: {
      category_id?: string;
      name?: string;
      slug?: string;
      short_description?: string | null;
      price?: number;
      image_url?: string | null;
      is_available?: boolean;
      sort_order?: number;
    }
  ): Promise<MenuItemRecord> {
    const existing = await menuItemRepository.findItemById(id);
    if (!existing) {
      throw new AppError('Menu item not found', 404);
    }

    if (data.category_id && data.category_id !== existing.category_id) {
      const category = await menuCategoryRepository.findCategoryById(data.category_id);
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
