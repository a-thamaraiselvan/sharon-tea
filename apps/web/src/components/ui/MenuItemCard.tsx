import React from 'react';
import type { MenuItem } from '@/types';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';
import { generateBeverageOrderLink } from '@/utils/whatsappLink';
import { Plus } from 'lucide-react';

export interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  showPrice?: boolean;
  showOrderButton?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  className,
  layout = 'vertical',
  showPrice = false,
  showOrderButton = true,
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
      price: showPrice ? item.price : undefined,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Horizontal layout variant (compact list/row view)
  if (layout === 'horizontal') {
    return (
      <div
        onClick={showOrderButton ? handleOrderClick : undefined}
        role={showOrderButton ? 'button' : undefined}
        tabIndex={showOrderButton ? 0 : undefined}
        aria-label={showOrderButton ? `Enquire about ${itemName} on WhatsApp` : itemName}
        onKeyDown={
          showOrderButton
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOrderClick(e as unknown as React.MouseEvent);
                }
              }
            : undefined
        }
        className={cn(
          'bg-white rounded-2xl p-2.5 sm:p-3.5 border border-brand-grey/60 shadow-sm hover-lift flex flex-row items-center gap-2.5 sm:gap-3.5 relative overflow-hidden group text-left select-none',
          showOrderButton && 'cursor-pointer hover:border-brand-burgundy/30',
          className
        )}
      >
        {/* Left side: Square/rounded thumbnail */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-brand-cream flex items-center justify-center p-0.5 image-zoom-container">
          <img
            src={resolveImageUrl(item.imageUrl, '/images/beverages/sharon-classic.png')}
            alt={itemName}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/beverages/sharon-classic.png';
            }}
            className="w-full h-full object-cover rounded-lg image-zoom"
          />
        </div>

        {/* Right side: Content column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              {isBestseller ? (
                <span className="bg-brand-amber/15 text-brand-rust border border-brand-amber/40 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                  ★ BESTSELLER
                </span>
              ) : (
                <span />
              )}
              {item.isVegetarian !== false && (
                <span
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] border border-brand-leaf-green flex items-center justify-center p-0.5 ml-auto shrink-0"
                  title="100% Vegetarian"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-leaf-green" />
                </span>
              )}
            </div>

            <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-brand-black group-hover:text-brand-green transition-colors leading-tight line-clamp-1">
              {itemName}
            </h3>

            {item.description && (
              <p className="text-[10px] sm:text-xs text-neutral-500 leading-snug line-clamp-2 mt-0.5 mb-1.5">
                {item.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-1 border-t border-neutral-100/80">
            {showPrice ? (
              <>
                <span className="font-bold text-xs sm:text-sm md:text-base text-brand-chai font-sans">
                  ₹{item.price}
                </span>
                {showOrderButton ? (
                  <button
                    type="button"
                    onClick={handleOrderClick}
                    aria-label={`Enquire about ${itemName} on WhatsApp`}
                    title={`Enquire about ${itemName} on WhatsApp`}
                    className={cn(
                      'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer',
                      isClassic
                        ? 'bg-brand-burgundy text-white hover:bg-brand-rust'
                        : 'bg-brand-burgundy/10 text-brand-burgundy hover:bg-brand-burgundy/20'
                    )}
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  </button>
                ) : (
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium px-1.5 py-0.5 rounded bg-neutral-50">
                    Per Cup
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full border border-brand-green/20">
                  <span className="w-1 h-1 rounded-full bg-brand-leaf-green shrink-0" />
                  Fresh Brew
                </span>
                {showOrderButton && (
                  <button
                    type="button"
                    onClick={handleOrderClick}
                    aria-label={`Enquire about ${itemName} on WhatsApp`}
                    title={`Enquire about ${itemName} on WhatsApp`}
                    className={cn(
                      'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer group-hover:scale-105',
                      isClassic
                        ? 'bg-brand-burgundy text-white hover:bg-brand-rust'
                        : 'bg-brand-cream border border-brand-grey text-brand-burgundy hover:bg-brand-burgundy hover:text-white'
                    )}
                  >
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Clean vertical card layout for 2-col mobile & 4-col desktop grids
  return (
    <div
      onClick={showOrderButton ? handleOrderClick : undefined}
      role={showOrderButton ? 'button' : undefined}
      tabIndex={showOrderButton ? 0 : undefined}
      aria-label={showOrderButton ? `Enquire about ${itemName} on WhatsApp` : itemName}
      onKeyDown={
        showOrderButton
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOrderClick(e as unknown as React.MouseEvent);
              }
            }
          : undefined
      }
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-brand-grey/60 shadow-sm hover-lift flex flex-col justify-between relative overflow-hidden group text-left select-none h-full',
        showOrderButton && 'cursor-pointer hover:border-brand-burgundy/30',
        className
      )}
    >
      {/* Top: Square/rounded thumbnail with badge */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-brand-cream shrink-0 mb-2.5 sm:mb-3 image-zoom-container">
        <img
          src={resolveImageUrl(item.imageUrl, '/images/beverages/sharon-classic.png')}
          alt={itemName}
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/beverages/sharon-classic.png';
          }}
          className="w-full h-full object-cover rounded-xl image-zoom"
        />

        {/* Bestseller badge */}
        {isBestseller && (
          <span className="absolute top-2 left-2 z-10 bg-brand-amber/15 text-brand-rust border border-brand-amber/40 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
            ★ BESTSELLER
          </span>
        )}

        {/* Vegetarian indicator badge on top right */}
        {item.isVegetarian !== false && (
          <span
            className="absolute top-2 right-2 z-10 w-4 h-4 rounded-[3px] bg-white/95 border border-brand-leaf-green flex items-center justify-center p-0.5 shadow-xs"
            title="100% Vegetarian"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-leaf-green" />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Title in bold font-serif */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-brand-black group-hover:text-brand-green transition-colors leading-tight line-clamp-1 mb-1">
            {itemName}
          </h3>

          {/* Short description */}
          {item.description && (
            <p className="text-[11px] sm:text-xs text-neutral-500 leading-snug line-clamp-2 mb-2 min-h-[30px]">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom row: Price (if showPrice) OR Fresh Brew badge & WhatsApp enquiry (+) button */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-neutral-100/80">
          {showPrice ? (
            <>
              <span className="font-bold text-sm sm:text-base text-brand-chai font-sans tracking-tight">
                ₹{item.price}
              </span>
              {showOrderButton ? (
                <button
                  type="button"
                  onClick={handleOrderClick}
                  aria-label={`Enquire about ${itemName} on WhatsApp`}
                  title={`Enquire about ${itemName} on WhatsApp`}
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer',
                    isClassic
                      ? 'bg-brand-burgundy text-white hover:bg-brand-rust'
                      : 'bg-brand-burgundy/10 text-brand-burgundy hover:bg-brand-burgundy/20'
                  )}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              ) : (
                <span className="text-[10px] sm:text-xs font-medium text-neutral-400 bg-neutral-100/80 px-2 py-0.5 rounded-full">
                  Per Cup
                </span>
              )}
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 sm:px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-leaf-green shrink-0" />
                <span>Fresh Brew</span>
              </span>
              {showOrderButton && (
                <button
                  type="button"
                  onClick={handleOrderClick}
                  aria-label={`Enquire about ${itemName} on WhatsApp`}
                  title={`Enquire about ${itemName} on WhatsApp`}
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-transform active:scale-90 shadow-xs shrink-0 cursor-pointer group-hover:scale-105',
                    isClassic
                      ? 'bg-brand-burgundy text-white hover:bg-brand-rust'
                      : 'bg-brand-cream border border-brand-grey text-brand-burgundy hover:bg-brand-burgundy hover:text-white'
                  )}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;