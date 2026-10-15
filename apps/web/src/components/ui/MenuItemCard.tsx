import React from 'react';
import type { MenuItem } from '@/types';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { generateBeverageOrderLink } from '@/utils/whatsappLink';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  className,
  layout = 'vertical',
}) => {
  if (!item) return null;

  const itemName = typeof item.name === 'string' ? item.name : 'Sharon Tea';
  const isClassic =
    item.id === 'item-sharon-classic' ||
    itemName.toLowerCase().includes('sharon classic');
  const isBestseller = Boolean(item.isBestseller || isClassic || item.badge);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = generateBeverageOrderLink({
      name: itemName,
      price: item.price,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Horizontal layout variant (compact list/row view)
  if (layout === 'horizontal') {
    return (
      <div
        onClick={handleOrderClick}
        role="button"
        tabIndex={0}
        aria-label={`Order ${itemName} on WhatsApp for ₹${item.price}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOrderClick(e as unknown as React.MouseEvent);
          }
        }}
        className={cn(
          'bg-white rounded-2xl p-2.5 sm:p-3.5 border border-[#EDE6DC] shadow-sm hover:shadow-md transition-all flex flex-row items-center gap-2.5 sm:gap-3.5 relative overflow-hidden group text-left cursor-pointer select-none',
          className
        )}
      >
        {/* Left side: Square/rounded thumbnail */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-[#FDF8F2] flex items-center justify-center p-0.5">
          <img
            src={item.imageUrl || '/images/beverages/sharon-classic.png'}
            alt={itemName}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/beverages/sharon-classic.png';
            }}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right side: Content column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              {isBestseller ? (
                <span className="bg-[#FEF3C7] text-[#B45309] text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                  ★ BESTSELLER
                </span>
              ) : (
                <span />
              )}
              {item.isVegetarian !== false && (
                <span
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border border-emerald-600 flex items-center justify-center p-0.5 ml-auto shrink-0"
                  title="100% Vegetarian"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-600" />
                </span>
              )}
            </div>

            <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-neutral-900 group-hover:text-[#7A1D36] transition-colors leading-tight line-clamp-1">
              {itemName}
            </h3>

            {item.description && (
              <p className="text-[10px] sm:text-xs text-neutral-500 leading-snug line-clamp-2 mt-0.5 mb-1.5">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="font-bold text-xs sm:text-sm md:text-base text-neutral-900 font-sans">
              ₹{item.price}
            </span>
            <button
              type="button"
              onClick={handleOrderClick}
              aria-label={`Order ${itemName} on WhatsApp`}
              className={cn(
                'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer',
                isClassic
                  ? 'bg-[#521422] text-white hover:bg-[#3d0f19]'
                  : 'bg-[#FCE8E8] text-[#7A1D36] hover:bg-[#F9D5D5]'
              )}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Clean vertical card layout for 2-col mobile & 4-col desktop grids
  return (
    <div
      onClick={handleOrderClick}
      role="button"
      tabIndex={0}
      aria-label={`Order ${itemName} on WhatsApp for ₹${item.price}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOrderClick(e as unknown as React.MouseEvent);
        }
      }}
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#EDE6DC] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between relative overflow-hidden group text-left cursor-pointer select-none h-full',
        className
      )}
    >
      {/* Top: Square/rounded thumbnail with badge */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0] shrink-0 mb-2.5 sm:mb-3">
        <img
          src={item.imageUrl || '/images/beverages/sharon-classic.png'}
          alt={itemName}
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/beverages/sharon-classic.png';
          }}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />

        {/* Bestseller badge */}
        {isBestseller && (
          <span className="absolute top-2 left-2 z-10 bg-[#FEF3C7] text-[#B45309] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs border border-amber-300/40">
            ★ BESTSELLER
          </span>
        )}

        {/* Vegetarian indicator badge on top right */}
        {item.isVegetarian !== false && (
          <span
            className="absolute top-2 right-2 z-10 w-4 h-4 rounded-[3px] bg-white/95 border border-emerald-600 flex items-center justify-center p-0.5 shadow-xs"
            title="100% Vegetarian"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Title in bold font-serif */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#7A1D36] transition-colors leading-tight line-clamp-1 mb-1">
            {itemName}
          </h3>

          {/* Short description */}
          {item.description && (
            <p className="text-[11px] sm:text-xs text-neutral-500 leading-snug line-clamp-2 mb-2 min-h-[30px]">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom row: Bold price & Circular (+) button */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-neutral-100">
          <span className="font-bold text-sm sm:text-base text-neutral-900 font-sans">
            ₹{item.price}
          </span>
          <button
            type="button"
            onClick={handleOrderClick}
            aria-label={`Order ${itemName} on WhatsApp`}
            className={cn(
              'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer',
              isClassic
                ? 'bg-[#521422] text-white hover:bg-[#3d0f19]'
                : 'bg-[#FCE8E8] text-[#7A1D36] hover:bg-[#F9D5D5]'
            )}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
