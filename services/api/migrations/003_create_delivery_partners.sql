-- ==============================================================================
-- Sharon Tea Stall — Delivery Partners Master Migration (003)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    partner_url TEXT,
    badge_text VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_delivery_partners_updated_at'
    ) THEN
        CREATE TRIGGER update_delivery_partners_updated_at
            BEFORE UPDATE ON delivery_partners
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Seed Swiggy and Zomato defaults if not present
INSERT INTO delivery_partners (name, slug, logo_url, partner_url, badge_text, description, is_active, sort_order)
VALUES 
    (
        'Swiggy',
        'swiggy',
        '/images/delivery/swiggy.svg',
        'https://www.swiggy.com/direct/brand/182245?source=swiggy-direct&subSource=generic',
        '30-40 Mins',
        'Order Sharon classic chai, special spiced brews, and evening snacks directly on Swiggy.',
        true,
        1
    ),
    (
        'Zomato',
        'zomato',
        '/images/delivery/zomato.svg',
        'https://zoma.to/r/22048775',
        'Live Tracking',
        'Enjoy piping hot Sharon Tea and Coffee delivered fresh to your doorstep via Zomato.',
        true,
        2
    )
ON CONFLICT (slug) DO NOTHING;
