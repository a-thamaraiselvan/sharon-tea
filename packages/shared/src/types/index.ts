/**
 * Sharon Tea and Coffee — Shared TypeScript Interfaces & Types
 */

export type EnquiryStatus = 'pending' | 'contacted' | 'approved' | 'rejected' | 'closed';

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'staff';

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: MenuCategory;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
  description: string;
  isPopular?: boolean;
  calories?: number | null;
  servingSize?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string;
  badge?: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  packSize: string;
  ingredients: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  inStock?: boolean;
  stockCount?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FranchiseEnquiry {
  id: string;
  businessId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  investmentBudget: string;
  message?: string | null;
  status: EnquiryStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactEnquiry {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: EnquiryStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  mapsUrl: string;
  isActive: boolean;
  seatingCapacity?: number | null;
  hasParking?: boolean;
  hasDineIn?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  sortOrder: number;
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface BusinessSettings {
  id: string;
  brandName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  address: string;
  operatingHours: string;
  fssaiLicense: string;
  socialLinks: SocialLinks;
  announcementText?: string | null;
  announcementActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WhatsAppOrderClick {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  quantity: number;
  customerPhone?: string | null;
  referrerSource?: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  businessId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

/** Standard API Response payload */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Paginated API Response payload */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
