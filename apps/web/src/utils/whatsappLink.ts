/**
 * Generates a WhatsApp deep link (wa.me) with pre-filled encoded text.
 * Dynamically prioritizes live API BusinessSettings, then Vite env, then official fallback.
 */

const OFFICIAL_FALLBACK_NUMBER = '919916999209';

let dynamicWhatsAppNumber: string | null = null;

/**
 * Normalizes any phone string (e.g. "+919916999209", "+91 99169 99209", "9916999209")
 * into pure digits formatted with the country code for WhatsApp wa.me links.
 */
export function formatWhatsAppDigits(num?: string | null): string {
  if (!num) return OFFICIAL_FALLBACK_NUMBER;
  const digits = num.replace(/[^0-9]/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length > 0) return digits;
  return OFFICIAL_FALLBACK_NUMBER;
}

/**
 * Allows the live API businessSettings query to register the active WhatsApp number globally.
 */
export function setDynamicWhatsAppNumber(num?: string | null): void {
  if (num) {
    dynamicWhatsAppNumber = formatWhatsAppDigits(num);
  }
}

export function getWhatsAppNumber(): string {
  if (dynamicWhatsAppNumber) {
    return dynamicWhatsAppNumber;
  }
  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNumber && !envNumber.includes('X')) {
    return formatWhatsAppDigits(envNumber);
  }
  return OFFICIAL_FALLBACK_NUMBER;
}

export interface OrderProductInfo {
  name: string;
  quantity?: number;
  price?: number;
  weight?: string;
}

export function generateProductOrderLink(
  product: OrderProductInfo,
  customNumber?: string
): string {
  const number = customNumber ? formatWhatsAppDigits(customNumber) : getWhatsAppNumber();
  const qty = product.quantity || 1;
  const total = product.price ? product.price * qty : undefined;

  let text = `Hello Sharon Tea and Coffee! 👋\n\nI would like to order:`;
  text += `\n📦 *Product:* ${product.name}`;
  if (product.weight) {
    text += `\n⚖️ *Weight/Pack:* ${product.weight}`;
  }
  text += `\n🔢 *Quantity:* ${qty}`;
  if (total !== undefined) {
    text += `\n💰 *Estimated Total:* ₹${total}`;
  }
  text += `\n\nPlease confirm availability and let me know how to complete my order. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralInquiryLink(
  message = 'Hello Sharon Tea and Coffee! 👋 I have an enquiry about your tea blends and franchise opportunities.',
  customNumber?: string
): string {
  const number = customNumber ? formatWhatsAppDigits(customNumber) : getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generateFranchiseInquiryLink(
  cityName?: string,
  customNumber?: string
): string {
  const number = customNumber ? formatWhatsAppDigits(customNumber) : getWhatsAppNumber();
  const text = cityName
    ? `Hello Sharon Tea and Coffee! ☕\n\nI am interested in becoming a Sharon franchise partner in *${cityName}*. Please share franchise details and investment requirements.`
    : `Hello Sharon Tea and Coffee! ☕\n\nI am interested in becoming a Sharon franchise partner. Please share franchise details and investment requirements.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateBeverageOrderLink(
  item: { name: string; price?: number },
  customNumber?: string
): string {
  const number = customNumber ? formatWhatsAppDigits(customNumber) : getWhatsAppNumber();
  const priceText = item.price ? ` (₹${item.price})` : '';
  const text = `Hello Sharon Tea and Coffee! ☕\n\nI would like to order fresh *${item.name}*${priceText}. Please confirm availability and let me know how I can pick it up!`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export interface BulkOrderItem {
  name: string;
  quantity: number;
  price: number;
  weight?: string;
}

export function createWhatsAppBulkOrderUrl(
  items: BulkOrderItem[],
  total: number,
  customNumber?: string
): string {
  const number = customNumber ? formatWhatsAppDigits(customNumber) : getWhatsAppNumber();
  let text = `Hi Sharon Tea & Coffee! 👋\nI would like to place an order:\n\n`;
  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const weightText = item.weight ? ` (${item.weight})` : '';
    text += `• ${item.quantity}x ${item.name}${weightText} (₹${itemTotal})\n`;
  });
  text += `\n*Total: ₹${total}*\n\nPlease let me know how to proceed with payment and delivery.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
