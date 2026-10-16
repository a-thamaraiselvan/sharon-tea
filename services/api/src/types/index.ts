import { Request } from 'express';

export type UserRole = 'ADMIN' | 'STAFF';

export interface UserRecord {
  id: string;
  business_id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type SafeUser = Omit<UserRecord, 'password_hash'>;

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  businessId: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export interface MenuCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MenuItemRecord {
  id: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  short_description: string | null;
  price: number | string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number | string;
  original_price: number | string | null;
  pack_size: string | null;
  ingredients: string | null;
  preparation_instructions: string | null;
  image_url: string | null;
  category?: string | null;
  badge?: string | null;
  is_featured?: boolean;
  is_available: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface WhatsappOrderClickRecord {
  id: string;
  business_id: string | null;
  product_id: string | null;
  product_name: string;
  quantity: number;
  customer_phone: string | null;
  created_at: Date;
}

export interface FranchiseEnquiryRecord {
  id: string;
  business_id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  investment_budget: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ContactEnquiryRecord {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface OutletRecord {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  operating_hours: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  maps_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GalleryImageRecord {
  id: string;
  image_url: string;
  caption: string | null;
  category: string | null;
  sort_order: number;
  created_at: Date;
}

export interface HeroSlideRecord {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSettingRecord {
  id: string;
  brand_name: string;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  whatsapp_number: string | null;
  address: string | null;
  operating_hours: string | null;
  fssai_license: string | null;
  social_links: Record<string, string>;
  logo_url: string | null;
  favicon_url: string | null;
  announcement_text: string | null;
  announcement_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MediaRecord {
  id: string;
  file_name: string;
  s3_key: string;
  s3_url: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
  created_at: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeliveryPartnerRecord {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  partner_url: string | null;
  badge_text: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
