-- Migration 006: Add is_cart_enabled to business_settings
ALTER TABLE business_settings 
ADD COLUMN IF NOT EXISTS is_cart_enabled BOOLEAN NOT NULL DEFAULT true;
