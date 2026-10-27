import React, { useState } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { generateProductOrderLink } from '@/utils/whatsappLink';
import { trackOrderClick } from '@/services/whatsappService';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Heart, Plus, Minus, Leaf, Coffee, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';
import { useCart } from '@/contexts/CartContext';
import { useUiStore } from '@/stores/useUiStore';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

export interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  className?: string;
}

const getProductFeaturePills = (product: Product) => {
  const name = (product.name || '').toLowerCase();
  if (name.includes('chocolate')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Rich Aroma' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Smooth Taste' },
      { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Premium' },
    ];
  }
  if (name.includes('cinnamon')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Natural Blend' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Refreshing' },
      { icon: <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />, label: 'Unique Flavour' },
    ];
  }
  if (name.includes('ginger') && name.includes('elaichi')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Ginger Blend' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Strong Taste' },
      { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Refreshing' },
    ];
  }
  if (name.includes('elaichi')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Fresh Elaichi' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Strong Aroma' },
      { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Premium' },
    ];
  }
  if (name.includes('ginger') && name.includes('mint')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Fresh Mint' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Cooling Taste' },
      { icon: <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Herbal' },
    ];
  }
  if (name.includes('ginger')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Sun-Dried Ginger' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Warm & Spicy' },
      { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Immunity' },
    ];
  }
  if (name.includes('masala')) {
    return [
      { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: 'Royal Spices' },
      { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Kadak Tea' },
      { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Authentic' },
    ];
  }
  return [
    { icon: <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />, label: product.category || 'Natural Blend' },
    { icon: <Coffee className="w-3 h-3 text-amber-700 shrink-0" />, label: 'Rich Aroma' },
    { icon: <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />, label: 'Premium' },
  ];
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  className,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { items, addToCart, updateQuantity } = useCart();
  const { isCartEnabled: uiCartEnabled } = useUiStore();
  const { data: settings } = useBusinessSettings();
  const isCartEnabled =
    (settings as any)?.isCartEnabled ??
    (settings as any)?.is_cart_enabled ??
    uiCartEnabled;

  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < 20) setQuantity((prev) => prev + 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const orderQty = isCartEnabled && inCartQty > 0 ? inCartQty : quantity;
    trackOrderClick({
      productId: product.id,
      productName: product.name,
      quantity: orderQty,
      price: product.price,
      source: 'product_card_whatsapp_order',
    });

    const link = generateProductOrderLink({
      name: product.name,
      quantity: orderQty,
      price: product.price,
      weight: product.weight || product.packSize,
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const originalPrice = product.originalPrice || product.original_price;
  const hasDiscount = originalPrice && originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const weightBadge = (product.weight || product.packSize || product.pack_size || '250g')
    .replace(/\s*Pouch/i, '')
    .trim();

  const shortDesc =
    product.shortDescription || product.short_description || product.description;

  const featurePills = getProductFeaturePills(product);
  const isPouchGraphic = Boolean(product.imageUrl && product.imageUrl.includes('pouch'));

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group bg-white rounded-2xl border border-neutral-200/90 hover:border-brand-green/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between cursor-pointer relative',
        className
      )}
    >
      <div>
        {/* Top Image Container with padding framing */}
        <div className="p-2.5 sm:p-3 pb-0">
          <div
            className={cn(
              'relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden flex items-center justify-center',
              isPouchGraphic ? 'bg-white p-2' : 'bg-neutral-100'
            )}
          >
            <img
              src={resolveImageUrl(product.imageUrl, '/images/products/img_3687.jpg')}
              alt={product.name || 'Sharon Tea Product'}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
              }}
              className={cn(
                'w-full h-full group-hover:scale-105 transition-transform duration-300',
                isPouchGraphic ? 'object-contain' : 'object-cover'
              )}
            />

            {/* Overlay Badge on Top Left of Image */}
            <span className="absolute top-2.5 left-2.5 z-10 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#22c55e] text-white shadow-xs">
              {product.badge || 'New'}
            </span>

            {/* Overlay Circular White Wishlist Heart on Top Right of Image */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-600 hover:text-red-500 transition-all active:scale-110"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 active:scale-125',
                  isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-neutral-600 hover:text-red-500'
                )}
              />
            </button>
          </div>
        </div>

        {/* Product Information Body */}
        <div className="p-2.5 sm:p-3 pt-2.5 space-y-1.5">
          {/* Row 1: Title and Weight Pill */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-brand-green transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="px-2 py-0.5 rounded-md bg-[#FDF8F0] border border-[#F3ECE0] text-neutral-700 font-semibold text-[10px] sm:text-[11px] shrink-0">
              {weightBadge}
            </span>
          </div>

          {/* Row 2: Short Description */}
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed min-h-[2rem]">
            {shortDesc}
          </p>

          {/* Row 3: Feature Pills with Icons (Single Horizontal Row) */}
          <div className="flex items-center gap-1 pt-0.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden no-scrollbar whitespace-nowrap">
            {featurePills.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] sm:text-[11px] font-medium shrink-0"
              >
                {pill.icon}
                <span>{pill.label}</span>
              </span>
            ))}
          </div>

          {/* Row 4: Pricing and Discount */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg sm:text-xl font-extrabold text-[#A44C14] font-sans">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-neutral-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#FFEDD5] text-[#C2410C] font-bold text-[10px] sm:text-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Row 5: Action Controls */}
      <div className="p-2.5 sm:p-3 pt-0 pb-3 flex items-center gap-2">
        {isCartEnabled ? (
          <>
            {/* Bulk Order ON: Dynamic Add Button or Active in-cart Stepper */}
            {inCartQty === 0 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="flex-1 h-8 sm:h-9 rounded-lg border border-neutral-300 hover:border-brand-black bg-white hover:bg-brand-black text-brand-black hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Add</span>
              </button>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-between border-2 border-brand-green rounded-lg bg-brand-green/10 px-1.5 h-8 sm:h-9 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="w-7 h-full flex items-center justify-center text-brand-green hover:text-brand-burgundy font-bold text-base transition-colors cursor-pointer active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs sm:text-sm font-extrabold text-brand-green font-sans px-1 select-none">
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="w-7 h-full flex items-center justify-center text-brand-green hover:text-brand-burgundy font-bold text-base transition-colors cursor-pointer active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Direct WhatsApp Order Icon Button */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="h-8 sm:h-9 w-9 sm:w-10 bg-[#119243] hover:bg-[#0E7B38] text-white rounded-lg flex items-center justify-center shadow-xs transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
              title={`Order ${product.name} directly on WhatsApp`}
              aria-label={`Order ${product.name} directly on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
            </button>
          </>
        ) : (
          <>
            {/* Bulk Order OFF: Standard Stepper + Full-width Order Button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-neutral-200 rounded-lg bg-white px-1.5 py-0.5 shrink-0 h-8 sm:h-9"
            >
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-4 h-6 sm:w-5 sm:h-7 flex items-center justify-center text-neutral-600 hover:text-brand-black disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= 20}
                className="w-4 h-6 sm:w-5 sm:h-7 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              className="flex-1 h-8 sm:h-9 bg-[#119243] hover:bg-[#0E7B38] text-white font-bold text-xs sm:text-sm px-3 rounded-lg shadow-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 min-w-0"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-current" />
              <span className="truncate whitespace-nowrap font-bold">
                Order on WhatsApp
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
