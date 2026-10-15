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
  async getPublicCategories(): Promise<MenuCategoryRecord[]> {
    return menuCategoryRepository.findPublicCategories();
  }

  async getAllCategories(): Promise<MenuCategoryRecord[]> {
    return menuCategoryRepository.findAllCategories();
  }

  async getCategoryById(id: string): Promise<MenuCategoryRecord> {
    const category = await menuCategoryRepository.findCategoryById(id);
    if (!category) {
      throw new AppError('Menu category not found', 404);
    }
    return category;
  }

  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<MenuCategoryRecord> {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const existing = await menuCategoryRepository.findCategoryBySlug(slug);
    if (existing) {
      throw new AppError(`A category with slug "${slug}" already exists`, 409);
    }

    return menuCategoryRepository.createCategory({
      name: data.name,
      slug,
      description: data.description,
      image_url: data.image_url,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      image_url?: string | null;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<MenuCategoryRecord> {
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

    const updated = await menuCategoryRepository.updateCategory(id, data);
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
