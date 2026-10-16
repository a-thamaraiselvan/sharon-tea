import React, { useState } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { generateProductOrderLink } from '@/utils/whatsappLink';
import { trackOrderClick } from '@/services/whatsappService';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Heart, Plus, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';

export interface ProductDetailCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  className?: string;
}

export const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  className,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    trackOrderClick({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      source: 'product_card_whatsapp_order',
    });

    if (onAddToCart) {
      onAddToCart(product, quantity);
    }

    const link = generateProductOrderLink({
      name: product.name,
      quantity,
      price: product.price,
      weight: product.weight,
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group bg-white rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-brand-green/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between cursor-pointer relative',
        className
      )}
    >
      <div>
        {/* Image Container with little padding on top, left, right */}
        <div className="p-2 sm:p-2.5 pb-0">
          <div className="relative w-full h-36 sm:h-40 md:h-44 rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
            <img
              src={resolveImageUrl(product.imageUrl, '/images/products/img_3687.jpg')}
              alt={product.name || 'Sharon Tea Product'}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay Badge on Top Left of Image */}
            <span className="absolute top-2 left-2 z-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-leaf-green text-white shadow-xs">
              {product.badge || 'New'}
            </span>

            {/* Overlay Wishlist Heart on Top Right of Image */}
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/85 hover:bg-white text-neutral-600 hover:text-red-500 shadow-xs backdrop-blur-xs transition-all active:scale-110"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200 active:scale-125',
                  isWishlisted
                    ? 'fill-red-500 text-red-500'
                    : 'text-neutral-500 hover:text-red-500'
                )}
              />
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="px-2.5 sm:px-3 pt-2 pb-0">
          {/* Product Title (Centered) */}
          <h3 className="font-sans font-bold text-xs sm:text-sm text-brand-black group-hover:text-brand-green transition-colors text-center line-clamp-1">
            {product.name}
          </h3>

          {/* Product Weight & Category */}
          <p className="text-[10px] sm:text-[11px] text-neutral-500 text-center line-clamp-1 mt-0.5">
            {product.weight || '250g Pouch'}
          </p>

          {/* Pricing (Centered) */}
          <div className="flex items-baseline justify-center gap-1.5 my-1.5">
            <span className="text-xs sm:text-sm md:text-base font-extrabold text-brand-chai font-sans">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls: Quantity Selector + WhatsApp Order Button */}
      <div className="p-2 sm:p-2.5 pt-1.5 border-t border-neutral-100 flex items-center gap-1.5 sm:gap-2">
        {/* Quantity Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 px-1 py-0.5 shrink-0 h-7 sm:h-8"
        >
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-4 h-5 sm:w-5 sm:h-6 flex items-center justify-center text-neutral-600 hover:text-brand-black disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
          <span className="w-4 sm:w-5 text-center text-xs font-bold text-brand-black">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= 20}
            className="w-4 h-5 sm:w-5 sm:h-6 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </button>
        </div>

        {/* Direct WhatsApp Order Button */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="flex-1 h-7 sm:h-8 bg-[#25D366] hover:bg-[#20ba5c] text-white font-bold text-[11px] sm:text-xs px-2 rounded-lg shadow-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 min-w-0"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 fill-current" />
          <span className="truncate whitespace-nowrap font-bold">
            <span className="hidden md:inline">Order on </span>WhatsApp
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailCard;
