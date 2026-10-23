import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Coffee, Package, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useProducts } from '@/hooks/useProducts';
import { FALLBACK_MENU_ITEMS } from '@/services/menuService';
import { FALLBACK_PRODUCTS } from '@/services/productService';
import { formatPrice } from '@/utils/formatPrice';
import { generateProductOrderLink } from '@/utils/whatsappLink';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useUiStore } from '@/stores/useUiStore';
import type { MenuItem, Product } from '@/types';
import { cn } from '@/utils/cn';
import { resolveImageUrl } from '@/utils/imageUrl';

interface LiveTeaSearchProps {
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  inputClassName?: string;
  value?: string;
  onChange?: (val: string) => void;
  onSelectBeverage?: (item: MenuItem) => void;
  onSelectProduct?: (product: Product) => void;
  autoFocus?: boolean;
  showShortcutHint?: boolean;
  onCloseMobile?: () => void;
  disableDropdown?: boolean;
}

export const LiveTeaSearch: React.FC<LiveTeaSearchProps> = ({
  placeholder = 'Search teas, blends, coffees...',
  className,
  dropdownClassName,
  inputClassName,
  value: controlledValue,
  onChange: setControlledValue,
  onSelectBeverage,
  onSelectProduct,
  autoFocus = false,
  showShortcutHint = true,
  onCloseMobile,
  disableDropdown = false,
}) => {
  const navigate = useNavigate();
  const { setActiveDrawerProduct } = useUiStore();

  const [internalQuery, setInternalQuery] = useState('');
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalQuery;

  const setQuery = (newVal: string) => {
    if (!isControlled) {
      setInternalQuery(newVal);
    }
    if (setControlledValue) {
      setControlledValue(newVal);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load menu items & products with fallbacks
  const { data: menuData } = useMenuItems();
  const { data: productData } = useProducts();

  const menuItems = useMemo(() => {
    return menuData && menuData.length > 0 ? menuData : FALLBACK_MENU_ITEMS;
  }, [menuData]);

  const products = useMemo(() => {
    return productData && productData.length > 0 ? productData : FALLBACK_PRODUCTS;
  }, [productData]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K or '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter items matching query
  const { beverageResults, productResults } = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return { beverageResults: [], productResults: [] };
    }

    const matchedBeverages = menuItems.filter((item) => {
      const name = item.name.toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.categoryName || '').toLowerCase();
      return name.includes(cleanQuery) || desc.includes(cleanQuery) || cat.includes(cleanQuery);
    });

    const matchedProducts = products.filter((prod) => {
      const name = prod.name.toLowerCase();
      const desc = (prod.description || '').toLowerCase();
      const shortDesc = (prod.shortDescription || '').toLowerCase();
      const cat = (prod.category || '').toLowerCase();
      const flavor = (prod.flavor || '').toLowerCase();
      const ingredients = Array.isArray(prod.ingredients)
        ? prod.ingredients.join(' ').toLowerCase()
        : typeof prod.ingredients === 'string'
        ? prod.ingredients.toLowerCase()
        : '';

      return (
        name.includes(cleanQuery) ||
        desc.includes(cleanQuery) ||
        shortDesc.includes(cleanQuery) ||
        cat.includes(cleanQuery) ||
        flavor.includes(cleanQuery) ||
        ingredients.includes(cleanQuery)
      );
    });

    return {
      beverageResults: matchedBeverages,
      productResults: matchedProducts,
    };
  }, [query, menuItems, products]);

  // Unified list for keyboard navigation
  const combinedResults = useMemo(() => {
    const list: Array<
      | { type: 'beverage'; item: MenuItem }
      | { type: 'product'; item: Product }
    > = [];

    beverageResults.forEach((item) => list.push({ type: 'beverage', item }));
    productResults.forEach((item) => list.push({ type: 'product', item }));

    return list;
  }, [beverageResults, productResults]);

  // Reset selected index when query or results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBeverageItem = (item: MenuItem) => {
    if (onSelectBeverage) {
      onSelectBeverage(item);
    } else {
      navigate(`/menu?search=${encodeURIComponent(item.name)}`);
    }
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectProductItem = (prod: Product) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      setActiveDrawerProduct(prod);
    }
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
  };

  const handleInstantWhatsAppOrder = (
    e: React.MouseEvent,
    name: string,
    price?: number,
    weight?: string
  ) => {
    e.stopPropagation();
    const link = generateProductOrderLink({
      name,
      price,
      weight,
      quantity: 1,
    });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) => (prev < combinedResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : combinedResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < combinedResults.length) {
        const selected = combinedResults[selectedIndex];
        if (selected.type === 'beverage') {
          handleSelectBeverageItem(selected.item);
        } else {
          handleSelectProductItem(selected.item);
        }
      } else if (query.trim()) {
        navigate(`/menu?search=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        if (onCloseMobile) onCloseMobile();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const hasMatches = beverageResults.length > 0 || productResults.length > 0;
  const isQueryEmpty = !query.trim();

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input Pill */}
      <div
        className={cn(
          'group relative flex items-center w-full transition-all duration-200',
          'rounded-full bg-neutral-100/90 hover:bg-neutral-100 border border-neutral-300/80 px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-brand-black placeholder-neutral-400 focus-within:ring-2 focus-within:ring-brand-green/30 focus-within:border-brand-green',
          inputClassName
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!disableDropdown && e.target.value.trim()) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (!disableDropdown && query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none text-xs sm:text-sm pr-2"
          aria-label="Search teas and products"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />

        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            showShortcutHint && (
              <span className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-neutral-400 bg-neutral-200/70 rounded border border-neutral-300/60 select-none">
                Ctrl+K
              </span>
            )
          )}

          <button
            type="button"
            onClick={() => {
              if (query.trim()) {
                navigate(`/menu?search=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
              } else if (!disableDropdown) {
                inputRef.current?.focus();
              }
            }}
            className="p-1 rounded-full text-neutral-500 hover:text-brand-burgundy transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-neutral-600 group-focus-within:text-brand-green transition-colors" />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {!disableDropdown && isOpen && !isQueryEmpty && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 z-50 w-[340px] sm:w-[380px] max-w-[95vw]',
            'rounded-2xl shadow-warm-xl border border-neutral-200 bg-white overflow-hidden',
            'max-h-[80vh] sm:max-h-[70vh] flex flex-col animate-fade-in',
            dropdownClassName
          )}
        >
          {/* Scrollable Results Container */}
          <div className="overflow-y-auto divide-y divide-neutral-100 flex-1 overscroll-contain">
            {/* Case: Has Results */}
            {hasMatches && (
              <>
                {/* Group 1: Signature Beverages */}
                {beverageResults.length > 0 && (
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between px-2 pb-2 mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                        <Coffee className="w-4 h-4 text-brand-burgundy" />
                        <span>Signature Beverages</span>
                        <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full text-brand-burgundy bg-brand-burgundy/10 font-bold">
                          {beverageResults.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/menu?search=${encodeURIComponent(query)}`);
                          setIsOpen(false);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="text-[11px] font-semibold text-brand-burgundy hover:underline flex items-center gap-1"
                      >
                        View Menu <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {beverageResults.map((beverage) => {
                        const globalIdx = combinedResults.findIndex(
                           (r) => r.type === 'beverage' && r.item.id === beverage.id
                        );
                        const isSelected = selectedIndex === globalIdx;

                        return (
                          <div
                            key={beverage.id}
                            onClick={() => handleSelectBeverageItem(beverage)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={cn(
                              'group/item flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all',
                              isSelected
                                ? 'bg-neutral-100 ring-1 ring-neutral-300'
                                : 'hover:bg-neutral-50'
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Cup Thumbnail */}
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-cream border border-neutral-200/60 overflow-hidden flex items-center justify-center shrink-0">
                                {beverage.imageUrl ? (
                                  <img
                                    src={resolveImageUrl(beverage.imageUrl, '/images/beverages/sharon-classic.png')}
                                    alt={beverage.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/images/beverages/sharon-classic.png';
                                    }}
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                                  />
                                ) : (
                                  <Coffee className="w-5 h-5 text-brand-chai" />
                                )}
                              </div>

                              {/* Details */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-brand-black group-hover/item:text-brand-burgundy truncate">
                                    {beverage.name}
                                  </h4>
                                  {beverage.isBestseller && (
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-amber/15 text-brand-rust border border-brand-amber/30">
                                      Bestseller
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-500 truncate max-w-xs sm:max-w-sm">
                                  {beverage.description || beverage.categoryName}
                                </p>
                              </div>
                            </div>

                            {/* Beverage indicator tag */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] sm:text-xs font-semibold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                                Fresh Brew
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Group 2: Packaged Tea Blends */}
                {productResults.length > 0 && (
                  <div className="p-3 sm:p-4 bg-neutral-50/50">
                    <div className="flex items-center justify-between px-2 pb-2 mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
                        <Package className="w-4 h-4 text-brand-green" />
                        <span>Packaged Tea Blends</span>
                        <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full text-brand-green bg-brand-green/10 font-bold">
                          {productResults.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/products');
                          setIsOpen(false);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="text-[11px] font-semibold text-brand-green hover:underline flex items-center gap-1"
                      >
                        All Pouches <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {productResults.map((product) => {
                        const globalIdx = combinedResults.findIndex(
                          (r) => r.type === 'product' && r.item.id === product.id
                        );
                        const isSelected = selectedIndex === globalIdx;

                        return (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProductItem(product)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={cn(
                              'group/item flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all',
                              isSelected
                                ? 'bg-white ring-1 ring-neutral-300 shadow-sm'
                                : 'hover:bg-white'
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Pouch Thumbnail */}
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-neutral-200/60 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={resolveImageUrl(product.imageUrl, '/images/products/img_3687.jpg')}
                                  alt={product.name}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/products/img_3687.jpg';
                                  }}
                                  className="max-h-full max-w-full object-contain group-hover/item:scale-110 transition-transform"
                                />
                              </div>

                              {/* Details */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs sm:text-sm font-bold text-brand-black group-hover/item:text-brand-green truncate">
                                    {product.name}
                                  </h4>
                                  {product.weight && (
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700">
                                      {product.weight}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-neutral-500 truncate max-w-xs sm:max-w-sm">
                                  {product.shortDescription || product.category}
                                </p>
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-brand-green">
                                {formatPrice(product.price)}
                              </span>

                              <button
                                type="button"
                                onClick={(e) =>
                                  handleInstantWhatsAppOrder(
                                    e,
                                    product.name,
                                    product.price,
                                    product.weight
                                  )
                                }
                                className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-all active:scale-95"
                                title="Order on WhatsApp"
                                aria-label={`Order ${product.name} on WhatsApp`}
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Case 3: Empty State (No Matches) */}
            {!isQueryEmpty && !hasMatches && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-brand-black mb-1">No teas found</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-4 leading-relaxed">
                  No teas found matching &ldquo;{query}&rdquo;. Try searching for our popular brews or packaged pouches.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/menu');
                      setIsOpen(false);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-burgundy text-white hover:bg-brand-rust transition-colors"
                  >
                    View All Beverages
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/products');
                      setIsOpen(false);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-green text-white hover:bg-brand-black transition-colors"
                  >
                    Explore Blends
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom helper bar */}
          <div className="px-4 py-2 bg-neutral-100/90 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 text-[10px] font-mono font-semibold">
                ESC
              </kbd>
              <span>to dismiss</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 text-[10px] font-mono font-semibold">
                ↑↓
              </kbd>
              <span>navigate</span>
              <span className="text-neutral-300">|</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 text-[10px] font-mono font-semibold flex items-center gap-0.5">
                <CornerDownLeft className="w-2.5 h-2.5" />
              </kbd>
              <span>select</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTeaSearch;
