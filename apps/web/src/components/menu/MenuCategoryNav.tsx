import React from 'react';
import type { MenuCategory } from '@/types';
import { cn } from '@/utils/cn';

interface MenuCategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const MenuCategoryNav: React.FC<MenuCategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  className,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto no-scrollbar py-2', className)}>
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 min-w-max px-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                'px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border whitespace-nowrap shadow-sm',
                isActive
                  ? 'bg-brand-burgundy text-white border-brand-burgundy shadow-warm'
                  : 'bg-white text-brand-black border-neutral-200 hover:border-brand-green hover:text-brand-green'
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategoryNav;
