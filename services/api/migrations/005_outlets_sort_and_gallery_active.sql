-- ==============================================================================
-- Sharon Tea Stall — Migration 005: Add sort_order to outlets and is_active to gallery_images
-- ==============================================================================

ALTER TABLE outlets ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_outlets_sort_order ON outlets(sort_order);

ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);
