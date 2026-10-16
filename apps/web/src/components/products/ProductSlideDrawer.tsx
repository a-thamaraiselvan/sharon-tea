import React, { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { generateProductOrderLink } from '@/utils/whatsappLink';
import { trackOrderClick } from '@/services/whatsappService';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  Coffee,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';

interface ProductSlideDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductSlideDrawer: React.FC<ProductSlideDrawerProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string>('');

  // Reset quantity and selected image when product changes or drawer opens
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedImg(product.imageUrl);
      setIsOrdered(false);
    }
  }, [product, isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < 20) setQuantity((prev) => prev + 1);
  };

  const handleWhatsAppOrder = () => {
    trackOrderClick({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      source: 'product_slide_drawer',
    });

    setIsOrdered(true);
    setTimeout(() => setIsOrdered(false), 2000);

    const link = generateProductOrderLink({
      name: product.name,
      quantity,
      price: product.price,
      weight: product.weight,
    });

    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const ingredientsList: string[] = Array.isArray(product.ingredients)
    ? product.ingredients
    : typeof product.ingredients === 'string'
    ? (product.ingredients as string)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const discountAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const allImages = Array.from(
    new Set([product.imageUrl, ...(product.images || [])].filter(Boolean))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel: Slide from right */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md sm:max-w-lg md:max-w-xl h-full bg-white shadow-2xl flex flex-col z-50 overflow-hidden drawer-enter">
        {/* Top Bar with Close Button */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy bg-brand-burgundy/10 px-2.5 py-1 rounded-md">
              {product.category || 'Packaged Blend'}
            </span>
            {product.weight && (
              <span className="text-xs text-neutral-500 font-medium">
                {product.weight}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            aria-label="Close product drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Standing Product Pouch Display */}
          <div className="relative rounded-2xl bg-neutral-50 p-6 border border-neutral-100 flex flex-col items-center justify-center">
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-green text-white shadow-sm">
                {product.badge}
              </span>
            )}

            <div className="w-full max-w-[280px] aspect-[4/5] flex items-center justify-center">
              <img
                src={resolveImageUrl(selectedImg || product.imageUrl, '/images/products/img_3687.jpg')}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
                }}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Thumbnails if multiple images exist */}
            {allImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-neutral-200/60 w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={cn(
                      'w-12 h-14 rounded-lg overflow-hidden border p-1 bg-white transition-all',
                      selectedImg === img
                        ? 'border-brand-burgundy ring-2 ring-brand-burgundy/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <img
                      src={resolveImageUrl(img, '/images/products/img_3687.jpg')}
                      alt={`${product.name} view ${idx + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
                      }}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Title & Stock Status */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
                {product.name}
              </h2>
            </div>

            {product.shortDescription && (
              <p className="text-sm text-neutral-500 mt-1">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing Section */}
          <div className="flex items-baseline gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-3xl font-extrabold text-brand-chai font-sans">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                Save {discountPercent}% ({formatPrice(discountAmount)})
              </span>
            )}
            <span className="ml-auto text-xs font-medium text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-md border border-brand-green/20">
              In Stock
            </span>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black/60 mb-2">
              Product Description
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Real Ingredients */}
          {ingredientsList.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-black mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-burgundy" />
                <span>Real Ingredients</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredientsList.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs bg-neutral-100 text-brand-black px-3 py-1.5 rounded-lg border border-neutral-200 font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Brewing Instructions */}
          {product.brewingInstructions && (
            <div className="p-4 rounded-xl bg-brand-cream border border-brand-amber/30">
              <div className="flex items-center gap-2 mb-2 text-brand-burgundy font-bold text-sm">
                <Coffee className="w-4 h-4" />
                <span>Brewing Guide</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {product.brewingInstructions}
              </p>
            </div>
          )}

          {/* Trust Assurances */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-700">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span className="text-xs font-medium">100% Natural Leaves</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-700">
              <Truck className="w-4 h-4 text-brand-burgundy" />
              <span className="text-xs font-medium">Free Delivery above ₹500</span>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="p-4 sm:p-6 border-t border-neutral-100 bg-white space-y-3 shadow-lg">
          {/* Total and Quantity */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Subtotal</span>
              <span className="text-xl font-bold text-brand-black font-sans">
                {formatPrice(product.price * quantity)}
              </span>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-white disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-bold text-brand-black">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= 20}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 hover:bg-white disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Full-width High-Converting Order on WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366] hover:bg-[#20ba5c] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0 fill-current" />
            <span>{isOrdered ? 'Opening WhatsApp...' : 'Order on WhatsApp'}</span>
            <span className="ml-1 px-2.5 py-0.5 rounded-full bg-black/15 text-white text-xs sm:text-sm font-semibold">
              ₹{product.price * quantity}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlideDrawer;
