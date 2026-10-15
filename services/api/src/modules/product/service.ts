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
  }): Promise<ProductRecord> {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const existing = await productRepository.findProductBySlug(slug);
    if (existing) {
      throw new AppError(`A product with slug "${slug}" already exists`, 409);
    }

    return productRepository.createProduct({
      ...data,
      slug,
      is_available: data.is_available ?? true,
    });
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      slug?: string;
      category?: string | null;
      badge?: string | null;
      is_featured?: boolean;
      short_description?: string | null;
      description?: string | null;
      price?: number;
      original_price?: number | null;
      pack_size?: string | null;
      ingredients?: string | null;
      preparation_instructions?: string | null;
      image_url?: string | null;
      is_available?: boolean;
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

    const updated = await productRepository.updateProduct(id, data);
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
