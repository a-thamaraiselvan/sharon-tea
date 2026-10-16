import apiClient from '@/api/apiClient';
import type { Product, ApiResponse } from '@/types';

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-chocolate',
    name: 'Chocolate Tea',
    slug: 'chocolate-tea',
    price: 210,
    originalPrice: 220,
    category: 'Black Tea',
    flavor: 'Chocolate Tea',
    badge: 'New',
    imageUrl: '/images/products/chocolate-pouch.png',
    images: ['/images/products/chocolate-pouch.png', '/images/products/img_3701.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Velvety dark chocolate aroma blended with rich tea leaves.',
    description: 'A decadent blend of toasted cocoa nibs, dark chocolate notes, and full-bodied tea for tea and chocolate lovers alike.',
    ingredients: ['Assam Tea Leaves', 'Pure Cocoa Extract', 'Vanilla Pod Essence'],
    brewingInstructions: 'Best prepared with whole milk. Simmer gently and garnish with cocoa powder.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-cinnamon',
    name: 'Cinnamon Tea',
    slug: 'cinnamon-tea',
    price: 190,
    originalPrice: 200,
    category: 'Herbal Tea',
    flavor: 'Cinnamon Tea',
    badge: 'New',
    imageUrl: '/images/products/cinnamon-pouch.png',
    images: ['/images/products/cinnamon-pouch.png', '/images/products/img_3693.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Naturally sweet and warming Ceylon cinnamon infusion.',
    description: 'Ceylon cinnamon quills blended with rich black tea for a delicate, naturally sweet and woody spiced cup.',
    ingredients: ['Assam Black Tea', 'Pure Ceylon Cinnamon Quills'],
    brewingInstructions: 'Boil for 3 minutes in water or milk. Enjoy black with honey or with fresh milk.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-elaichi',
    name: 'Elaichi Tea',
    slug: 'elaichi-tea',
    price: 190,
    originalPrice: 200,
    category: 'Herbal Tea',
    flavor: 'Elaichi Tea',
    badge: 'New',
    imageUrl: '/images/products/elachi-pouch.png',
    images: ['/images/products/elachi-pouch.png', '/images/products/img_3686.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Fragrant crushed green cardamom infused with rich Assam tea.',
    description: 'Finest CTC tea leaves enriched with freshly crushed green cardamoms sourced directly from Idukki estates.',
    ingredients: ['CTC Black Tea Leaves', 'Crushed Natural Green Cardamom Pods'],
    brewingInstructions: 'Add 1 teaspoon of Sharon Elaichi Tea to boiling milk and water mixture. Simmer for 3 minutes. Strain and enjoy.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-ginger-elaichi',
    name: 'Ginger Elaichi Tea',
    slug: 'ginger-elaichi-tea',
    price: 240,
    originalPrice: 250,
    category: 'Masala Tea',
    flavor: 'Ginger Tea',
    badge: 'New',
    imageUrl: '/images/products/ginger-pouch.png',
    images: ['/images/products/ginger-pouch.png', '/images/products/img_3689.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Spicy ginger bite meets royal green cardamom sweetness.',
    description: 'The golden duo of crushed sun-dried ginger and fragrant cardamom paired with robust CTC tea.',
    ingredients: ['Assam CTC Tea', 'Sun-Dried Ginger', 'Cardamom Pods'],
    brewingInstructions: 'Brew with boiling milk and water for 3 to 4 minutes.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-ginger-mint',
    name: 'Ginger Mint Tea',
    slug: 'ginger-mint-tea',
    price: 230,
    originalPrice: 240,
    category: 'Green Tea',
    flavor: 'Mint Tea',
    badge: 'New',
    imageUrl: '/images/products/img_3688.jpg',
    images: ['/images/products/img_3688.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Cooling garden mint paired with zesty ginger root.',
    description: 'Revitalizing combination of dried spearmint leaves, sun-dried ginger flakes, and clean green tea.',
    ingredients: ['Green Tea Leaves', 'Sun-Dried Ginger Flakes', 'Spearmint Leaves'],
    brewingInstructions: 'Steep in hot water for 3 minutes. Strain and serve refreshing hot or iced.',
    inStock: true,
    isFeatured: false,
  },
  {
    id: 'prod-ginger',
    name: 'Ginger Tea',
    slug: 'ginger-tea',
    price: 220,
    originalPrice: 230,
    category: 'Herbal Tea',
    flavor: 'Ginger Tea',
    badge: 'New',
    imageUrl: '/images/products/ginger-pouch.png',
    images: ['/images/products/ginger-pouch.png', '/images/products/img_4746.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Bold sun-dried ginger warmth for an invigorating cup.',
    description: 'High-grade dry ginger crushed with premium granular tea to clear the throat and warm the soul.',
    ingredients: ['Assam CTC Tea', 'Crushed Dry Ginger Root'],
    brewingInstructions: 'Boil in equal parts milk and water for 4 minutes. Sweeten with jaggery or sugar.',
    inStock: true,
    isFeatured: false,
  },
  {
    id: 'prod-masala',
    name: 'Masala Tea',
    slug: 'masala-tea',
    price: 180,
    originalPrice: 220,
    category: 'Masala Tea',
    flavor: 'Masala Tea',
    badge: 'Bestseller',
    imageUrl: '/images/products/img_3704.png',
    images: ['/images/products/img_3704.png'],
    weight: '250g Pouch',
    shortDescription: 'Signature handcrafted masala chai blend with authentic aromatic spices.',
    description: 'Our signature blend of selected high-grown Assam CTC black tea expertly combined with crushed cardamom, dried ginger, cinnamon, and cloves.',
    ingredients: ['Assam Black CTC Tea', 'Cardamom', 'Ginger', 'Cinnamon', 'Black Pepper', 'Cloves'],
    brewingInstructions: 'Boil 1 cup of water and 1 cup of milk. Add 1.5 teaspoons of Sharon Masala Tea. Simmer for 3-4 minutes.',
    inStock: true,
    isFeatured: true,
  },
  {
    id: 'prod-regular',
    name: 'Regular Classic Tea',
    slug: 'regular-classic-tea',
    price: 150,
    originalPrice: 180,
    category: 'Black Tea',
    badge: 'Classic',
    imageUrl: '/images/products/img_3687.jpg',
    images: ['/images/products/img_3687.jpg', '/images/products/img_3688.jpg'],
    weight: '250g Pouch',
    shortDescription: 'Authentic daily Sharon tea blend with rich strength and golden color.',
    description: 'The golden blend that powers our busy counters every morning. Strong, brisk, and deeply satisfying with rich color and robust body that cuts perfectly through milk.',
    ingredients: ['100% Pure Assam CTC Black Tea'],
    brewingInstructions: 'Boil water and fresh cow milk in equal parts. Add 1 teaspoon per cup. Brew for 3 minutes. Strain and enjoy.',
    inStock: true,
    isFeatured: true,
  },
];

export function normalizeProduct(p: any): Product {
  const price = Number(p.price) || 0;
  const originalPrice = p.originalPrice || p.original_price
    ? Number(p.originalPrice || p.original_price)
    : undefined;
  const imageUrl = p.imageUrl || p.image_url || '/images/products/img_3701.jpg';
  const images = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : [imageUrl];

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
