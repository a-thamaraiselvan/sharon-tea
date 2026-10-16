/**
 * Generates a WhatsApp deep link (wa.me) with pre-filled encoded text.
 */

const DEFAULT_WHATSAPP_NUMBER = '919876543210';

export function getWhatsAppNumber(): string {
  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (!envNumber || envNumber.includes('X')) {
    return DEFAULT_WHATSAPP_NUMBER;
  }
  return envNumber.replace(/[^0-9]/g, '');
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
  const number = (customNumber || getWhatsAppNumber()).replace(/[^0-9]/g, '');
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
  message = 'Hello Sharon Tea and Coffee! I would like to know more about your menu and outlets.',
  customNumber?: string
): string {
  const number = (customNumber || getWhatsAppNumber()).replace(/[^0-9]/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function generateFranchiseInquiryLink(
  cityName?: string,
  customNumber?: string
): string {
  const number = (customNumber || getWhatsAppNumber()).replace(/[^0-9]/g, '');
  const text = cityName
    ? `Hello Sharon Tea and Coffee! ☕\n\nI am interested in becoming a Sharon franchise partner in *${cityName}*. Please share franchise details and investment requirements.`
    : `Hello Sharon Tea and Coffee! ☕\n\nI am interested in becoming a Sharon franchise partner. Please share franchise details and investment requirements.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function generateBeverageOrderLink(
  item: { name: string; price?: number },
  customNumber?: string
): string {
  const number = (customNumber || getWhatsAppNumber()).replace(/[^0-9]/g, '');
  const priceText = item.price ? ` (₹${item.price})` : '';
  const text = `Hello Sharon Tea and Coffee! ☕\n\nI would like to order fresh *${item.name}*${priceText}. Please confirm availability and let me know how I can pick it up!`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

