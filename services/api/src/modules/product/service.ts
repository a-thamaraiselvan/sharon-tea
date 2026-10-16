import { productRepository } from './repository.js';
import { ProductRecord, PaginatedResult } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export class ProductService {
  async getPublicProducts(): Promise<ProductRecord[]> {
    return productRepository.findPublicProducts();
  }

  async getPublicProductDetail(idOrSlug: string): Promise<ProductRecord> {
    const product = await productRepository.findPublicProductByIdOrSlug(idOrSlug);
    if (!product) {
      throw new AppError('Product not found or currently unavailable', 404);
    }
    return product;
  }

  async getAllProducts(options: {
    search?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<ProductRecord>> {
    return productRepository.findAllProducts(options);
  }

  async getProductById(id: string): Promise<ProductRecord> {
    const product = await productRepository.findProductById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async createProduct(data: {
    name: string;
    slug?: string;
    category?: string | null;
    badge?: string | null;
    is_featured?: boolean;
    short_description?: string | null;
    description?: string | null;
    price: number;
    original_price?: number | null;
    pack_size?: string | null;
    ingredients?: string | null;
    preparation_instructions?: string | null;
    image_url?: string | null;
    is_available?: boolean;
    category_id?: string | null;
    sort_order?: number;
  }): Promise<ProductRecord> {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const existing = await productRepository.findProductBySlug(slug);
    if (existing) {
      throw new AppError(`A product with slug "${slug}" already exists`, 409);
    }

    const categoryId = data.category_id || (data as any).categoryId || null;
    const sortOrder = Number(data.sort_order ?? (data as any).sortOrder ?? 0);
    const packSize = data.pack_size || (data as any).packSize || '250g Pouch';
    const originalPrice = data.original_price !== undefined ? data.original_price : (data as any).originalPrice ?? null;
    const shortDesc = data.short_description || (data as any).shortDescription || null;
    const prepInstructions = data.preparation_instructions || (data as any).preparationInstructions || null;
    const imageUrl = data.image_url || (data as any).imageUrl || null;
    const isAvail = data.is_available ?? (data as any).isAvailable ?? true;

    return productRepository.createProduct({
      ...data,
      slug,
      is_available: isAvail,
      category_id: categoryId,
      sort_order: sortOrder,
      pack_size: packSize,
      original_price: originalPrice,
      short_description: shortDesc,
      preparation_instructions: prepInstructions,
      image_url: imageUrl,
    });
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      slug?: string;
      category?: string | null;
      category_id?: string | null;
      categoryId?: string | null;
      badge?: string | null;
      is_featured?: boolean;
      short_description?: string | null;
      shortDescription?: string | null;
      description?: string | null;
      price?: number;
      original_price?: number | null;
      originalPrice?: number | null;
      pack_size?: string | null;
      packSize?: string | null;
      ingredients?: string | null;
      preparation_instructions?: string | null;
      preparationInstructions?: string | null;
      image_url?: string | null;
      imageUrl?: string | null;
      is_available?: boolean;
      isAvailable?: boolean;
      sort_order?: number;
      sortOrder?: number;
    }
  ): Promise<ProductRecord> {
    const existing = await productRepository.findProductById(id);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugCandidate = slugify(data.slug);
      const duplicate = await productRepository.findProductBySlug(slugCandidate);
      if (duplicate && duplicate.id !== id) {
        throw new AppError(`A product with slug "${slugCandidate}" already exists`, 409);
      }
      data.slug = slugCandidate;
    }

    const updatePayload: any = {
      ...data,
      category_id: data.category_id !== undefined ? data.category_id : data.categoryId,
      sort_order: data.sort_order !== undefined ? Number(data.sort_order) : (data.sortOrder !== undefined ? Number(data.sortOrder) : undefined),
      pack_size: data.pack_size || data.packSize,
      original_price: data.original_price !== undefined ? data.original_price : data.originalPrice,
      short_description: data.short_description || data.shortDescription,
      preparation_instructions: data.preparation_instructions || data.preparationInstructions,
      image_url: data.image_url || data.imageUrl,
      is_available: data.is_available !== undefined ? data.is_available : data.isAvailable,
    };

    const updated = await productRepository.updateProduct(id, updatePayload);
    if (!updated) {
      throw new AppError('Failed to update product', 500);
    }
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await productRepository.findProductById(id);
    if (!existing) {
      throw new AppError('Product not found', 404);
    }

    const deleted = await productRepository.softDeleteProduct(id);
    if (!deleted) {
      throw new AppError('Failed to delete product', 500);
    }
  }
}

export const productService = new ProductService();
