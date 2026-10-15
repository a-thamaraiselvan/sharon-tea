-- Migration: 002_add_product_category_and_badge.sql
-- Description: Adds category, badge, and is_featured columns to products table if not exists

ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
