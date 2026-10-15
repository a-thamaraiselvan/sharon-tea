import React, { useState } from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductDetailCard } from '@/components/products/ProductDetailCard';
import { ProductSlideDrawer } from '@/components/products/ProductSlideDrawer';
import { BrandButton } from '@/components/ui/BrandButton';
import { useProducts } from '@/hooks/useProducts';
import { FALLBACK_PRODUCTS } from '@/services/productService';
import type { Product } from '@/types';
import { PackageCheck, Leaf, ShieldCheck, Truck, Heart } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { data: products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Top 4 signature packaged blends from the exact reference design
  const validFallback = Array.isArray(FALLBACK_PRODUCTS) && FALLBACK_PRODUCTS.length > 0
    ? FALLBACK_PRODUCTS
    : [];
  const allProducts = Array.isArray(products) && products.length > 0 ? products : validFallback;
  const displayProducts = (allProducts.length > 0 ? allProducts : validFallback).slice(0, 4);

  return (
    <SectionContainer background="cream" className="py-16 md:py-24">
      <div className="reveal-up">
        <SectionHeading
          badge="Packaged Blends"
          title="Bring Sharon Home"
          subtitle="Savor the authentic Sharon Tea Stall experience right from your kitchen. Packed in freshness-preserving foil pouches."
        />
      </div>

      {/* Grid: 2-col on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto reveal-stagger">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className="reveal-up"
            style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as React.CSSProperties}
          >
            <ProductDetailCard
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          </div>
        ))}
      </div>

      {/* Slide Drawer for Featured Products */}
      <ProductSlideDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Trust bar for packaged products matching exact visual style */}
      <div
        className="mt-12 max-w-5xl mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center reveal-fade"
        style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
      >
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[#194D33]/10 text-[#194D33] flex items-center justify-center mb-2">
            <Leaf className="w-4 h-4" />
          </div>
          <p className="font-bold text-neutral-900 text-xs sm:text-sm">Aroma-Lock Pouch</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Seals freshness inside</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[#194D33]/10 text-[#194D33] flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="font-bold text-neutral-900 text-xs sm:text-sm">100% Pure Spices</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">No artificial chemicals</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[#7A1D36]/10 text-[#7A1D36] flex items-center justify-center mb-2">
            <Truck className="w-4 h-4" />
          </div>
          <p className="font-bold text-neutral-900 text-xs sm:text-sm">Fast Dispatch</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Prompt door delivery</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[#194D33]/10 text-[#194D33] flex items-center justify-center mb-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <p className="font-bold text-neutral-900 text-xs sm:text-sm">Instant WhatsApp Order</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Simple 1-click checkout</p>
        </div>
      </div>

      <div className="mt-8 text-center reveal-up" style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
        <BrandButton
          to="/products"
          variant="outline"
          size="md"
          icon={<PackageCheck className="w-4 h-4" />}
        >
          Explore All Tea Packs & Flavours
        </BrandButton>
      </div>
    </SectionContainer>
  );
};

export default FeaturedProducts;
