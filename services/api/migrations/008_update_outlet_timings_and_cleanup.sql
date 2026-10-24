-- Migration: 008_update_outlet_timings_and_cleanup.sql
-- Description: Update Indiranagar and Thippasandra outlet operating hours and remove legacy duplicates

-- 1. Remove legacy duplicate outlets
DELETE FROM outlets 
WHERE id IN (
  '966c855c-eb8d-4c6f-ae29-068d6703091e',
  'd450fbb5-e49d-4429-b21e-d7ca34b077ad'
);

-- 2. Update Indiranagar timing: 5:30 AM to 11:00 PM
UPDATE outlets
SET operating_hours = 'Open Daily: 5:30 AM – 11:00 PM',
    name = 'Sharon Tea and Coffee - Indiranagar (Head Branch)'
WHERE address LIKE '%Indiranagar%' OR name LIKE '%Indiranagar%';

-- 3. Update Thippasandra timing: 4:30 AM to 10:00 PM
UPDATE outlets
SET operating_hours = 'Open Daily: 4:30 AM – 10:00 PM',
    name = 'Sharon Tea and Coffee - New Thippasandra'
WHERE address LIKE '%Thippasandra%' OR name LIKE '%Thippasandra%';

-- 4. Update Business Settings operating hours & brand name
UPDATE business_settings
SET brand_name = 'Sharon Tea and Coffee',
    operating_hours = '5:30 AM – 11:00 PM (Mon – Sat)';
