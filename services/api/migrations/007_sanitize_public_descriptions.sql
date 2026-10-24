-- ==============================================================================
-- Sharon Tea and Coffee — Sanitize Delivery Partner Descriptions (007)
-- ==============================================================================

UPDATE delivery_partners
SET description = 'Order Sharon classic tea, special spiced brews, and evening snacks directly on Swiggy.'
WHERE slug = 'swiggy';
