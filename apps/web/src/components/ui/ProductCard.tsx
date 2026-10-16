import React, { useState } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { generateProductOrderLink } from '@/utils/whatsappLink';
import { trackOrderClick } from '@/services/whatsappService';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Heart, Plus, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';

export interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  className,
}) => {
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
        'group bg-white rounded-2xl p-3 sm:p-5 border border-neutral-200/80 hover:border-brand-green/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer relative',
        className
      )}
    >
      <div>
        {/* Top Badges Row: "New" Badge on Left, Wishlist Heart on Right */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md bg-brand-leaf-green text-white">
            {product.badge || 'New'}
          </span>

          <button
            type="button"
            onClick={handleWishlistToggle}
            className="p-1 rounded-full text-neutral-400 hover:text-red-500 transition-colors"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={cn(
                'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 active:scale-125',
                isWishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'text-neutral-400 hover:text-red-500'
              )}
            />
          </button>
        </div>

        {/* Standing Product Pouch Upright with Soft Shadow */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 mb-2 sm:mb-3">
          <img
            src={resolveImageUrl(product.imageUrl, '/images/products/img_3687.jpg')}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
            }}
            className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Title (Centered) */}
        <h3 className="font-sans font-bold text-sm sm:text-base text-brand-black group-hover:text-brand-green transition-colors text-center line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing (Centered) */}
        <div className="flex items-baseline justify-center gap-1.5 sm:gap-2 my-2 sm:my-2.5">
          <span className="text-sm sm:text-base font-extrabold text-brand-chai font-sans">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Controls: Quantity Selector + WhatsApp Order Button */}
      <div className="mt-2 pt-2 sm:pt-3 border-t border-neutral-100 flex items-center gap-2">
        {/* Quantity Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center border border-brand-grey rounded-lg bg-white px-1 py-0.5 sm:py-1 shrink-0"
        >
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-5 h-6 sm:w-6 sm:h-7 flex items-center justify-center text-neutral-600 hover:text-brand-black disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <span className="w-5 sm:w-7 text-center text-xs sm:text-sm font-semibold text-brand-black">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= 20}
            className="w-5 h-6 sm:w-6 sm:h-7 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Direct WhatsApp Order Button */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="flex-1 bg-[#128C7E] hover:bg-[#0e7266] text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 min-w-0"
          aria-label={`Order ${product.name} on WhatsApp`}
        >
          <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-current" />
          <span className="truncate whitespace-nowrap">
            <span className="hidden sm:inline">Order on </span>WhatsApp
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
