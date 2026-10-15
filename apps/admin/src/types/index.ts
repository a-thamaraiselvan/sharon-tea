export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Menu Category
export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export type UpdateMenuCategoryInput = Partial<CreateMenuCategoryInput>;

// Menu Item
export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  isVegetarian?: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemInput {
  categoryId: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  sortOrder: number;
}

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

// Product (Packaged Products for WhatsApp orders)
export interface Product {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  badge?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  packSize: string;
  ingredients?: string | null;
  preparationInstructions?: string | null;
  imageUrl?: string | null;
  images?: string[];
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  category?: string;
  badge?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  packSize: string;
  ingredients?: string;
  preparationInstructions?: string;
  imageUrl?: string;
  images?: string[];
  isAvailable: boolean;
  sortOrder?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

// Franchise Enquiry
export type FranchiseStatus = 'new' | 'contacted' | 'under_review' | 'converted' | 'closed';

export interface FranchiseEnquiry {
  id: string;
  businessId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state?: string;
  investmentBudget: string;
  currentOccupation?: string;
  message?: string;
  status: FranchiseStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFranchiseEnquiryInput {
  status?: FranchiseStatus;
  adminNotes?: string;
}

// Contact Enquiry
export type ContactStatus = 'new' | 'contacted' | 'closed';

export interface ContactEnquiry {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactEnquiryInput {
  status?: ContactStatus;
  adminNotes?: string;
}

// Outlet
export interface Outlet {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  operatingHours: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutletInput {
  name: string;
  slug?: string;
  address: string;
  phone: string;
  operatingHours: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export type UpdateOutletInput = Partial<CreateOutletInput>;

// Gallery
export type GalleryCategory =
  | 'tea-preparation'
  | 'beverages'
  | 'store-interior'
  | 'packaging'
  | 'customer'
  | 'events';

export interface GalleryItem {
  id: string;
  caption: string;
  category: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryItemInput {
  caption: string;
  category: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  sortOrder: number;
}

export type UpdateGalleryItemInput = Partial<CreateGalleryItemInput>;

// Hero Slide
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSlideInput {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  sortOrder: number;
  isActive: boolean;
}

export type UpdateHeroSlideInput = Partial<CreateHeroSlideInput>;

// Business Settings
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

export interface AnnouncementSettings {
  text: string;
  isActive: boolean;
}

export interface BusinessSettings {
  id?: string;
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
  announcement: AnnouncementSettings;
  updatedAt?: string;
}

export type UpdateBusinessSettingsInput = Partial<BusinessSettings>;

// WhatsApp Analytics
export interface ProductClickStat {
  productId: string;
  productName: string;
  totalClicks: number;
  lastClickDate: string;
}

export interface DailyClickStat {
  date: string;
  clicks: number;
  productName?: string;
}

export interface WhatsAppAnalyticsSummary {
  totalClicks: number;
  uniqueProducts: number;
  mostPopularProduct: {
    name: string;
    clicks: number;
  } | null;
}

export interface WhatsAppAnalyticsData {
  summary: WhatsAppAnalyticsSummary;
  products: ProductClickStat[];
  dailyClicks: DailyClickStat[];
}

// Dashboard Overview
export interface DashboardStats {
  totalMenuItems: number;
  totalProducts: number;
  totalFranchiseEnquiries: number;
  totalContactEnquiries: number;
  newFranchiseEnquiries: number;
  newContactEnquiries: number;
}
