/**
 * Sharon Tea and Coffee — Core Constants & Brand Tokens
 */

export const BRAND_COLORS = {
  primary: '#241C24',       // Off-Black: primary text and deepest background accents
  forestGreen: '#1C4C34',   // Forest Green: brand core, headers, rich natural tone
  freshLeafGreen: '#34A43C',// Fresh Leaf Green: vibrant herbal accent, active badges
  chaiBrown: '#A44C14',     // Chai Brown: signature warm tea color, primary CTA
  deepRust: '#7C2C0C',      // Deep Rust: earthy borders, accents, and warm shadows
  amberHighlight: '#FC9C34',// Amber Highlight: badges, warnings, highlights, star ratings
  burgundy: '#541424',      // Burgundy/Maroon: royal luxury accents, dark badges
  warmCream: '#FAF7F2',     // Warm Cream: primary page surface, soothing background
  lightGrey: '#D4D4D4',     // Light Grey: borders, subtle dividers, inactive states
  white: '#FFFFFF',         // White: crisp card surfaces, text against dark
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;

export const BUSINESS_DEFAULTS = {
  brandName: 'Sharon',
  tradeName: 'Sharon Tea and Coffee',
  registeredName: 'Sharon Tea and Coffee Private Limited',
  tagline: 'Every Cup, A Moment to Savour.',
  description:
    'Sharon Tea and Coffee celebrates the soul of South Indian street chai culture with artisanal brewing, authentic spices, and heartfelt hospitality. Serving over 8,000+ cups daily to happy patrons.',
  cupsServedDaily: '8,000+',
  outletsCount: '12+',
  yearsOfHeritage: '15+',
  rating: '4.8',
  defaultPhone: '+91 94441 23456',
  defaultEmail: 'hello@sharontea.in',
  defaultAddress: '124 Heritage Grand Trunk Road, Chennai, Tamil Nadu 600001',
  operatingHours: '6:00 AM – 11:00 PM Daily',
  fssaiLicense: '12421008000452',
  currency: '₹',
  currencyCode: 'INR',
} as const;

export const BRAND_LINES = {
  heroHeadline: 'Every Cup, A Moment to Savour',
  heroSubtitle:
    'Hand-crafted South Indian tea, authentic filter coffee, fresh herbal infusions, and freshly fried savories — brewed fresh from sunrise to twilight.',
  aboutIntro:
    'Born from a deep reverence for authentic tea stall culture, Sharon Tea and Coffee is where age-old brewing traditions meet contemporary quality standards. Every batch is brewed with whole-leaf teas, fresh farm milk, and crushed spices.',
  franchiseHeadline: 'Brew Success with Sharon Tea and Coffee',
  franchiseSubtitle:
    'Join South India’s fastest-growing tea franchise family. Low operational complexity, beloved daily footfalls, and a proven playbook serving 8,000+ cups daily.',
} as const;

export interface CategoryConstant {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const MENU_CATEGORIES: readonly CategoryConstant[] = [
  {
    id: 'cat-teas',
    name: 'Teas',
    slug: 'teas',
    description: 'Our signature milk-brewed teas prepared fresh with crushed spices and rich milk.',
    sortOrder: 1,
  },
  {
    id: 'cat-black-teas',
    name: 'Black Teas',
    slug: 'black-teas',
    description: 'Crisp, aromatic infusions of pure whole-leaf black teas from the Nilgiris and Assam.',
    sortOrder: 2,
  },
  {
    id: 'cat-milk',
    name: 'Milk',
    slug: 'milk',
    description: 'Comforting, steaming mugs of spiced milk, badam milk, and golden turmeric brews.',
    sortOrder: 3,
  },
  {
    id: 'cat-coffee',
    name: 'Coffee',
    slug: 'coffee',
    description: 'Authentic South Indian degree filter coffee decocted to perfection with chicory blends.',
    sortOrder: 4,
  },
  {
    id: 'cat-cold-menu',
    name: 'Cold Menu',
    slug: 'cold-menu',
    description: 'Chilled iced teas, cold coffee thick shakes, and refreshing summer coolers.',
    sortOrder: 5,
  },
  {
    id: 'cat-herbal-tea',
    name: 'Herbal Tea',
    slug: 'herbal-tea',
    description: 'Ayurvedic wellness brews with ginger, tulsi, ashwagandha, and pure honey.',
    sortOrder: 6,
  },
  {
    id: 'cat-addons',
    name: 'Add-ons & Customisations',
    slug: 'addons-customisations',
    description: 'Tailor your cup with extra ginger, cardamom pods, jaggery sweetening, or extra malai.',
    sortOrder: 7,
  },
] as const;

export interface NavItem {
  label: string;
  path: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Menu', path: '/menu' },
  { label: 'Products', path: '/products' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Visit Us', path: '/visit-us' },
] as const;

export const WHATSAPP_NUMBER = '919XXXXXXXXX';

/**
 * Generate a WhatsApp deep-link URL (wa.me) with a pre-filled, URI-encoded message.
 * Cleans punctuation and non-numeric characters from the phone number.
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Helper to build a standardized WhatsApp order message for a menu item.
 */
export function buildWhatsAppOrderMessage(
  itemName: string,
  price: number,
  quantity = 1,
  notes?: string
): string {
  const base = `Hello Sharon Tea and Coffee! 👋\n\nI would like to order:\n• *${quantity}x ${itemName}* (₹${price * quantity})`;
  if (notes && notes.trim().length > 0) {
    return `${base}\n• Special Instructions: ${notes.trim()}\n\nPlease confirm availability and pickup time. Thank you!`;
  }
  return `${base}\n\nPlease confirm availability and pickup time. Thank you!`;
}

/**
 * Helper to build a standardized WhatsApp inquiry message for retail packaged tea products.
 */
export function buildWhatsAppProductMessage(
  productName: string,
  packSize: string,
  price: number,
  quantity = 1
): string {
  return `Hello Sharon Tea and Coffee! 👋\n\nI would like to order the packaged retail product:\n• *Product:* ${productName}\n• *Pack Size:* ${packSize}\n• *Quantity:* ${quantity}\n• *Estimated Total:* ₹${price * quantity}\n\nPlease share delivery options and payment details. Thank you!`;
}
