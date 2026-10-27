import argon2 from 'argon2';
import { pool } from '../database/connection.js';

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

interface MenuItemSeed {
  name: string;
  categorySlug: string;
  price: number;
  short_description: string;
}

const CATEGORIES: CategorySeed[] = [
  {
    name: 'Teas',
    slug: 'teas',
    description: 'Freshly brewed authentic South Indian spiced and traditional teas.',
    sort_order: 1,
  },
  {
    name: 'Black Teas',
    slug: 'black-teas',
    description: 'Crisp, invigorating black tea infusions crafted with hand-picked leaves and fresh citrus.',
    sort_order: 2,
  },
  {
    name: 'Milk',
    slug: 'milk',
    description: 'Wholesome warm fresh dairy drinks, badam milk, and malt classics.',
    sort_order: 3,
  },
  {
    name: 'Coffee',
    slug: 'coffee',
    description: 'Traditional South Indian filter decoction coffees and specialty chukku brews.',
    sort_order: 4,
  },
  {
    name: 'Cold Menu',
    slug: 'cold-menu',
    description: 'Chilled signature iced beverages, cold brews, and creamy shakes.',
    sort_order: 5,
  },
  {
    name: 'Herbal Tea',
    slug: 'herbal-tea',
    description: 'Pure wellness herbal blends, botanical infusions, and antioxidants.',
    sort_order: 6,
  },
  {
    name: 'Add-ons & Customisations',
    slug: 'add-ons-customisations',
    description: 'Pure wild honey, fresh lemon wedges, organic jaggery, and bespoke adjustments.',
    sort_order: 7,
  },
];

