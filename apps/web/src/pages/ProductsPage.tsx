import React, { useState, useMemo } from 'react';
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
import { cn } from '@/utils/cn';

const FLAVOR_BUBBLES = [
  { name: 'Masala Tea', image: '/images/flavors/masala.png', query: 'masala' },
  { name: 'Ginger Tea', image: '/images/flavors/ginger.png', query: 'ginger' },
  { name: 'Elaichi Tea', image: '/images/flavors/elachi.png', query: 'elachi' },
  { name: 'Mint Tea', image: '/images/flavors/mint.png', query: 'mint' },
  { name: 'Cinnamon Tea', image: '/images/flavors/cinnamon.png', query: 'cinnamon' },
  { name: 'Chocolate Tea', image: '/images/flavors/chocolate.png', query: 'chocolate' },
];

const CATEGORIES = ['All', 'Black Tea', 'Herbal Tea', 'Green Tea', 'Masala Tea'] as const;

export const ProductsPage: React.FC = () => {
  const { data: rawProducts, isLoading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const { activeDrawerProduct, setActiveDrawerProduct } = useUiStore();

  const allProducts = rawProducts && rawProducts.length > 0 ? rawProducts : FALLBACK_PRODUCTS;

  // Filter products based on Search, Category and Flavor selection
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p: Product) => {
      // Live search filter
      const matchesSearch =
        !searchFilter.trim() ||
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (p.flavor && p.flavor.toLowerCase().includes(searchFilter.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchFilter.toLowerCase()));

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
  }, [allProducts, selectedCategory, selectedFlavor, searchFilter]);

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
      setTimeout(() => {
        scrollToProducts();
      }, 50);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedFlavor(null); // Clear flavor so the entire category collection displays
    setTimeout(() => {
      scrollToProducts();
    }, 50);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFlavor(null);
    setSearchFilter('');
    setTimeout(() => {
      scrollToProducts();
    }, 50);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <Helmet>
        <title>Packaged Tea Blends | Sharon Products</title>
        <meta
          name="description"
          content="Explore Sharon's premium tea blends: Chocolate Tea, Cinnamon Tea, Elaichi Tea, Ginger Elaichi Tea, Masala Tea, and Green Tea. Fast delivery and instant WhatsApp checkout."
        />
      </Helmet>

      {/* Top Banner Bar matching reference screenshot */}
      <div className="bg-[#194D33] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#235d40]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-1.5 font-medium">
            <Leaf className="w-3.5 h-3.5 text-[#F3E5D8]" />
            <span>Premium Tea Blends for a Healthier, Happier You</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-white/90">
            <span className="font-semibold text-amber-300">Free Shipping on Orders Above Rs.500</span>
            <span className="text-white/40">|</span>
            <span>100% Natural</span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              A Healthier Tomorrow
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section matching screenshot */}
      <section className="bg-[#133E29] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1b4d35]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#C49A45] mb-2 sm:mb-3">
              NATURAL • AROMATIC • REFRESHING
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Discover the <br />
              <span className="italic font-normal text-[#E8C574]">Taste of Sharon</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 mt-4 max-w-xl leading-relaxed">
              Premium tea blends crafted for your everyday wellness. Pure taste. Natural goodness. Freshly packed in aroma-locking seal pouches.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7A1D36] hover:bg-[#54121F] text-white text-sm font-semibold transition-all shadow-md active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Value badges below CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-neutral-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                100% Natural
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                Rich in Antioxidants
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Better Living
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Circular Flavor Bubbles Row */}
      <section className="bg-[#FAF8F5] py-8 sm:py-12 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Explore By Flavor
            </h2>
            {selectedFlavor && (
              <button
                type="button"
                onClick={() => setSelectedFlavor(null)}
                className="text-xs font-semibold text-[#7A1D36] hover:underline"
              >
                Clear filter ({selectedFlavor})
              </button>
            )}
          </div>

          <div
            className="flex items-center justify-start md:justify-center gap-5 sm:gap-8 lg:gap-12 overflow-x-auto pb-2 scrollbar-none"
            data-aos="fade-up"
            data-aos-delay="40"
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
                      'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden p-1 transition-all duration-200 bg-[#F3EFEA]',
                      isSelected
                        ? 'ring-3 ring-[#7A1D36] shadow-md scale-105'
                        : 'border border-neutral-200 group-hover:border-[#7A1D36]/50 group-hover:shadow-sm'
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
                        ? 'text-[#7A1D36] font-bold'
                        : 'text-neutral-700 group-hover:text-neutral-900'
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
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Our Products
            </h2>
            <div className="flex items-center justify-center my-3">
              <Leaf className="w-5 h-5 text-[#194D33]" />
            </div>
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto">
              Explore our wide range of premium tea blends • Order directly on WhatsApp for instant doorstep delivery
            </p>

            {/* Live Tea Search Pill */}
            <div className="max-w-xl mx-auto mt-6" data-aos="fade-up" data-aos-delay="30">
              <LiveTeaSearch
                value={searchFilter}
                onChange={(val) => setSearchFilter(val)}
                onSelectProduct={(p) => setActiveDrawerProduct(p)}
                placeholder="Search packaged tea blends, flavors, pouches..."
              />
            </div>

            {/* Category Pills */}
            <div
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8"
              data-aos="fade-up"
              data-aos-delay="40"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat && !selectedFlavor;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={cn(
                      'px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs',
                      isActive
                        ? 'bg-[#7A1D36] text-white shadow-sm'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#7A1D36] hover:text-[#7A1D36]'
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
      <section className="bg-white py-12 border-t border-neutral-200/80" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#194D33] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Fresh Ingredients</h3>
                <p className="text-xs text-neutral-500 mt-1">Naturally sourced & carefully blended</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#194D33] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Secure Payment</h3>
                <p className="text-xs text-neutral-500 mt-1">100% safe & encrypted payments</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#194D33] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Fast Delivery</h3>
                <p className="text-xs text-neutral-500 mt-1">Quick & reliable doorstep shipping</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#194D33] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900">A Healthier You</h3>
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
