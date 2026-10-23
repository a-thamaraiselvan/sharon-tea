import React from 'react';
import { BrandButton } from '@/components/ui/BrandButton';
import { Sparkles, ArrowDown } from 'lucide-react';

export const FranchiseHero: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('franchise-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-brand-green text-white overflow-hidden border-b border-brand-leaf-green/20">
      <div
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center reveal-fade"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/30 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6">
          <Sparkles className="w-4 h-4 text-brand-amber" />
          Partner With South India's Beloved Tea Brand
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] mb-6">
          Grow With <span className="text-brand-amber">Sharon</span>.
        </h1>

        <p className="max-w-2xl text-base sm:text-xl text-brand-cream/85 leading-relaxed font-normal mb-10 text-reveal">
          Transform your entrepreneurial vision into high-yield reality. Over 8,000 cups poured daily across our outlets,
          supported by streamlined operations and beloved recipes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto reveal-up" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
          <BrandButton
            variant="amber"
            size="lg"
            onClick={scrollToForm}
            icon={<ArrowDown className="w-4 h-4" />}
            className="w-full sm:w-auto text-brand-black font-bold button-interaction"
          >
            Apply for Franchise Now
          </BrandButton>

          <BrandButton
            href="https://wa.me/919876543210?text=Hello%20Sharon%20Tea%20Stall!%20I%20am%20interested%20in%20franchise%20details."
            isExternal
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-brand-cream/60 text-brand-cream hover:bg-white hover:text-brand-green button-interaction"
          >
            Instant WhatsApp Query
          </BrandButton>
        </div>
      </div>
    </section>
  );
};

export default FranchiseHero;