const MENU_ITEMS: MenuItemSeed[] = [
  // 1. Teas (17 items)
  { name: 'Sharon Classic', categorySlug: 'teas', price: 20, short_description: 'Our signature everyday rich spiced milk tea' },
  { name: 'Masala Tea', categorySlug: 'teas', price: 30, short_description: 'Infused with freshly ground warm Indian spices' },
  { name: 'Ginger Tea', categorySlug: 'teas', price: 30, short_description: 'Brewed with fresh hand-crushed spicy ginger' },
  { name: 'Elaichi Tea', categorySlug: 'teas', price: 30, short_description: 'Fragrant green cardamom crushed into creamy tea' },
  { name: 'Pepper Tea', categorySlug: 'teas', price: 30, short_description: 'Bold black pepper infused stimulating tea' },
  { name: 'Cinnamon Tea', categorySlug: 'teas', price: 30, short_description: 'Sweet woody Ceylon cinnamon infused tea' },
  { name: 'Tulsi Tea', categorySlug: 'teas', price: 30, short_description: 'Holy basil leaves brewed for pure immunity' },
  { name: 'Jaggery Tea', categorySlug: 'teas', price: 30, short_description: 'Traditional unrefined country jaggery sweetened tea' },
  { name: 'Irani Tea', categorySlug: 'teas', price: 30, short_description: 'Slow-simmered rich and thick Hyderabadi-style tea' },
  { name: 'Cinnamon Elaichi Tea', categorySlug: 'teas', price: 35, short_description: 'Double aromatic blend of cinnamon bark and cardamom' },
  { name: 'Ginger Elaichi Tea', categorySlug: 'teas', price: 35, short_description: 'Zesty crushed ginger harmonized with green cardamom' },
  { name: 'Tulsi Elaichi Tea', categorySlug: 'teas', price: 35, short_description: 'Herbal tulsi soothingly paired with royal cardamom' },
  { name: 'Ginger Pepper Tea', categorySlug: 'teas', price: 35, short_description: 'Deep warming digestive blend of ginger and black pepper' },
  { name: 'Ginger Cinnamon Tea', categorySlug: 'teas', price: 35, short_description: 'Sweet cinnamon matched with pungent fresh ginger' },
  { name: 'Tulsi Ginger Tea', categorySlug: 'teas', price: 35, short_description: 'Classic ayurvedic remedy tea with tulsi and ginger' },
  { name: 'Chocolate Tea', categorySlug: 'teas', price: 40, short_description: 'Decadent dark cocoa melted into steaming hot tea' },
  { name: 'Saffron Tea', categorySlug: 'teas', price: 40, short_description: 'Pure Kashmiri saffron strands steeped in rich milk tea' },

  // 2. Black Teas (8 items)
  { name: 'Black Tea', categorySlug: 'black-teas', price: 15, short_description: 'Pure brisk black tea liquor' },
  { name: 'Lemon Tea', categorySlug: 'black-teas', price: 20, short_description: 'Brisk black tea with fresh squeezed lemon juice' },
  { name: 'Black Ginger Tea', categorySlug: 'black-teas', price: 25, short_description: 'Clear black tea infused with strong crushed ginger' },
  { name: 'Black Elaichi Tea', categorySlug: 'black-teas', price: 25, short_description: 'Clear black tea scented with crushed green cardamom' },
  { name: 'Pepper Lemon Tea', categorySlug: 'black-teas', price: 30, short_description: 'Soothing throat remedy with crushed pepper and citrus' },
  { name: 'Ginger Lemon Tea', categorySlug: 'black-teas', price: 30, short_description: 'Invigorating kick of ginger with tangy fresh lemon' },
  { name: 'Honey Lemon Tea', categorySlug: 'black-teas', price: 30, short_description: 'Wild forest honey and fresh lemon over hot black tea' },
  { name: 'Honey Ginger Lemon Tea', categorySlug: 'black-teas', price: 40, short_description: 'Ultimate immunity blend of honey, spicy ginger, and lemon' },

  // 3. Milk (5 items)
  { name: 'Milk', categorySlug: 'milk', price: 20, short_description: 'Steaming hot farm-fresh cow milk' },
  { name: 'Ginger Milk', categorySlug: 'milk', price: 25, short_description: 'Warm milk infused with soothing fresh crushed ginger' },
  { name: 'Badam Milk', categorySlug: 'milk', price: 30, short_description: 'Rich almond drink flavored with saffron and cardamom' },
  { name: 'Horlicks', categorySlug: 'milk', price: 30, short_description: 'Nutritious malted milk beverage' },
  { name: 'Boost', categorySlug: 'milk', price: 30, short_description: 'Energizing chocolate-malt beverage' },

  // 4. Coffee (6 items)
  { name: 'Black Coffee', categorySlug: 'coffee', price: 20, short_description: 'Fresh decoction brewed straight without milk' },
  { name: 'Filter Coffee', categorySlug: 'coffee', price: 25, short_description: 'Authentic South Indian chicory-blend frothy filter coffee' },
  { name: 'Ginger Coffee', categorySlug: 'coffee', price: 30, short_description: 'Filter coffee with a pungent warm ginger spike' },
  { name: 'Pepper Coffee', categorySlug: 'coffee', price: 30, short_description: 'Strong coffee spiked with freshly ground black pepper' },
  { name: 'Chukku Coffee - Milk', categorySlug: 'coffee', price: 30, short_description: 'Herbal dry ginger coffee made with velvety milk' },
  { name: 'Chukku Coffee - Black', categorySlug: 'coffee', price: 30, short_description: 'Traditional dry ginger herbal black decoction with spices' },

  // 5. Cold Menu (5 items)
  { name: 'Ice Lemon', categorySlug: 'cold-menu', price: 50, short_description: 'Chilled iced black tea with zesty lemon and mint' },
  { name: 'Badam Milk', categorySlug: 'cold-menu', price: 70, short_description: 'Chilled thick badam milk topped with roasted almond slivers' },
  { name: 'Cold Coffee', categorySlug: 'cold-menu', price: 70, short_description: 'Rich frothy blended iced coffee' },
  { name: 'Cold Boost', categorySlug: 'cold-menu', price: 70, short_description: 'Chilled blended chocolate malt shake' },
  { name: 'Rose Milk', categorySlug: 'cold-menu', price: 70, short_description: 'Aromatic rose syrup blended with chilled cream milk' },

  // 6. Herbal Tea (10 items)
  { name: 'Green Tea', categorySlug: 'herbal-tea', price: 30, short_description: 'Pure whole leaf steamed green tea rich in antioxidants' },
  { name: 'Tulsi Tea', categorySlug: 'herbal-tea', price: 30, short_description: 'Pure holy basil herbal water infusion' },
  { name: 'Green Lemon Tea', categorySlug: 'herbal-tea', price: 35, short_description: 'Green tea paired with a fresh squeeze of lemon' },
  { name: 'Green Ginger Tea', categorySlug: 'herbal-tea', price: 35, short_description: 'Whole leaf green tea with crushed ginger infusion' },
  { name: 'Tulsi Lemon Tea', categorySlug: 'herbal-tea', price: 35, short_description: 'Holy basil infusion with tart fresh lemon' },
  { name: 'Tulsi Ginger Tea', categorySlug: 'herbal-tea', price: 35, short_description: 'Pure herbal tulsi and ginger digestive tisane' },
  { name: 'Gastric Herbal Tea', categorySlug: 'herbal-tea', price: 30, short_description: 'Special ajwain, jeera, and saunf infusion for digestion' },
  { name: 'Purple Tea', categorySlug: 'herbal-tea', price: 40, short_description: 'Rare anthocyanin-rich antioxidant purple tea infusion' },
  { name: 'Hibiscus Tea', categorySlug: 'herbal-tea', price: 40, short_description: 'Ruby red tart floral infusion rich in Vitamin C' },
  { name: 'Butterfly Pea Tea', categorySlug: 'herbal-tea', price: 40, short_description: 'Vibrant blue herbal flower tea with natural calming benefits' },

  // 7. Add-ons & Customisations (4 items)
  { name: 'Honey', categorySlug: 'add-ons-customisations', price: 10, short_description: 'Pure organic wild honey add-on' },
  { name: 'Lemon', categorySlug: 'add-ons-customisations', price: 5, short_description: 'Extra fresh lemon wedge / squeeze' },
  { name: 'Jaggery', categorySlug: 'add-ons-customisations', price: 5, short_description: 'Organic unrefined country jaggery substitute' },
  { name: 'Any Customisation', categorySlug: 'add-ons-customisations', price: 5, short_description: 'Custom milk, spice, or sweetness adjustment' },
];

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const seedDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    console.log('Checking database seed status...');

    // 1. Seed Default Admin User: admin@sharon.com (Sharon@2024)
    const adminPassHash = await argon2.hash('Sharon@2024');
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', ['admin@sharon.com']);
    if (adminCheck.rowCount === 0) {
      await client.query(
        `INSERT INTO users (business_id, email, password_hash, name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['SH-ADMIN-001', 'admin@sharon.com', adminPassHash, 'Sharon Admin', 'ADMIN', true]
      );
      console.log('Seeded default admin user: admin@sharon.com');
    } else {
      await client.query(
        `UPDATE users SET password_hash = $1, is_active = true, role = 'ADMIN' WHERE email = $2`,
        [adminPassHash, 'admin@sharon.com']
      );
      console.log('Synchronized admin user: admin@sharon.com (Sharon@2024)');
    }

    // 2. Seed Business Settings
    const settingsCheck = await client.query('SELECT id FROM business_settings LIMIT 1');
    if (settingsCheck.rowCount === 0) {
      await client.query(
        `INSERT INTO business_settings (
          brand_name, tagline, description, phone, email, whatsapp_number,
          address, operating_hours, fssai_license, social_links, announcement_text, announcement_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          'Sharon Tea and Coffee',
          'Authentic Tea & Coffee Moments',
          'Serving authentic South Indian tea, traditional filter coffee, and delicious snacks crafted with rich ingredients and genuine passion.',
          '+91 98765 43210',
          'contact@sharonteaandcoffee.com',
          '919876543210',
          '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038',
          '6:00 AM - 11:00 PM Everyday',
          '12423008000123',
          JSON.stringify({
            instagram: 'https://www.instagram.com/sharon_tea__official?rpxt=MWMweHplZWZjMmV0aQ%3D%3D&utm_source=qr',
            facebook: 'https://facebook.com/sharonteaandcoffee',
            twitter: 'https://twitter.com/sharonteaandcoffee',
          }),
          'Welcome to Sharon Tea and Coffee! Visit our nearest outlet or order our retail packs via WhatsApp.',
          true,
        ]
      );
      console.log('Seeded business settings.');
    } else {
      await client.query(`
        UPDATE business_settings
        SET address = '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038'
      `);
      console.log('Business settings updated with head address.');
    }

    // 3. Seed Menu Categories
    const categoryMap = new Map<string, string>(); // slug -> id
    for (const cat of CATEGORIES) {
      const catCheck = await client.query<{ id: string }>(
        'SELECT id FROM menu_categories WHERE slug = $1',
        [cat.slug]
      );
      if (catCheck.rowCount === 0) {
        const insertRes = await client.query<{ id: string }>(
          `INSERT INTO menu_categories (name, slug, description, sort_order, is_active, type)
           VALUES ($1, $2, $3, $4, true, 'menu')
           RETURNING id`,
          [cat.name, cat.slug, cat.description, cat.sort_order]
        );
        categoryMap.set(cat.slug, insertRes.rows[0].id);
        console.log(`Seeded category: ${cat.name}`);
      } else {
        categoryMap.set(cat.slug, catCheck.rows[0].id);
      }
    }

    // 4. Seed Menu Items (55 total)
    const itemsCountCheck = await client.query('SELECT COUNT(*) as count FROM menu_items WHERE is_deleted = false');
    if (parseInt(itemsCountCheck.rows[0].count, 10) === 0) {
      console.log('Seeding 55 menu items...');
      let sortOrder = 1;
      for (const item of MENU_ITEMS) {
        const catId = categoryMap.get(item.categorySlug);
        if (!catId) {
          console.warn(`Category slug not found for item: ${item.name}`);
          continue;
        }

        const itemSlug = `${item.categorySlug}-${slugify(item.name)}`;
        await client.query(
          `INSERT INTO menu_items (category_id, name, slug, short_description, price, is_available, sort_order)
           VALUES ($1, $2, $3, $4, $5, true, $6)`,
          [catId, item.name, itemSlug, item.short_description, item.price, sortOrder++]
        );
      }
      console.log(`Successfully seeded ${MENU_ITEMS.length} menu items.`);
    } else {
      console.log(`Menu items already present (${itemsCountCheck.rows[0].count} items).`);
    }

    // Update image_url for the 8 exact signature beverages
    const beverageImages: Record<string, string> = {
      'Sharon Classic': '/images/beverages/sharon-classic.png',
      'Masala Tea': '/images/beverages/masala-tea.png',
      'Ginger Tea': '/images/beverages/ginger-tea.png',
      'Elaichi Tea': '/images/beverages/elaichi-tea.png',
      'Pepper Tea': '/images/beverages/pepper-tea.png',
      'Cinnamon Tea': '/images/beverages/cinnamon-tea.png',
      'Tulsi Tea': '/images/beverages/tulsi-tea.png',
      'Jaggery Tea': '/images/beverages/jaggery-tea.png',
    };
    for (const [name, img] of Object.entries(beverageImages)) {
      await client.query('UPDATE menu_items SET image_url = $1 WHERE name = $2', [img, name]);
    }
    console.log('Updated 8 signature beverage image URLs in database.');

    // 5. Seed Retail Products (8 products)
    const productsData = [
      {
        name: 'Chocolate Tea',
        slug: 'chocolate-tea',
        category: 'Black Tea',
        badge: 'New',
        is_featured: false,
        short_description: 'Velvety dark chocolate aroma blended with rich tea leaves.',
        description: 'A decadent blend of toasted cocoa nibs, dark chocolate notes, and full-bodied tea for tea and chocolate lovers alike.',
        price: 210.0,
        original_price: 220.0,
        pack_size: '250g Pouch',
        ingredients: 'Assam Tea Leaves, Pure Cocoa Extract, Vanilla Pod Essence',
        preparation_instructions: 'Best prepared with whole milk. Simmer gently and garnish with cocoa powder.',
        image_url: '/images/products/img_3701.jpg',
      },
      {
        name: 'Cinnamon Tea',
        slug: 'cinnamon-tea',
        category: 'Herbal Tea',
        badge: 'New',
        is_featured: false,
        short_description: 'Naturally sweet and warming Ceylon cinnamon infusion.',
        description: 'Ceylon cinnamon quills blended with rich black tea for a delicate, naturally sweet and woody spiced cup.',
        price: 190.0,
        original_price: 200.0,
        pack_size: '250g Pouch',
        ingredients: 'Assam Black Tea, Pure Ceylon Cinnamon Quills',
        preparation_instructions: 'Boil for 3 minutes in water or milk. Enjoy black with honey or with fresh milk.',
        image_url: '/images/products/img_3693.jpg',
      },
      {
        name: 'Elaichi Tea',
        slug: 'elaichi-tea',
        category: 'Masala Tea',
        badge: 'New',
        is_featured: true,
        short_description: 'Fragrant crushed green cardamom infused with rich Assam tea.',
        description: 'Finest CTC tea leaves enriched with freshly crushed green cardamoms sourced directly from Idukki estates.',
        price: 190.0,
        original_price: 200.0,
        pack_size: '250g Pouch',
        ingredients: 'CTC Black Tea Leaves, Crushed Natural Green Cardamom Pods',
        preparation_instructions: 'Add 1 teaspoon of Sharon Elaichi Tea to boiling milk and water mixture. Simmer for 3 minutes. Strain and enjoy.',
        image_url: '/images/products/img_3686.jpg',
      },
      {
        name: 'Ginger Elaichi Tea',
        slug: 'ginger-elaichi-tea',
        category: 'Masala Tea',
        badge: 'New',
        is_featured: false,
        short_description: 'Spicy ginger bite meets royal green cardamom sweetness.',
        description: 'The golden duo of crushed sun-dried ginger and fragrant cardamom paired with robust CTC tea.',
        price: 240.0,
        original_price: 250.0,
        pack_size: '250g Pouch',
        ingredients: 'Assam CTC Tea, Sun-Dried Ginger, Cardamom Pods',
        preparation_instructions: 'Brew with boiling milk and water for 3 to 4 minutes.',
        image_url: '/images/products/img_3689.jpg',
      },
      {
        name: 'Ginger Mint Tea',
        slug: 'ginger-mint-tea',
        category: 'Green Tea',
        badge: 'New',
        is_featured: false,
        short_description: 'Cooling garden mint paired with zesty ginger root.',
        description: 'Revitalizing combination of dried spearmint leaves, sun-dried ginger flakes, and clean green tea.',
        price: 230.0,
        original_price: 240.0,
        pack_size: '250g Pouch',
        ingredients: 'Green Tea Leaves, Sun-Dried Ginger Flakes, Spearmint Leaves',
        preparation_instructions: 'Steep in hot water for 3 minutes. Strain and serve refreshing hot or iced.',
        image_url: '/images/products/img_3688.jpg',
      },
      {
        name: 'Ginger Tea',
        slug: 'ginger-tea',
        category: 'Herbal Tea',
        badge: 'New',
        is_featured: false,
        short_description: 'Bold sun-dried ginger warmth for an invigorating cup.',
        description: 'High-grade dry ginger crushed with premium granular tea to clear the throat and warm the soul.',
        price: 220.0,
        original_price: 230.0,
        pack_size: '250g Pouch',
        ingredients: 'Assam CTC Tea, Crushed Dry Ginger Root',
        preparation_instructions: 'Boil in equal parts milk and water for 4 minutes. Sweeten with jaggery or sugar.',
        image_url: '/images/products/img_4746.jpg',
      },
      {
        name: 'Masala Tea',
        slug: 'masala-tea',
        category: 'Masala Tea',
        badge: 'Bestseller',
        is_featured: true,
        short_description: 'Signature handcrafted masala tea blend with authentic aromatic spices.',
        description: 'Our signature blend of selected high-grown Assam CTC black tea expertly combined with crushed cardamom, dried ginger, cinnamon, and cloves.',
        price: 180.0,
        original_price: 220.0,
        pack_size: '250g Pouch',
        ingredients: 'Assam Black CTC Tea, Cardamom, Ginger, Cinnamon, Black Pepper, Cloves',
        preparation_instructions: 'Boil 1 cup of water and 1 cup of milk. Add 1.5 teaspoons of Sharon Masala Tea. Simmer for 3-4 minutes.',
        image_url: '/images/products/img_3704.png',
      },
      {
        name: 'Regular Classic Tea',
        slug: 'regular-classic-tea',
        category: 'Black Tea',
        badge: 'Classic',
        is_featured: true,
        short_description: 'Authentic daily Sharon tea blend with rich strength and golden color.',
        description: 'The golden blend that powers our busy counters every morning. Strong, brisk, and deeply satisfying with rich color and robust body that cuts perfectly through milk.',
        price: 150.0,
        original_price: 180.0,
        pack_size: '250g Pouch',
        ingredients: '100% Pure Assam CTC Black Tea',
        preparation_instructions: 'Boil water and fresh cow milk in equal parts. Add 1 teaspoon per cup. Brew for 3 minutes. Strain and enjoy.',
        image_url: '/images/products/img_3687.jpg',
      },
    ];

    // Remove obsolete legacy mock slugs if they exist
    await client.query(`
      DELETE FROM products 
      WHERE slug IN ('masala-tea-pack-250g', 'elaichi-tea-pack-250g', 'regular-tea-pack-250g')
        AND id NOT IN (SELECT product_id FROM whatsapp_order_clicks WHERE product_id IS NOT NULL)
    `);

    for (const prod of productsData) {
      await client.query(
        `INSERT INTO products (
          name, slug, category, badge, is_featured, short_description, description, price, original_price,
          pack_size, ingredients, preparation_instructions, image_url, is_available, is_deleted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, false)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          badge = EXCLUDED.badge,
          is_featured = EXCLUDED.is_featured,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          pack_size = EXCLUDED.pack_size,
          ingredients = EXCLUDED.ingredients,
          preparation_instructions = EXCLUDED.preparation_instructions,
          image_url = EXCLUDED.image_url,
          is_available = true,
          is_deleted = false,
          updated_at = CURRENT_TIMESTAMP`,
        [
          prod.name,
          prod.slug,
          prod.category,
          prod.badge,
          prod.is_featured,
          prod.short_description,
          prod.description,
          prod.price,
          prod.original_price,
          prod.pack_size,
          prod.ingredients,
          prod.preparation_instructions,
          prod.image_url,
        ]
      );
    }
    console.log('Successfully synchronized all 8 retail tea products.');

    // 6. Synchronize Outlets
    const outletsData = [
      {
        name: 'Sharon Tea and Coffee - Indiranagar (Head Branch)',
        address: '#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038',
        phone: '+91 98765 43210',
        operating_hours: 'Open Daily: 5:30 AM – 11:00 PM',
        image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        maps_url: 'https://maps.google.com/?q=%2334,+2nd+Main+Road,+1st+Stage,+Indiranagar,+Bangalore+-+560038',
      },
      {
        name: 'Sharon Tea and Coffee - New Thippasandra',
        address: 'No. 111, New Thippasandra Main Road, Sree Veerajaneya Swamy Seva Samathi, Bangalore - 560075',
        phone: '+91 98765 43211',
        operating_hours: 'Open Daily: 4:30 AM – 10:00 PM',
        image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        maps_url: 'https://maps.google.com/?q=No.+111,+New+Thippasandra+Main+Road,+Bangalore+-+560075',
      },
      {
        name: 'Sharon Tea and Coffee - Kaggadasapura',
        address: '2nd Floor, Railway Crossing, 40, near MRP, Nagappareddy Layout, Kaggadasapura, Bengaluru, Karnataka - 560093',
        phone: '+91 98765 43212',
        operating_hours: 'Open Daily: 6:00 AM – 11:00 PM',
        image_url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
        maps_url: 'https://maps.google.com/?q=40,+Railway+Crossing,+Nagappareddy+Layout,+Kaggadasapura,+Bengaluru+-+560093',
      },
    ];

    await client.query(`
      DELETE FROM outlets
      WHERE address LIKE '%Chennai%' OR address LIKE '%Cathedral%'
    `);

    for (const out of outletsData) {
      const existing = await client.query('SELECT id FROM outlets WHERE name = $1', [out.name]);
      if (existing.rowCount === 0) {
        await client.query(
          `INSERT INTO outlets (name, address, phone, operating_hours, image_url, maps_url, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true)`,
          [out.name, out.address, out.phone, out.operating_hours, out.image_url, out.maps_url]
        );
      } else {
        await client.query(
          `UPDATE outlets
           SET address = $2, phone = $3, operating_hours = $4, image_url = $5, maps_url = $6, is_active = true, updated_at = CURRENT_TIMESTAMP
           WHERE name = $1`,
          [out.name, out.address, out.phone, out.operating_hours, out.image_url, out.maps_url]
        );
      }
    }
    console.log('Successfully synchronized all 3 Bangalore outlet locations.');

    // 6. Seed Default Hero Slide
    const heroCheck = await client.query('SELECT COUNT(*) as count FROM hero_slides');
    if (parseInt(heroCheck.rows[0].count, 10) === 0) {
      await client.query(
        `INSERT INTO hero_slides (title, subtitle, image_url, cta_text, cta_link, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [
          'Experience the Authentic Taste of Sharon Tea & Coffee',
          'Handcrafted with passion, traditional spices, and fresh milk every day.',
          '/uploads/hero-slide-1.jpg',
          'Explore Our Menu',
          '/menu',
          1,
        ]
      );
      console.log('Seeded default hero slide.');
    } else {
      console.log('Hero slides already seeded.');
    }

    // 7. Seed Permanent Gallery Images
    const galleryCheck = await client.query('SELECT COUNT(*) as count FROM gallery_images');
    if (parseInt(galleryCheck.rows[0].count, 10) === 0) {
      const permanentGallery: [string, string, string, number][] = [
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3264.webp", "Iconic Sharon Tea Stall outlet with heritage branding since 2007.", "store", 1],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3265.webp", "Sharon Masala Tea and Regular Tea retail packs sealed for freshness.", "products", 2],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3266.webp", "Finest whole-leaf CTC tea crafted with traditional South Indian spices.", "products", 3],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3267.webp", "The proud Sharon Tea Stall seal representing quality brewing since 2007.", "store", 4],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3268.webp", "Fast-paced, friendly service serving hundreds of warm cups every morning.", "store", 5],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3269.webp", "Welcoming glowing facade guiding tea lovers across Bengaluru.", "store", 6],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3270.webp", "Locals and professionals gathering for their daily energizing tea ritual.", "moments", 7],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3271.webp", "The heartbeat of Bengaluru: catching up over steaming cutting chai.", "moments", 8],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3274.webp", "Shared laughter, daily news discussions, and fresh chai moments.", "moments", 9],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3275.webp", "Deeply rooted in Karnataka with authentic regional hospitality.", "store", 10],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3276.webp", "A cup of tea under Bengaluru tree canopy shade.", "store", 11],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3278.webp", "Freshly strained, piping hot tea in classic transparent cutting glasses.", "brewing", 12],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3279.webp", "Handcrafted decoction, fresh milk, and aromatic spices blended to perfection.", "brewing", 13],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3285.webp", "Real moments of refreshment that keep Bengaluru moving forward.", "moments", 14],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3286.webp", "Rich golden chai held with care on a breezy Bangalore morning.", "moments", 15],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3287.webp", "Continuous steaming boilers maintaining pure water and decoction temperature.", "brewing", 16],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3288.webp", "Expanded Sharon cafe model with complete beverage and snack counters.", "store", 17],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3289.webp", "Wide variety of teas, coffees, herbal blends, and malt specials.", "products", 18],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3291.webp", "Crisp snacks, baked goods, and cozy seating to enjoy your brew.", "store", 19],
        ["https://sharon-tea-media.s3.ap-south-1.amazonaws.com/gallery/IMG_3292.webp", "Unwinding after a busy day with a comforting cup of Sharon tea.", "moments", 20],
      ];

      for (const [url, caption, category, sortOrder] of permanentGallery) {
        await client.query(
          `INSERT INTO gallery_images (image_url, caption, category, sort_order, is_active)
           VALUES ($1, $2, $3, $4, true)`,
          [url, caption, category, sortOrder]
        );
      }
      console.log('Seeded all 20 permanent gallery images into database.');
    } else {
      console.log('Gallery images already present in database.');
    }

    console.log('Database seed check completed.');
  } catch (error) {
    console.error('Database seeding error:', error);
    throw error;
  } finally {
    client.release();
  }
};
