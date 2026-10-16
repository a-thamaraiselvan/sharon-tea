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
  type?: 'menu' | 'product';
  description?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  sortOrder: number;
  sort_order?: number;
  isActive: boolean;
  is_active?: boolean;
  itemCount?: number;
  item_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuCategoryInput {
  name: string;
  slug?: string;
  type?: 'menu' | 'product';
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
  category_id?: string;
  categoryName?: string;
  category_name?: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  short_description?: string | null;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  image_url?: string | null;
  isAvailable: boolean;
  is_available?: boolean;
  isVegetarian?: boolean;
  is_vegetarian?: boolean;
  isBestseller?: boolean;
  is_bestseller?: boolean;
  sortOrder: number;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
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
  categoryId?: string | null;
  category_id?: string | null;
  categoryName?: string | null;
  badge?: string | null;
  shortDescription?: string | null;
  short_description?: string | null;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  original_price?: number | null;
  packSize: string;
  pack_size?: string;
  ingredients?: string | null;
  preparationInstructions?: string | null;
  preparation_instructions?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  images?: string[];
  isAvailable: boolean;
  is_available?: boolean;
  sortOrder: number;
  sort_order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  category?: string;
  categoryId?: string | null;
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
  operating_hours?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  maps_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  isActive: boolean;
  is_active?: boolean;
  sortOrder: number;
  sort_order?: number;
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
  image_url?: string;
  thumbnailUrl?: string;
  sortOrder: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
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
  image_url?: string;
  ctaText?: string | null;
  cta_text?: string | null;
  ctaLink?: string | null;
  cta_link?: string | null;
  secondaryCtaText?: string | null;
  secondary_cta_text?: string | null;
  secondaryCtaLink?: string | null;
  secondary_cta_link?: string | null;
  sortOrder: number;
  sort_order?: number;
  isActive: boolean;
  is_active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSlideInput {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
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

// Delivery Partners Master
export interface DeliveryPartner {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  logo_url?: string | null;
  partnerUrl?: string | null;
  partner_url?: string | null;
  badgeText?: string | null;
  badge_text?: string | null;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeliveryPartnerInput {
  name: string;
  slug?: string;
  logoUrl?: string | null;
  partnerUrl?: string | null;
  badgeText?: string | null;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateDeliveryPartnerInput = Partial<CreateDeliveryPartnerInput>;

