import apiClient from '@/api/apiClient';
import type { MenuCategory, MenuItem, ApiResponse } from '@/types';

// Authentic Sharon Tea Stall menu items fallback
export const FALLBACK_MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'All Beverages', slug: 'all', displayOrder: 0, isActive: true },
  { id: 'hot-teas', name: 'Hot Teas & Chai', slug: 'hot-teas', description: 'Freshly brewed aromatic teas made with authentic whole spices', displayOrder: 1, isActive: true },
  { id: 'coffees', name: 'Filter Coffees', slug: 'coffees', description: 'Traditional South Indian filter coffee with frothy chicory blends', displayOrder: 2, isActive: true },
  { id: 'cold-beverages', name: 'Cold Beverages', slug: 'cold-beverages', description: 'Chilled, refreshing milkshakes, cold coffee & coolers', displayOrder: 3, isActive: true },
  { id: 'herbal-special', name: 'Herbal & Green Teas', slug: 'herbal-special', description: 'Wellness infusions rich in antioxidants', displayOrder: 4, isActive: true },
];

export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-sharon-classic',
    name: 'Sharon Classic',
    price: 20,
    isBestseller: true,
    badge: '★ BESTSELLER',
    imageUrl: '/images/beverages/sharon-classic.png',
    cardImageUrl: '/images/beverages/cards/sharon-classic.png',
    description: 'Our signature everyday rich spiced milk tea',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-masala-tea',
    name: 'Masala Tea',
    price: 30,
    imageUrl: '/images/beverages/masala-tea.png',
    cardImageUrl: '/images/beverages/cards/masala-tea.png',
    description: 'Infused with freshly ground warm Indian spices',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-ginger-tea',
    name: 'Ginger Tea',
    price: 30,
    imageUrl: '/images/beverages/ginger-tea.png',
    cardImageUrl: '/images/beverages/cards/ginger-tea.png',
    description: 'Brewed with fresh hand-crushed spicy ginger',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-elaichi-tea',
    name: 'Elaichi Tea',
    price: 30,
    imageUrl: '/images/beverages/elaichi-tea.png',
    cardImageUrl: '/images/beverages/cards/elaichi-tea.png',
    description: 'Fragrant green cardamom crushed into creamy chai',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-pepper-tea',
    name: 'Pepper Tea',
    price: 30,
    imageUrl: '/images/beverages/pepper-tea.png',
    cardImageUrl: '/images/beverages/cards/pepper-tea.png',
    description: 'Bold black pepper infused stimulating chai',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-cinnamon-tea',
    name: 'Cinnamon Tea',
    price: 30,
    imageUrl: '/images/beverages/cinnamon-tea.png',
    cardImageUrl: '/images/beverages/cards/cinnamon-tea.png',
    description: 'Sweet woody Ceylon cinnamon infused chai',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-tulsi-tea',
    name: 'Tulsi Tea',
    price: 30,
    imageUrl: '/images/beverages/tulsi-tea.png',
    cardImageUrl: '/images/beverages/cards/tulsi-tea.png',
    description: 'Holy basil leaves brewed for pure immunity',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'item-jaggery-tea',
    name: 'Jaggery Tea',
    price: 30,
    imageUrl: '/images/beverages/jaggery-tea.png',
    cardImageUrl: '/images/beverages/cards/jaggery-tea.png',
    description: 'Traditional unrefined country jaggery sweetened tea',
    category: 'Tea',
    categoryId: 'hot-teas',
    categoryName: 'Hot Teas & Chai',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 'm-5',
    name: 'South Indian Filter Coffee',
    description: 'Traditional brass-filter decoction poured back and forth with piping hot milk for thick froth.',
    category: 'Coffee',
    categoryId: 'coffees',
    categoryName: 'Filter Coffees',
    price: 25,
    isVegetarian: true,
    isBestseller: true,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-sukku-coffee',
    name: 'Sukku Coffee (Dry Ginger Coffee)',
    description: 'Traditional invigorating brew of dry ginger, crushed coriander seeds, and natural palm jaggery.',
    category: 'Coffee',
    categoryId: 'coffees',
    categoryName: 'Filter Coffees',
    price: 25,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-6',
    name: 'Green Tea (Antioxidant Boost)',
    description: 'Delicate high-grown green tea leaves steeped gently for clean, grassy sweetness.',
    category: 'Herbal Tea',
    categoryId: 'herbal-special',
    categoryName: 'Herbal & Green Teas',
    price: 30,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-7',
    name: 'Sharon Cold Coffee',
    description: 'Chilled espresso blend shaken with rich vanilla ice cream and full cream milk.',
    category: 'Cold Beverage',
    categoryId: 'cold-beverages',
    categoryName: 'Cold Beverages',
    price: 70,
    isVegetarian: true,
    isBestseller: true,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-8',
    name: 'Refreshing Rose Milk',
    description: 'Fragrant rose syrup infused in ice-cold milk, garnished with soaked basil seeds (sabja).',
    category: 'Cold Beverage',
    categoryId: 'cold-beverages',
    categoryName: 'Cold Beverages',
    price: 70,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-badam-milk',
    name: 'Chilled Badam Milk',
    description: 'Creamy slow-boiled cow milk infused with crushed almonds, fragrant cardamom and pure saffron.',
    category: 'Cold Beverage',
    categoryId: 'cold-beverages',
    categoryName: 'Cold Beverages',
    price: 70,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-9',
    name: 'Lemon Mint Ice Tea',
    description: 'Crisp black tea brewed cold, infused with freshly squeezed lemon juice and garden mint.',
    category: 'Cold Beverage',
    categoryId: 'cold-beverages',
    categoryName: 'Cold Beverages',
    price: 60,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'm-10',
    name: 'Chocolate Milkshake',
    description: 'Velvety cocoa blended with rich cream and chocolate drizzle for a decadent treat.',
    category: 'Cold Beverage',
    categoryId: 'cold-beverages',
    categoryName: 'Cold Beverages',
    price: 80,
    isVegetarian: true,
    isBestseller: false,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
  },
];

export async function getPublicMenuCategories(): Promise<MenuCategory[]> {
  try {
    const response = await apiClient.get<ApiResponse<MenuCategory[]>>('/ProductCategory/GetPublicProductCategories');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
    return FALLBACK_MENU_CATEGORIES;
  } catch {
    return FALLBACK_MENU_CATEGORIES;
  }
}

export async function getPublicMenuItems(categoryId?: string): Promise<MenuItem[]> {
  try {
    const url = categoryId && categoryId !== 'all'
      ? `/Product/GetPublicProducts?category=${categoryId}`
      : '/Product/GetPublicProducts';
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(url);
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch {
    // Return fallback items
  }

  if (categoryId && categoryId !== 'all') {
    return FALLBACK_MENU_ITEMS.filter((item) => item.categoryId === categoryId);
  }
  return FALLBACK_MENU_ITEMS;
}
