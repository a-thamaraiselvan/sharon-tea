import React from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Coffee, Store, Sparkles, Heart } from 'lucide-react';

export const BrandAchievement: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-brand-black text-white">
      {/* Background with Tea Texture & Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=2000&q=85"
          alt="Steaming Sharon tea glasses background"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-brand-black/90" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/40 border border-brand-leaf-green/40 text-xs sm:text-sm font-semibold text-brand-amber mb-6 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-brand-amber" />
            A Milestone of Trust & Community
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Every Day, We Warm Hearts
          </h2>
        </div>

        {/* Hero Counter */}
        <div className="my-8 reveal-scale counter-value">
          <div className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-brand-amber drop-shadow-lg tracking-tight">
            <AnimatedCounter target={8000} suffix="+" />
          </div>
          <p className="font-display text-2xl sm:text-3xl text-brand-cream font-medium mt-3">
            Cups Served Daily
          </p>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mt-2 text-reveal">
            Each cup hand-strained and served piping hot with unmistakable aroma and unmatched care.
          </p>
        </div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-white/15 reveal-stagger">
          <div
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center hover-lift transition-all shadow-xs reveal-up"
            style={{ '--reveal-delay': '0ms' } as React.CSSProperties}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 sm:mb-3">
              <Store className="w-5 h-5 sm:w-6 sm:h-6 text-brand-amber" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-brand-amber">
              <AnimatedCounter target={12} suffix="+" />
            </div>
            <p className="text-xs sm:text-sm text-brand-cream/80 mt-1 font-medium">Active Outlets</p>
          </div>

          <div
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center hover-lift transition-all shadow-xs reveal-up"
            style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 sm:mb-3">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-brand-chai" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-brand-chai">
              <AnimatedCounter target={50} suffix="+" />
            </div>
            <p className="text-xs sm:text-sm text-brand-cream/80 mt-1 font-medium">Tea Options & Blends</p>
          </div>

          <div
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center hover-lift transition-all shadow-xs reveal-up"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 sm:mb-3">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-brand-amber" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-brand-amber">
              <AnimatedCounter target={99} suffix="%" />
            </div>
            <p className="text-xs sm:text-sm text-brand-cream/80 mt-1 font-medium">Customer Delight</p>
          </div>

          <div
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center hover-lift transition-all shadow-xs reveal-up"
            style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2.5 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-chai" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-brand-chai">
              <AnimatedCounter target={100} suffix="%" />
            </div>
            <p className="text-xs sm:text-sm text-brand-cream/80 mt-1 font-medium">Natural Spices</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandAchievement;
