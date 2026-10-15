import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUiStore } from '@/stores/useUiStore';
import { SharonLogo } from '@/components/ui/SharonLogo';
import { BrandButton } from '@/components/ui/BrandButton';
import { X, Phone, MessageCircle, MapPin, ChevronRight } from 'lucide-react';
import { generateGeneralInquiryLink } from '@/utils/whatsappLink';
import { cn } from '@/utils/cn';

import { LiveTeaSearch } from '@/components/search/LiveTeaSearch';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Menu', path: '/menu' },
  { label: 'Products', path: '/products' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Visit Us', path: '/visit-us' },
];

export const MobileNav: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore();

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-out drawer from left to right */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm bg-brand-cream shadow-2xl flex flex-col justify-between p-6 z-50 animate-slide-right">
        {/* Top bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-brand-green/10">
            <SharonLogo size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full text-brand-black hover:bg-neutral-200/50 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Tea Search Pill */}
          <div className="mt-4">
            <LiveTeaSearch
              placeholder="Search teas, blends..."
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all',
                    isActive
                      ? 'bg-brand-green text-white font-semibold shadow-sm'
                      : 'text-brand-black hover:bg-brand-green/10 hover:text-brand-green'
                  )
                }
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer in Drawer */}
        <div className="space-y-4 pt-6 border-t border-brand-green/10">
          <BrandButton
            to="/franchise"
            variant="primary"
            size="md"
            className="w-full text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Franchise Enquiry
          </BrandButton>

          <a
            href={generateGeneralInquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-brand-green/30 text-brand-green hover:bg-brand-green/5 text-sm font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="pt-2 text-xs text-neutral-500 space-y-1 text-center">
            <p className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3 text-brand-green" />
              <span>+91 98765 43210</span>
            </p>
            <p className="flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-brand-rust" />
              <span>Cathedral Road, Chennai</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
