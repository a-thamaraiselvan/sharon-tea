/**
 * Formats a numeric price into the Indian Rupee (₹) format.
 * Examples:
 *   formatPrice(20) -> "₹20"
 *   formatPrice(190.50) -> "₹190.50"
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // If whole number, format without decimals
  if (Number.isInteger(num)) {
    return `₹${num.toLocaleString('en-IN')}`;
  }

  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
