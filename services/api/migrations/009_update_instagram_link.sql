-- Migration: 009_update_instagram_link.sql
-- Description: Update official Sharon Instagram profile link in business_settings

UPDATE business_settings
SET social_links = jsonb_set(
  COALESCE(social_links, '{}'::jsonb),
  '{instagram}',
  '"https://www.instagram.com/sharon_tea__official?rpxt=MWMweHplZWZjMmV0aQ%3D%3D&utm_source=qr"'
);
