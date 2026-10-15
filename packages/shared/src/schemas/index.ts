import { z } from 'zod';

/**
 * Franchise Enquiry Form Schema
 */
export const franchiseEnquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(100, { message: 'Full name must not exceed 100 characters' }),
  phone: z
    .string()
    .trim()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must not exceed 15 digits' })
    .regex(/^[0-9+\s\-()]+$/, { message: 'Invalid phone number format' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(120, { message: 'Email address is too long' }),
  city: z
    .string()
    .trim()
    .min(1, { message: 'City is required' })
    .max(100, { message: 'City must not exceed 100 characters' }),
  investmentBudget: z
    .string()
    .trim()
    .optional()
    .default(''),
  message: z
    .string()
    .trim()
    .max(1000, { message: 'Message must not exceed 1000 characters' })
    .optional()
    .default(''),
});

export type FranchiseEnquiryInput = z.infer<typeof franchiseEnquirySchema>;

/**
 * Contact Enquiry Form Schema
 */
export const contactEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must not exceed 100 characters' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(120, { message: 'Email address is too long' }),
  phone: z
    .string()
    .trim()
    .max(15, { message: 'Phone number must not exceed 15 digits' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(2000, { message: 'Message must not exceed 2000 characters' }),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;

/**
 * Authentication / Login Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Menu Item Admin / Create Schema
 */
export const menuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Menu item name is required' })
    .max(120, { message: 'Name must not exceed 120 characters' }),
  categoryId: z
    .string()
    .trim()
    .min(1, { message: 'Category is required' }),
  price: z
    .coerce
    .number({ invalid_type_error: 'Price must be a valid number' })
    .positive({ message: 'Price must be greater than 0' }),
  description: z
    .string()
    .trim()
    .max(500, { message: 'Description must not exceed 500 characters' })
    .optional()
    .default(''),
  imageUrl: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal('')),
  isAvailable: z
    .boolean()
    .default(true),
  sortOrder: z
    .coerce
    .number()
    .int()
    .default(0),
  isPopular: z
    .boolean()
    .optional()
    .default(false),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

/**
 * Retail Packaged Product Admin / Create Schema
 */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Product name is required' })
    .max(150, { message: 'Name must not exceed 150 characters' }),
  category: z
    .string()
    .trim()
    .max(100)
    .optional(),
  badge: z
    .string()
    .trim()
    .max(100)
    .optional(),
  shortDescription: z
    .string()
    .trim()
    .max(250, { message: 'Short description must not exceed 250 characters' })
    .optional()
    .default(''),
  description: z
    .string()
    .trim()
    .max(2000, { message: 'Full description must not exceed 2000 characters' })
    .optional()
    .default(''),
  price: z
    .coerce
    .number({ invalid_type_error: 'Price must be a valid number' })
    .positive({ message: 'Price must be greater than 0' }),
  originalPrice: z
    .coerce
    .number()
    .positive({ message: 'Original price must be greater than 0' })
    .optional()
    .nullable(),
  packSize: z
    .string()
    .trim()
    .max(50, { message: 'Pack size must not exceed 50 characters' })
    .optional()
    .default('250g'),
  ingredients: z
    .string()
    .trim()
    .max(500, { message: 'Ingredients list must not exceed 500 characters' })
    .optional()
    .default(''),
  imageUrl: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal('')),
  isAvailable: z
    .boolean()
    .default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Store / Outlet Admin / Create Schema
 */
export const outletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Outlet name is required' })
    .max(150, { message: 'Name must not exceed 150 characters' }),
  address: z
    .string()
    .trim()
    .min(1, { message: 'Address is required' })
    .max(300, { message: 'Address must not exceed 300 characters' }),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Phone number is required' })
    .max(20, { message: 'Phone number must not exceed 20 characters' }),
  operatingHours: z
    .string()
    .trim()
    .max(100, { message: 'Operating hours must not exceed 100 characters' })
    .default('6:00 AM – 11:00 PM Daily'),
  latitude: z
    .coerce
    .number({ invalid_type_error: 'Latitude must be a valid number' })
    .min(-90)
    .max(90)
    .default(13.0827),
  longitude: z
    .coerce
    .number({ invalid_type_error: 'Longitude must be a valid number' })
    .min(-180)
    .max(180)
    .default(80.2707),
  mapsUrl: z
    .string()
    .url({ message: 'Must be a valid Google Maps URL' })
    .optional()
    .or(z.literal('')),
  imageUrl: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal('')),
  isActive: z
    .boolean()
    .default(true),
});

export type OutletInput = z.infer<typeof outletSchema>;
