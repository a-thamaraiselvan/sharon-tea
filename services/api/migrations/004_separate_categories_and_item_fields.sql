-- ==============================================================================
-- Sharon Tea Stall — Migration 004: Separate Categories & Menu Item Fields
-- ==============================================================================

-- 1. Add category type to menu_categories ('menu' for fresh beverages, 'product' for packaged blends)
ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'menu';
CREATE INDEX IF NOT EXISTS idx_menu_categories_type ON menu_categories(type);

-- 2. Add is_vegetarian and is_bestseller to menu_items
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN NOT NULL DEFAULT false;

-- 3. Add category_id and sort_order to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- 4. Seed Packaged Product Categories if not present
INSERT INTO menu_categories (name, slug, description, sort_order, is_active, type)
VALUES 
    ('Black Tea', 'black-tea', 'Strong, full-bodied Assam black CTC tea blends for bold daily cups.', 1, true, 'product'),
    ('Masala Tea', 'masala-tea', 'Spiced royal blends infused with cardamom, dry ginger, cinnamon and cloves.', 2, true, 'product'),
    ('Herbal Tea', 'herbal-tea', 'Naturally sweet and soothing infusions with Ceylon cinnamon, ginger and tulsi.', 3, true, 'product'),
    ('Green Tea', 'green-tea', 'Refreshing whole-leaf green teas blended with cooling spearmint and botanicals.', 4, true, 'product')
ON CONFLICT (slug) DO UPDATE SET type = 'product';

-- 5. Ensure existing beverage categories have type = 'menu'
UPDATE menu_categories 
SET type = 'menu' 
WHERE type IS NULL OR (slug NOT IN ('black-tea', 'masala-tea', 'herbal-tea', 'green-tea') AND type != 'product');

-- 6. Link retail products to their corresponding product categories
UPDATE products p
SET category_id = c.id
FROM menu_categories c
WHERE c.type = 'product'
  AND (
    (p.category = 'Black Tea' AND c.slug = 'black-tea') OR
    (p.category = 'Masala Tea' AND c.slug = 'masala-tea') OR
    (p.category = 'Herbal Tea' AND c.slug = 'herbal-tea') OR
    (p.category = 'Green Tea' AND c.slug = 'green-tea')
  );
