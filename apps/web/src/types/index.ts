export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  short_description?: string;
  categoryId: string;
  categoryName?: string;
  category?: string;
  price: number;
  isVegetarian?: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  imageUrl?: string;
  cardImageUrl?: string;
  badge?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description: string;
  shortDescription?: string;
  short_description?: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  weight?: string;
  packSize?: string;
  pack_size?: string;
  inStock: boolean;
  imageUrl: string;
  images?: string[];
  ingredients?: string[] | string;
  brewingInstructions?: string;
  isFeatured?: boolean;
  badge?: string;
  flavor?: string;
  tags?: string[];
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  phone: string;
  hours: string;
  googleMapsUrl: string;
  embedUrl?: string;
  imageUrl?: string;
  isMainBranch?: boolean;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'store' | 'brewing' | 'products' | 'moments';
  imageUrl: string;
  caption?: string;
  youtubeUrl?: string;
}

export interface BusinessSettings {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  cupsServedCount: number;
  outletsCount: number;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface FranchiseEnquiryInput {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  investmentBudget: string;
  message?: string;
}

export interface ContactEnquiryInput {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface OrderTrackPayload {
  productId?: string;
  productName: string;
  quantity: number;
  price: number;
  source: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
  logo_url?: string;
  partnerUrl?: string;
  partner_url?: string;
  badgeText?: string;
  badge_text?: string;
  description?: string;
  isActive?: boolean;
  is_active?: boolean;
  sortOrder?: number;
  sort_order?: number;
}
