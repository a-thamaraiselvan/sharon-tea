import React, { useState } from 'react';
import type { Product } from '@/types';
import { ProductDetailCard } from './ProductDetailCard';
import { ProductSlideDrawer } from './ProductSlideDrawer';
import { MinimalLoader } from '@/components/ui/MinimalLoader';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  onSelectProduct?: (product: Product) => void;
  onReset?: () => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  isLoading = false,
  onSelectProduct,
  onReset,
  className,
}) => {
  const [internalSelectedProduct, setInternalSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return <MinimalLoader text="Fetching fresh tea packs..." />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs max-w-md mx-auto">
        <p className="text-neutral-600 text-sm mb-4 font-medium">
          No packaged tea products found matching this filter.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 rounded-full bg-[#7A1D36] hover:bg-[#54121F] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Show All Products
          </button>
        )}
      </div>
    );
  }

  const handleCardClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setInternalSelectedProduct(product);
    }
  };

  return (
    <>
      {/* 2-column on mobile, 3-col on tablet, 4-column on desktop */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 ${className || ''}`}>
        {products.map((product) => (
          <div key={product.id} className="transition-all duration-200 hover:-translate-y-0.5">
            <ProductDetailCard
              product={product}
              onSelectProduct={handleCardClick}
            />
          </div>
        ))}
      </div>

      {/* Internal Slide Drawer fallback if not handled by parent */}
      {!onSelectProduct && (
        <ProductSlideDrawer
          product={internalSelectedProduct}
          isOpen={!!internalSelectedProduct}
          onClose={() => setInternalSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductGrid;
