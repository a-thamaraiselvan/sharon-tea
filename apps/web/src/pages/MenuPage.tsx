import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { MenuCategoryNav } from '@/components/menu/MenuCategoryNav';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { BrandButton } from '@/components/ui/BrandButton';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useMenuCategories } from '@/hooks/useMenuCategories';
import { FALLBACK_MENU_CATEGORIES, FALLBACK_MENU_ITEMS } from '@/services/menuService';
import { LiveTeaSearch } from '@/components/search/LiveTeaSearch';
import type { MenuItem } from '@/types';
import { MapPin, ExternalLink, Bike } from 'lucide-react';
import { useDeliveryPartners } from '@/hooks/useDeliveryPartners';
import { FALLBACK_DELIVERY_PARTNERS } from '@/services/deliveryPartnerService';
import { resolveImageUrl } from '@/utils/imageUrl';

const SIGNATURE_TEA_NAMES = [
  'sharon classic',
  'masala tea',
  'ginger tea',
  'elaichi tea',
  'pepper tea',
  'cinnamon tea',
  'tulsi tea',
  'jaggery tea',
];

const getItemSortWeight = (item: MenuItem): number => {
  const name = item.name.toLowerCase();

  // 1. Signature Spiced Teas (Sharon Classic, Masala, Ginger, Elaichi, Pepper, Cinnamon, Tulsi, Jaggery)
  for (let i = 0; i < SIGNATURE_TEA_NAMES.length; i++) {
    if (name.includes(SIGNATURE_TEA_NAMES[i])) {
      return 10 + i;
    }
  }

  // Other hot teas
  if (item.categoryId === 'hot-teas' || (item.category === 'Tea' && !name.includes('green') && !name.includes('herbal'))) {
    return 50;
  }

  // 2. Filter Coffees (South Indian Filter Coffee, Sukku Coffee, etc.)
  if (
    item.categoryId === 'coffees' ||
    (item.category === 'Coffee' && !name.includes('cold')) ||
    (name.includes('coffee') && !name.includes('cold'))
  ) {
    return 100;
  }

  // 3. Herbal & Green Teas
  if (
    item.categoryId === 'herbal-special' ||
    item.category === 'Herbal Tea' ||
    name.includes('green') ||
    name.includes('herbal')
  ) {
    return 200;
  }

  // 4. Cold Beverages & Milk Coolers (Rose Milk, Badam Milk, etc.)
  if (
    item.categoryId === 'cold-beverages' ||
    item.category === 'Cold Beverage' ||
    name.includes('cold') ||
    name.includes('rose milk') ||
    name.includes('badam') ||
    name.includes('shake') ||
    name.includes('ice tea') ||
    name.includes('cooler')
  ) {
    return 300;
  }

  return 400;
};

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamCategory = searchParams.get('category');
  const searchParamQuery = searchParams.get('search');

  const [activeCategory, setActiveCategory] = useState<string>(searchParamCategory || 'all');
  const [searchFilter, setSearchFilter] = useState<string>(searchParamQuery || '');

  const { data: categories = FALLBACK_MENU_CATEGORIES } = useMenuCategories();
  const { data: items, isLoading } = useMenuItems();
  const { data: partnersData } = useDeliveryPartners();
  const deliveryPartners = partnersData && partnersData.length > 0 ? partnersData : FALLBACK_DELIVERY_PARTNERS;

  const menuCategories = useMemo(() => {
    const list = categories && categories.length > 0 ? categories : FALLBACK_MENU_CATEGORIES;
    const hasAll = list.some((c) => c.id === 'all');
    if (hasAll) return list;
    return [{ id: 'all', name: 'All Beverages', slug: 'all', displayOrder: 0, isActive: true }, ...list];
  }, [categories]);

  // Sync state if url param changes
  useEffect(() => {
    setActiveCategory(searchParamCategory || 'all');
  }, [searchParamCategory]);

  useEffect(() => {
    if (searchParamQuery !== null) {
      setSearchFilter(searchParamQuery);
    }
  }, [searchParamQuery]);

  const scrollToMenuGrid = () => {
    const el = document.getElementById('menu-category-tabs') || document.getElementById('menu-items-grid');
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  const handleCategorySelect = (catId: string) => {
    setActiveCategory(catId);
    setSearchFilter('');
    setSearchParams(catId === 'all' ? {} : { category: catId });
    setTimeout(() => {
      scrollToMenuGrid();
    }, 50);
  };

  const rawItems: MenuItem[] = items && items.length > 0 ? items : FALLBACK_MENU_ITEMS;

  // Pre-sort all items in the clean organized order:
  // 1. Signature Spiced Teas (Sharon Classic, Masala, Ginger, Elaichi, Pepper, Cinnamon, Tulsi, Jaggery)
  // 2. Filter Coffees (South Indian Filter Coffee, Sukku Coffee, etc.)
  // 3. Herbal & Green Teas
  // 4. Cold Beverages & Milk Coolers (Rose Milk, Badam Milk, etc.)
  const sortedAllItems = useMemo(() => {
    return [...rawItems].sort((a, b) => {
      const weightA = getItemSortWeight(a);
      const weightB = getItemSortWeight(b);
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [rawItems]);

  // Compute filteredItems:
  // - When searching with LiveTeaSearch, filter live across all items.
  // - When a category filter is selected, filter strictly to items in that category.
  // - When "All" is active, display all menu items in clean organized order.
  const filteredItems = useMemo(() => {
    if (searchFilter.trim()) {
      const query = searchFilter.toLowerCase().trim();
      return sortedAllItems.filter((item: MenuItem) => {
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.categoryName && item.categoryName.toLowerCase().includes(query))
        );
      });
    }

    if (activeCategory === 'all') {
      return sortedAllItems;
    }

    return sortedAllItems.filter((i: MenuItem) => {
      // Direct ID, slug, or name match (covers dynamic API categories seamlessly)
      if (
        i.categoryId === activeCategory ||
        i.category === activeCategory ||
        i.categoryName === activeCategory ||
        (i.category && i.category.toLowerCase() === activeCategory.toLowerCase()) ||
        (i.categoryName && i.categoryName.toLowerCase() === activeCategory.toLowerCase())
      ) {
        return true;
      }

      const name = i.name.toLowerCase();
      if (activeCategory === 'hot-teas') {
        return (
          i.categoryId === 'hot-teas' ||
          i.category === 'Tea' ||
          name.includes('tea') ||
          name.includes('chai')
        );
      }
      if (activeCategory === 'coffees') {
        return (
          i.categoryId === 'coffees' ||
          i.category === 'Coffee' ||
          (name.includes('coffee') && !name.includes('cold'))
        );
      }
      if (activeCategory === 'herbal-special') {
        return (
          i.categoryId === 'herbal-special' ||
          i.category === 'Herbal Tea' ||
          i.id === 'item-tulsi-tea' ||
          name.includes('tulsi') ||
          name.includes('green') ||
          name.includes('herbal')
        );
      }
      if (activeCategory === 'cold-beverages') {
        return (
          i.categoryId === 'cold-beverages' ||
          i.category === 'Cold Beverage' ||
          name.includes('cold') ||
          name.includes('rose milk') ||
          name.includes('badam') ||
          name.includes('shake') ||
          name.includes('milk') ||
          name.includes('cooler') ||
          name.includes('ice tea')
        );
      }
      return false;
    });
  }, [sortedAllItems, activeCategory, searchFilter]);

  const activeCategoryName = menuCategories.find((c) => c.id === activeCategory)?.name || 'Beverages';

  return (
    <>
      <Helmet>
        <title>Beverage Menu | Sharon Tea and Coffee</title>
        <meta
          name="description"
          content="Explore Sharon Tea and Coffee's freshly brewed teas, aromatic masala chai, traditional South Indian filter coffee, and chilled beverages slow-boiled to golden perfection."
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-neutral-50/50 to-white pt-12 sm:pt-16 pb-10 sm:pb-14 border-b border-neutral-200/60">
        {/* Floating corner tea leaves */}
        <img
          src="/images/beverages/leaves/leaf-top-left.png"
          alt=""
          className="pointer-events-none select-none absolute -top-1 -left-1 w-24 sm:w-44 md:w-56 opacity-75 z-0"
        />
        <img
          src="/images/beverages/leaves/leaf-top-right.png"
          alt=""
          className="pointer-events-none select-none absolute -top-1 -right-1 w-28 sm:w-48 md:w-60 opacity-75 z-0"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-down">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-black tracking-tight">
            Our <span className="italic text-brand-chai">Beverage</span> Menu
          </h1>
          <p className="mt-3.5 text-neutral-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            Freshly brewed slow-boiled spiced teas, South Indian filter coffee, herbal wellness infusions, and iced coolers made daily with pure cow milk.
          </p>
        </div>
      </section>

      {/* Search, Filters & Unified Menu Grid */}
      <SectionContainer background="cream" className="py-10 md:py-14">
        {/* Search & Filters Bar */}
        <div className="space-y-6 mb-8 sm:mb-10">
          {/* LiveTeaSearch prominently in the center */}
          <div className="max-w-xl mx-auto reveal-fade">
            <LiveTeaSearch
              value={searchFilter}
              disableDropdown={true}
              onChange={(val) => {
                setSearchFilter(val);
                if (!val) {
                  setSearchParams(activeCategory === 'all' ? {} : { category: activeCategory });
                } else {
                  setSearchParams(
                    activeCategory === 'all'
                      ? { search: val }
                      : { category: activeCategory, search: val }
                  );
                }
              }}
              placeholder="Search beverages, spices, filter coffee..."
            />
          </div>

          {/* MenuCategoryNav below search */}
          <div id="menu-category-tabs" className="scroll-mt-24 sm:scroll-mt-28 reveal-fade" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
            <MenuCategoryNav
              categories={menuCategories}
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        </div>

        {/* Section Header with Item Count Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-neutral-200/80">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-black">
              {searchFilter.trim()
                ? `Search: "${searchFilter}"`
                : activeCategory === 'all'
                ? 'All Beverages'
                : activeCategoryName}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-brand-black border border-neutral-200 shadow-xs">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'beverage' : 'beverages'}
            </span>
          </div>

          {(activeCategory !== 'all' || Boolean(searchFilter.trim())) && (
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="text-xs font-semibold text-brand-burgundy hover:text-brand-rust underline underline-offset-2 cursor-pointer transition-colors"
            >
              Reset to All Beverages
            </button>
          )}
        </div>

        {/* Single Unified Menu Items Grid */}
        <div id="menu-items-grid" className="scroll-mt-24 sm:scroll-mt-28">
          <MenuGrid
            items={filteredItems}
            isLoading={isLoading}
            onReset={() => handleCategorySelect('all')}
          />
        </div>

        {/* Visit Us & Order Online Bottom CTA */}
        <div
          className="mt-16 sm:mt-20 bg-brand-burgundy rounded-3xl p-8 sm:p-12 text-white text-center shadow-warm-lg border border-brand-burgundy/30 reveal-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-amber text-xs font-semibold uppercase tracking-wider mb-3">
            <Bike className="w-3.5 h-3.5 text-brand-leaf-green" />
            <span>Dine In or Order Online</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Craving a Hot Cutting Chai Right Now?
          </h3>
          <p className="text-brand-cream/80 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal">
            Walk into our nearest Sharon Tea and Coffee outlet to experience the brass samovar in person, or order piping hot brews to your doorstep through our online delivery partners!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BrandButton
              to="/visit-us"
              variant="amber"
              size="lg"
              icon={<MapPin className="w-4 h-4 text-brand-black" />}
              className="text-brand-black font-bold"
            >
              Find Your Nearest Sharon Stall
            </BrandButton>

            {deliveryPartners.map((partner) => {
              const logo = partner.logoUrl || partner.logo_url;
              const link = partner.partnerUrl || partner.partner_url || 'https://www.swiggy.com';
              return (
                <a
                  key={partner.id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-sm px-5 py-3 rounded-full shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    {logo ? (
                      <img src={resolveImageUrl(logo)} alt={partner.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold">{partner.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <span>Order on {partner.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              );
            })}
          </div>
        </div>
      </SectionContainer>
    </>
  );
};

export default MenuPage;
