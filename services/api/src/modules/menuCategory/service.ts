import { menuCategoryRepository } from './repository.js';
import { MenuCategoryRecord } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class MenuCategoryService {
  async getPublicCategories(type?: string): Promise<MenuCategoryRecord[]> {
    return menuCategoryRepository.findPublicCategories(type);
  }

  async getAllCategories(type?: string): Promise<MenuCategoryRecord[]> {
    return menuCategoryRepository.findAllCategories(type);
  }

  async getCategoryById(id: string): Promise<MenuCategoryRecord> {
    const category = await menuCategoryRepository.findCategoryById(id);
    if (!category) {
      throw new AppError('Menu category not found', 404);
    }
    return category;
  }

  async createCategory(data: any): Promise<MenuCategoryRecord> {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const existing = await menuCategoryRepository.findCategoryBySlug(slug);
    if (existing) {
      throw new AppError(`A category with slug "${slug}" already exists`, 409);
    }

    const imageUrl = data.image_url ?? data.imageUrl ?? null;
    const sortOrder = Number(data.sort_order ?? data.sortOrder ?? 0);
    const isActive = data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true);

    return menuCategoryRepository.createCategory({
      name: data.name,
      slug,
      description: data.description,
      image_url: imageUrl,
      sort_order: sortOrder,
      is_active: isActive,
      type: data.type || 'menu',
    });
  }

  async updateCategory(id: string, data: any): Promise<MenuCategoryRecord> {
    const existing = await menuCategoryRepository.findCategoryById(id);
    if (!existing) {
      throw new AppError('Menu category not found', 404);
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugCandidate = slugify(data.slug);
      const duplicate = await menuCategoryRepository.findCategoryBySlug(slugCandidate);
      if (duplicate && duplicate.id !== id) {
        throw new AppError(`A category with slug "${slugCandidate}" already exists`, 409);
      }
      data.slug = slugCandidate;
    }

    const updated = await menuCategoryRepository.updateCategory(id, {
      ...data,
      image_url: data.image_url !== undefined ? data.image_url : data.imageUrl,
      sort_order: data.sort_order !== undefined ? data.sort_order : data.sortOrder,
      is_active: data.is_active !== undefined ? data.is_active : data.isActive,
    });
    if (!updated) {
      throw new AppError('Failed to update category', 500);
    }
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await menuCategoryRepository.findCategoryById(id);
    if (!existing) {
      throw new AppError('Menu category not found', 404);
    }
    const success = await menuCategoryRepository.softDeleteCategory(id);
    if (!success) {
      throw new AppError('Failed to delete category', 500);
    }
  }
}

export const menuCategoryService = new MenuCategoryService();
