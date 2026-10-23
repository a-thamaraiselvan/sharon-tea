import React from 'react';
import { MenuItemCard } from '@/components/ui/MenuItemCard';
import { BrandButton } from '@/components/ui/BrandButton';
import { useMenuItems } from '@/hooks/useMenuItems';
import { FALLBACK_MENU_ITEMS } from '@/services/menuService';
import { ArrowRight, Leaf } from 'lucide-react';

export const FeaturedMenu: React.FC = () => {
  const { data: items } = useMenuItems();

  // Strict rule: If API returns items, show ONLY API items.
  // When API call list comes empty, show the default from use.
  const displayItems = (Array.isArray(items) && items.length > 0 ? items : FALLBACK_MENU_ITEMS).slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-neutral-50/50 to-white py-16 sm:py-20 md:py-24 border-y border-neutral-200/60">
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
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 reveal-up">
          {/* Popular Brews Pill */}
          <div className="inline-flex items-center justify-center mb-3">
            <span className="rounded-full border border-brand-leaf-green/30 text-brand-green bg-brand-green/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-xs">
              POPULAR BREWS
            </span>
          </div>

          {/* Title: Signature Beverage Menu */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-center tracking-tight text-brand-black">
            <span className="text-brand-black">Signature </span>
            <span className="italic text-brand-chai font-normal font-serif">Beverage </span>
            <span className="text-brand-black">Menu</span>
          </h2>

          {/* Leaf icon in center */}
          <Leaf className="w-5 h-5 text-brand-leaf-green rotate-45 mx-auto my-3" />

          {/* Subtitle */}
          <p className="text-neutral-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed px-4">
            Slow-boiled to golden perfection with rich creamy milk, freshly crushed spices, and distinct aromas.
          </p>
        </div>

        {/* Grid of 8 items: Mobile 2 columns strict, Desktop 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 reveal-stagger">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className="reveal-up"
              style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as React.CSSProperties}
            >
              <MenuItemCard item={item} showPrice={false} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 sm:mt-14 text-center reveal-up" style={{ '--reveal-delay': '150ms' } as React.CSSProperties}>
          <BrandButton
            to="/menu"
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View Full Beverage Menu
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMenu;
