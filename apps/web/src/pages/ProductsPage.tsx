import React, { useState, useMemo, useDeferredValue } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProductGrid } from '@/components/products/ProductGrid';
import { LiveTeaSearch } from '@/components/search/LiveTeaSearch';
import { useProducts } from '@/hooks/useProducts';
import { FALLBACK_PRODUCTS } from '@/services/productService';
import { useUiStore } from '@/stores/useUiStore';
import type { Product } from '@/types';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  Leaf,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { cn } from '@/utils/cn';

const FLAVOR_BUBBLES = [
  { name: 'Masala Tea', image: '/images/flavors/masala.png', query: 'masala' },
  { name: 'Ginger Tea', image: '/images/flavors/ginger.png', query: 'ginger' },
  { name: 'Elaichi Tea', image: '/images/flavors/elachi.png', query: 'elachi' },
  { name: 'Mint Tea', image: '/images/flavors/mint.png', query: 'mint' },
  { name: 'Cinnamon Tea', image: '/images/flavors/cinnamon.png', query: 'cinnamon' },
  { name: 'Chocolate Tea', image: '/images/flavors/chocolate.png', query: 'chocolate' },
];

export const ProductsPage: React.FC = () => {
  const { data: rawProducts, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const deferredSearchFilter = useDeferredValue(searchFilter);
  const { setActiveDrawerProduct } = useUiStore();

  // Strict rule: If API returns products, show ONLY API products.
  // When API call list comes empty, show the default from use.
  const allProducts = Array.isArray(rawProducts) && rawProducts.length > 0 ? rawProducts : FALLBACK_PRODUCTS;

  // Dynamically derive category pills from active products list
  const categories = useMemo(() => {
    const list = Array.from(
      new Set(allProducts.map((p) => p.category).filter(Boolean))
    ) as string[];
    return ['All', ...list];
  }, [allProducts]);

  // Filter products based on Search, Category and Flavor selection (using deferredSearchFilter for 60fps responsiveness)
  const filteredProducts = useMemo(() => {
    const cleanSearch = deferredSearchFilter.trim().toLowerCase();
    return allProducts.filter((p: Product) => {
      // Live search filter
      const matchesSearch =
        !cleanSearch ||
        p.name.toLowerCase().includes(cleanSearch) ||
        (p.description && p.description.toLowerCase().includes(cleanSearch)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(cleanSearch)) ||
        (p.flavor && p.flavor.toLowerCase().includes(cleanSearch)) ||
        (p.category && p.category.toLowerCase().includes(cleanSearch));

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // Flavor filter - extract base keyword (e.g. "Masala", "Ginger", "Elaichi")
      const matchesFlavor = (() => {
        if (!selectedFlavor) return true;
        const flavorKeyword = selectedFlavor.replace(/\s*tea/i, '').trim().toLowerCase();
        return (
          (p.flavor && p.flavor.toLowerCase().includes(flavorKeyword)) ||
          p.name.toLowerCase().includes(flavorKeyword) ||
          (p.category && p.category.toLowerCase().includes(flavorKeyword))
        );
      })();

      return matchesSearch && matchesCategory && matchesFlavor;
    });
  }, [allProducts, selectedCategory, selectedFlavor, deferredSearchFilter]);

  const scrollToProducts = (targetId?: unknown) => {
    const id = typeof targetId === 'string' ? targetId : 'products-grid-container';
    const el = document.getElementById(id) || document.getElementById('products-section');
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  };

  const handleFlavorClick = (flavorName: string) => {
    if (selectedFlavor === flavorName) {
      setSelectedFlavor(null);
    } else {
      setSelectedFlavor(flavorName);
      setSelectedCategory('All'); // Clear category so the flavor is never filtered out
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedFlavor(null); // Clear flavor so the entire category collection displays
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFlavor(null);
    setSearchFilter('');
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Packaged Tea Blends | Sharon Products</title>
        <meta
          name="description"
          content="Explore Sharon's premium tea blends: Chocolate Tea, Cinnamon Tea, Elaichi Tea, Ginger Elaichi Tea, Masala Tea, and Green Tea. Fast delivery and instant WhatsApp checkout."
        />
      </Helmet>

      {/* Top Banner Bar */}
      <div className="bg-brand-green text-white text-[11px] sm:text-xs py-2 px-4 border-b border-brand-green/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-medium">
            <Leaf className="w-3.5 h-3.5 text-brand-amber" />
            <span>Premium Tea Blends for a Healthier, Happier You</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white/90">
            <span>100% Natural</span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              A Healthier Tomorrow
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section with Responsive 2-Column Product Banner */}
      <section className="bg-brand-green text-white py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle background ambient lighting */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-brand-leaf-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-7 reveal-down">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-brand-amber mb-2 sm:mb-3">
                NATURAL • AROMATIC • REFRESHING
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                Discover the <br />
                <span className="italic font-normal text-brand-amber">Taste of Sharon</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 mt-3 sm:mt-4 max-w-xl leading-relaxed">
                Premium tea blends crafted for your everyday wellness. Pure taste. Natural goodness. Freshly packed in aroma-locking seal pouches.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-burgundy hover:bg-brand-rust text-white text-xs sm:text-sm font-semibold transition-all shadow-md button-interaction cursor-pointer"
                >
                  <span>Shop Tea Blends</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/919940866657?text=Hi%20Sharon%20Tea%2C%20I%20would%20like%20to%20order%20packaged%20tea%20blends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all backdrop-blur-xs cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#119243] fill-[#119243]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Value badges below CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs text-neutral-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  <Leaf className="w-3.5 h-3.5 text-brand-leaf-green" />
                  100% Natural
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  Rich in Antioxidants
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                  Better Living
                </span>
              </div>
            </div>

            {/* Right Column: Dynamic Banner Visual Showcase */}
            <div className="lg:col-span-5 xl:col-span-5 reveal-fade" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
              <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-black/40 via-brand-green/60 to-black/60 shadow-warm-xl p-2 sm:p-2.5 group">
                <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-brand-green/80 image-zoom-container">
                  <img
                    src="/images/products/products-hero-banner.jpg"
                    alt="Sharon Premium Packaged Tea Blends & Whole Spices"
                    loading="eager"
                    className="w-full h-full object-cover image-zoom group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/products-hero-banner.png';
                    }}
                  />

                  {/* Top-left floating badge */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-brand-amber border border-white/20 shadow-md">
                      <Sparkles className="w-3 h-3 text-brand-amber" />
                      <span>3 Signature Blends</span>
                    </span>
                  </div>

                  {/* Bottom-right floating badge */}
                  <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 bg-brand-burgundy/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border border-white/20 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-leaf-green" />
                      <span>Aroma-Lock Foil Pouches</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Flavor Bubbles Row */}
      <section className="bg-white py-8 sm:py-12 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Explore By Flavor
            </h2>
            {selectedFlavor && (
              <button
                type="button"
                onClick={() => setSelectedFlavor(null)}
                className="text-xs font-semibold text-brand-burgundy hover:text-brand-rust hover:underline"
              >
                Clear filter ({selectedFlavor})
              </button>
            )}
          </div>

          <div
            className="flex items-center justify-start md:justify-center gap-5 sm:gap-8 lg:gap-12 overflow-x-auto pb-2 scrollbar-none no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden reveal-fade"
          >
            {FLAVOR_BUBBLES.map((flavor) => {
              const isSelected = selectedFlavor === flavor.name;
              return (
                <button
                  key={flavor.name}
                  type="button"
                  onClick={() => handleFlavorClick(flavor.name)}
                  className="flex flex-col items-center gap-2 group shrink-0 transition-transform active:scale-95"
                >
                  <div
                    className={cn(
                      'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden p-1 transition-all duration-200 bg-neutral-100',
                      isSelected
                        ? 'ring-3 ring-brand-green shadow-md scale-105'
                        : 'border border-neutral-200 group-hover:border-brand-green/50 group-hover:shadow-sm'
                    )}
                  >
                    <img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-semibold transition-colors',
                      isSelected
                        ? 'text-brand-green font-bold'
                        : 'text-neutral-700 group-hover:text-brand-green'
                    )}
                  >
                    {flavor.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Products Collection Section */}
      <section id="products-section" className="scroll-mt-24 sm:scroll-mt-28 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading matching screenshot */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-neutral-500 mb-2">
              OUR COLLECTION
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black">
              Our Products
            </h2>
            <div className="flex items-center justify-center my-3">
              <Leaf className="w-5 h-5 text-brand-leaf-green" />
            </div>
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto">
              Explore our wide range of premium tea blends • Order directly on WhatsApp for instant doorstep delivery
            </p>

            {/* Live Tea Search Pill */}
            <div className="max-w-xl mx-auto mt-6 reveal-fade">
              <LiveTeaSearch
                value={searchFilter}
                disableDropdown={true}
                onChange={(val) => setSearchFilter(val)}
                placeholder="Search packaged tea blends, flavors, pouches..."
              />
            </div>

            {/* Category Pills */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 reveal-fade"
              style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat && !selectedFlavor;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      'px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs button-interaction',
                      isActive
                        ? 'bg-brand-green text-white shadow-sm'
                        : 'bg-white text-brand-black border border-neutral-200 hover:border-brand-green'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid (Mobile: 2-col, Desktop: 4-col) */}
          <div id="products-grid-container" className="scroll-mt-24 sm:scroll-mt-28">
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading && !rawProducts}
              onSelectProduct={(product) => setActiveDrawerProduct(product)}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      </section>

      {/* Bottom 4 Feature Trust Badges matching screenshot */}
      <section className="bg-white py-12 border-t border-neutral-200/80 reveal-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-black">Fresh Ingredients</h3>
                <p className="text-xs text-neutral-500 mt-1">Naturally sourced & carefully blended</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-black">Secure Payment</h3>
                <p className="text-xs text-neutral-500 mt-1">100% safe & encrypted payments</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-black">Fast Delivery</h3>
                <p className="text-xs text-neutral-500 mt-1">Quick & reliable doorstep shipping</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-black">A Healthier You</h3>
                <p className="text-xs text-neutral-500 mt-1">Wellness and purity in every cup</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
