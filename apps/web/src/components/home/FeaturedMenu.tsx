import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { MenuItemCard } from '@/components/ui/MenuItemCard';
import { BrandButton } from '@/components/ui/BrandButton';
import { useMenuItems } from '@/hooks/useMenuItems';
import { FALLBACK_MENU_ITEMS } from '@/services/menuService';
import { ArrowRight, Leaf } from 'lucide-react';

export const FeaturedMenu: React.FC = () => {
  const { data: items } = useMenuItems();

  // Guarantee displayItems is always a valid non-empty array
  const validFallback = Array.isArray(FALLBACK_MENU_ITEMS) && FALLBACK_MENU_ITEMS.length > 0
    ? FALLBACK_MENU_ITEMS
    : [];
  const rawItems = Array.isArray(items) && items.length > 0 ? items : validFallback;
  const displayItems = (rawItems.length > 0 ? rawItems : validFallback).slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FCFAF7] via-[#FAF6F0] to-[#F5EFE6] py-16 sm:py-20 md:py-24 border-y border-[#EDE6DC]/60">
      {/* Decorative corner tea leaves matching mockup */}
      <img
        src="/images/beverages/leaves/leaf-top-left.png"
        alt=""
        className="pointer-events-none select-none absolute -top-1 -left-1 w-28 sm:w-44 md:w-56 opacity-85 z-0"
      />
      <img
        src="/images/beverages/leaves/leaf-top-right.png"
        alt=""
        className="pointer-events-none select-none absolute -top-1 -right-1 w-32 sm:w-48 md:w-60 opacity-85 z-0"
      />
      <img
        src="/images/beverages/leaves/leaf-bottom-right.png"
        alt=""
        className="pointer-events-none select-none absolute -bottom-1 -right-1 w-28 sm:w-40 md:w-48 opacity-80 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12" data-aos="fade-up">
          {/* Popular Brews Pill */}
          <div className="inline-flex items-center justify-center mb-3">
            <span className="rounded-full border border-[#47663B]/30 text-[#47663B] bg-[#EDF3EA] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-xs">
              POPULAR BREWS
            </span>
          </div>

          {/* Title: Signature Beverage Menu */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-center tracking-tight text-[#1A1A1A]">
            <span className="text-[#1A1A1A]">Signature </span>
            <span className="italic text-[#93592B] font-normal font-serif">Beverage </span>
            <span className="text-[#1A1A1A]">Menu</span>
          </h2>

          {/* Leaf icon in center */}
          <Leaf className="w-5 h-5 text-[#47663B] rotate-45 mx-auto my-3" />

          {/* Subtitle */}
          <p className="text-[#6B6359] text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed px-4">
            Slow-boiled to golden perfection with rich creamy milk, freshly crushed spices, and distinct aromas.
          </p>
        </div>

        {/* Grid of 8 items: Mobile 2 columns strict, Desktop 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" data-aos="fade-up">
          {displayItems.map((item) => (
            <div key={item.id}>
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 sm:mt-14 text-center" data-aos="fade-up">
          <BrandButton
            to="/menu"
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View Full Menu & Pricing
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
