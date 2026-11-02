import apiClient from '@/api/apiClient';
import type { Product, ApiResponse } from '@/types';

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-masala',
    name: 'Masala Tea Pack',
    slug: 'masala-tea-pack',
    price: 180,
    originalPrice: 220,
    category: 'Masala Tea',
    flavor: 'Masala Tea',
    badge: 'Bestseller',
    imageUrl: '/images/products/masala-pouch.png',
    images: ['/images/products/masala-pouch.png', '/images/products/img_3689.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Signature handcrafted masala tea blend with authentic aromatic spices.',
    description: 'Our signature blend of selected high-grown Assam CTC black tea expertly combined with crushed cardamom, dried ginger, cinnamon, and cloves.',
    ingredients: ['Assam Black CTC Tea', 'Cardamom', 'Ginger', 'Cinnamon', 'Black Pepper', 'Cloves'],
    brewingInstructions: 'Boil 1 cup of water and 1 cup of milk. Add 1.5 teaspoons of Sharon Masala Tea. Simmer for 3-4 minutes.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-elaichi',
    name: 'Elaichi Tea Pack',
    slug: 'elaichi-tea-pack',
    price: 190,
    originalPrice: 200,
    category: 'Elaichi Tea',
    flavor: 'Elaichi Tea',
    badge: 'Popular',
    imageUrl: '/images/products/elachi-pouch.png',
    images: ['/images/products/elachi-pouch.png', '/images/products/img_3686.jpg'],
    weight: '250g Pouch',
    shortDescription: 'The perfect blend of premium tea and fragrant green cardamom.',
    description: 'Finest CTC tea leaves enriched with freshly crushed green cardamoms sourced directly from Idukki estates.',
    ingredients: ['CTC Black Tea Leaves', 'Crushed Natural Green Cardamom Pods'],
    brewingInstructions: 'Add 1 teaspoon of Sharon Elaichi Tea to boiling milk and water mixture. Simmer for 3 minutes. Strain and enjoy.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-regular',
    name: 'Regular Tea Pack',
    slug: 'regular-tea-pack',
    price: 150,
    originalPrice: 180,
    category: 'Regular Tea',
    badge: 'Classic',
    imageUrl: '/images/products/img_3687.jpg',
    images: ['/images/products/img_3687.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Authentic daily Sharon tea blend with rich strength and golden color.',
    description: 'The golden blend that powers our busy counters every morning. Strong, brisk, and deeply satisfying with rich color and robust body that cuts perfectly through milk.',
    ingredients: ['100% Pure Assam CTC Black Tea'],
    brewingInstructions: 'Boil water and fresh cow milk in equal parts. Add 1 teaspoon per cup. Brew for 3 minutes. Strain and enjoy.',
    inStock: true,
    isFeatured: true,
  },
];

/**
 * Image correction mapping for products catalog:
 * Corrects mismatched API images or product slugs to their authentic tea pouch visual.
 */
export function resolveProductImage(
  slug: string = '',
  name: string = '',
  rawImageUrl?: string
): { imageUrl: string; images: string[] } {
  const cleanSlug = (slug || '').toLowerCase().trim();
  const cleanName = (name || '').toLowerCase().trim();
  const rawUrl = (rawImageUrl || '').trim();

  // 1. Masala Tea Pack
  if (
    cleanSlug.includes('masala') ||
    cleanName.includes('masala') ||
    rawUrl.includes('masala')
  ) {
    const primary = rawUrl.includes('masala-pouch') ? rawUrl : '/images/products/masala-pouch.png';
    return {
      imageUrl: primary,
      images: [primary, '/images/products/img_3689.jpg'],
    };
  }

  // 2. Elaichi Tea Pack
  if (
    cleanSlug.includes('elaichi') ||
    cleanName.includes('elaichi') ||
    rawUrl.includes('elachi') ||
    rawUrl.includes('img_3686')
  ) {
    const primary = rawUrl.includes('elachi-pouch') ? rawUrl : '/images/products/elachi-pouch.png';
    return {
      imageUrl: primary,
      images: [primary, '/images/products/img_3686.jpg'],
    };
  }

  // 3. Regular Tea Pack
  if (
    cleanSlug.includes('regular') ||
    cleanName.includes('regular') ||
    rawUrl.includes('img_3687')
  ) {
    return {
      imageUrl: '/images/products/img_3687.jpg',
      images: ['/images/products/img_3687.jpg'],
    };
  }

  const fallback = rawUrl || '/images/products/masala-pouch.png';
  return {
    imageUrl: fallback,
    images: [fallback],
  };
}

export function normalizeProduct(p: any): Product {
  const price = Number(p.price) || 0;
  const originalPrice = p.originalPrice || p.original_price
    ? Number(p.originalPrice || p.original_price)
    : undefined;

  const rawImageUrl = p.imageUrl || p.image_url;
  const resolved = resolveProductImage(p.slug, p.name, rawImageUrl);

  // Filter out any mismatched non-pouch images from incoming p.images array
  const rawImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images.filter((img: string) => (
        typeof img === 'string' &&
        !img.includes('img_3693') &&
        !img.includes('img_4746') &&
        !img.includes('img_3704')
      ))
    : [];

  const images = rawImages.length > 0 ? rawImages : resolved.images;
  const imageUrl = resolved.imageUrl;

  const ingredients = Array.isArray(p.ingredients)
    ? p.ingredients
    : typeof p.ingredients === 'string'
    ? p.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  return {
    id: String(p.id),
    name: p.name || 'Sharon Blend',
    slug: p.slug || String(p.id),
    price,
    originalPrice,
    category: p.category || p.category_name || p.categoryName || 'Black Tea',
    flavor: p.flavor || p.name,
    badge: p.badge || (p.isBestseller || p.is_bestseller ? 'Bestseller' : undefined),
    imageUrl,
    images,
    weight: p.weight || p.packSize || p.pack_size || '250g Pouch',
    shortDescription: p.shortDescription || p.short_description || '',
    description: p.description || '',
    ingredients,
    brewingInstructions:
      p.brewingInstructions ||
      p.brewing_instructions ||
      p.preparationInstructions ||
      p.preparation_instructions ||
      '',
    inStock: p.inStock ?? p.isAvailable ?? p.is_available ?? true,
    isFeatured: p.isFeatured ?? p.is_featured ?? false,
  };
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<ApiResponse<Product[]>>('/Product/GetPublicProducts?type=retail');
    if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      // WHEN API LIST COMES: ONLY SHOW API LIST
      return response.data.data.map(normalizeProduct);
    }
  } catch {
    // API error: fall through to default
  }

  // WHEN API CALL LIST COMES EMPTY: SHOW DEFAULT FROM USE
  return FALLBACK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(`/Product/GetProductById/${encodeURIComponent(id)}`);
    if (response.data?.data) {
      return normalizeProduct(response.data.data);
    }
  } catch {
    // Fall through to fallback
  }
  return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id);
}
