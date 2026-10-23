import React from 'react';
import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/ui/MenuItemCard';
import { MinimalLoader } from '@/components/ui/MinimalLoader';
import { Coffee, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MenuGridProps {
  items?: MenuItem[];
  isLoading?: boolean;
  onReset?: () => void;
  className?: string;
  showPrice?: boolean;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items = [],
  isLoading = false,
  onReset,
  className,
  showPrice = false,
}) => {
  if (isLoading) {
    return <MinimalLoader text="Preparing delicious teas..." />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs max-w-lg mx-auto reveal-fade is-visible">
        <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-grey/50 flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-8 h-8 text-brand-burgundy" />
        </div>
        <h3 className="font-serif text-xl font-bold text-brand-black mb-2">
          No beverages found
        </h3>
        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          We couldn't find any items matching your search or filter. Try a different keyword or reset to view all beverages.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-burgundy hover:bg-brand-rust text-white text-xs sm:text-sm font-semibold transition-all shadow-xs button-interaction cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 reveal-stagger',
        className
      )}
    >
      {items.map((item, index) => {
        const uniqueKey = item.id ? `${item.id}-${index}` : `menu-item-${index}`;
        return (
          <div
            key={uniqueKey}
            className="w-full min-w-0 reveal-up"
            style={{ '--reveal-delay': `${(index % 4) * 40}ms` } as React.CSSProperties}
          >
            <MenuItemCard item={item} showPrice={showPrice} />
          </div>
        );
      })}
    </div>
  );
};

export default MenuGrid;