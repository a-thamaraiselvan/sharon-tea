import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SharonLogo } from '@/components/ui/SharonLogo';
import { BrandButton } from '@/components/ui/BrandButton';
import { useUiStore } from '@/stores/useUiStore';
import { Search, Menu, Phone, Sparkles, X } from 'lucide-react';
import { LiveTeaSearch } from '@/components/search/LiveTeaSearch';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Menu', path: '/menu' },
  { label: 'Products', path: '/products' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Visit Us', path: '/visit-us' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { toggleMobileMenu } = useUiStore();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* 1. Top Announcement Bar - Always visible, fully sticky */}
      <div className="bg-brand-green text-white text-xs px-4 py-2 border-b border-brand-leaf-green/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1 font-semibold text-brand-amber">
              <Sparkles className="w-3.5 h-3.5" />
              Over 8,000+ Cups Served Daily
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-brand-cream/90">
              Assam Garden Fresh Leaf & Royal Spices
            </span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 hover:text-brand-amber transition-colors text-white/90"
            >
              <Phone className="w-3 h-3 text-brand-amber" />
              <span className="hidden md:inline">+91 98765 43210</span>
            </a>
            <Link
              to="/franchise"
              className="text-[11px] uppercase tracking-wider bg-brand-burgundy hover:bg-brand-rust px-2.5 py-0.5 rounded font-medium text-white transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navigation */}
      <nav
        className={cn(
          'w-full py-2.5 sm:py-3 transition-[background-color,border-color,box-shadow] duration-200',
          isScrolled
            ? 'bg-white shadow-md border-b border-neutral-200/80'
            : 'bg-[#FAF7F2] border-b border-amber-950/10'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Left: Sharon Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Sharon Tea Stall Home">
            <SharonLogo size="md" />
          </Link>

          {/* Center: Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 shrink-0">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-green text-white font-semibold shadow-sm'
                      : 'text-brand-black hover:text-brand-green hover:bg-brand-green/5'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Live Search Pill, Franchise CTA, Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Live Tea Search Pill */}
            <div className="hidden md:block w-48 lg:w-56 xl:w-64">
              <LiveTeaSearch placeholder="Search teas..." />
            </div>

            {/* Mobile Search Toggle Icon */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-full text-brand-black hover:text-brand-green hover:bg-brand-green/5 transition-colors"
              aria-label="Search teas and products"
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Quick Franchise CTA for Desktop */}
            <div className="hidden sm:block shrink-0">
              <BrandButton to="/franchise" variant="primary" size="sm">
                Franchise
              </BrandButton>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-brand-black hover:text-brand-green hover:bg-brand-green/10 transition-colors shrink-0"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pt-2 pb-3 bg-[#FAF7F2] border-t border-neutral-200/60 animate-fade-in">
            <LiveTeaSearch
              autoFocus
              placeholder="Search teas, blends, coffees..."
              onCloseMobile={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
