-- Migration 006: Add Secondary CTA Columns to Hero Slides
ALTER TABLE hero_slides
ADD COLUMN IF NOT EXISTS secondary_cta_text VARCHAR(100),
ADD COLUMN IF NOT EXISTS secondary_cta_link VARCHAR(255);
