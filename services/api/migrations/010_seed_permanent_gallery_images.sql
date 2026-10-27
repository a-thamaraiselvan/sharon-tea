-- Migration 010: Seed 20 permanent Sharon Tea gallery images if table is empty
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM gallery_images) = 0 THEN
        INSERT INTO gallery_images (image_url, caption, category, sort_order, is_active) VALUES
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3264.webp', 'Iconic Sharon Tea Stall outlet with heritage branding since 2007.', 'store', 1),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3265.webp', 'Sharon Masala Tea and Regular Tea retail packs sealed for freshness.', 'products', 2),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3266.webp', 'Finest whole-leaf CTC tea crafted with traditional South Indian spices.', 'products', 3),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3267.webp', 'The proud Sharon Tea Stall seal representing quality brewing since 2007.', 'store', 4),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3268.webp', 'Fast-paced, friendly service serving hundreds of warm cups every morning.', 'store', 5),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3269.webp', 'Welcoming glowing facade guiding tea lovers across Bengaluru.', 'store', 6),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3270.webp', 'Locals and professionals gathering for their daily energizing tea ritual.', 'moments', 7),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3271.webp', 'The heartbeat of Bengaluru: catching up over steaming cutting chai.', 'moments', 8),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3274.webp', 'Shared laughter, daily news discussions, and fresh chai moments.', 'moments', 9),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3275.webp', 'Deeply rooted in Karnataka with authentic regional hospitality.', 'store', 10),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3276.webp', 'A cup of tea under Bengaluru tree canopy shade.', 'store', 11),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3278.webp', 'Freshly strained, piping hot tea in classic transparent cutting glasses.', 'brewing', 12),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3279.webp', 'Handcrafted decoction, fresh milk, and aromatic spices blended to perfection.', 'brewing', 13),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3285.webp', 'Real moments of refreshment that keep Bengaluru moving forward.', 'moments', 14),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3286.webp', 'Rich golden chai held with care on a breezy Bangalore morning.', 'moments', 15),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3287.webp', 'Continuous steaming boilers maintaining pure water and decoction temperature.', 'brewing', 16),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3288.webp', 'Expanded Sharon cafe model with complete beverage and snack counters.', 'store', 17),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3289.webp', 'Wide variety of teas, coffees, herbal blends, and malt specials.', 'products', 18),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3291.webp', 'Crisp snacks, baked goods, and cozy seating to enjoy your brew.', 'store', 19),
        ('https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3292.webp', 'Unwinding after a busy day with a comforting cup of Sharon tea.', 'moments', 20);
    END IF;
END $$;
