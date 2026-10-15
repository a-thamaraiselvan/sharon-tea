import React from 'react';
import { BrandButton } from '@/components/ui/BrandButton';
import { TrendingUp, Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export const FranchisePromo: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-brand-burgundy text-white py-20 lg:py-28 border-y border-brand-burgundy/40">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main CTA Text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
              Franchise Opportunity
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Grow With <span className="text-brand-amber">Sharon</span>. Build a Thriving Beverage Business.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-brand-cream/85 leading-relaxed font-normal max-w-2xl text-reveal">
              Partner with one of South India's fastest-growing quick-service tea brands. Enjoy proven operational blueprints,
              centralized spice sourcing, staff training, and an evergreen customer base from day one.
            </p>

            {/* Quick Benefits Bullet Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-lg">
              <div className="flex items-center gap-2 text-sm text-brand-cream">
                <TrendingUp className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>High Gross Margins</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-cream">
                <Users className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>Comprehensive Staff Training</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-cream">
                <ShieldCheck className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>Full Supply Chain Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-cream">
                <Award className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>Proven Business Model</span>
              </div>
            </div>

            <div className="mt-10">
              <BrandButton
                to="/franchise"
                variant="amber"
                size="lg"
                icon={<ArrowRight className="w-5 h-5 text-brand-black" />}
              >
                Become a Franchise Partner
              </BrandButton>
            </div>
          </div>

          {/* Franchise Highlight Stat Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6 hover-lift">
              <h3 className="font-display text-2xl font-bold text-white border-b border-white/15 pb-4">
                Franchise Highlights
              </h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm text-brand-cream/80">Average Daily Footfall</span>
                  <span className="font-display text-lg font-bold text-brand-amber">500+ Customers</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm text-brand-cream/80">Expected ROI Timeline</span>
                  <span className="font-display text-lg font-bold text-brand-amber">10 – 14 Months</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-sm text-brand-cream/80">Store Space Needed</span>
                  <span className="font-display text-lg font-bold text-brand-amber">80 – 250 Sq. Ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-cream/80">Standard SOPs & Recipes</span>
                  <span className="font-display text-lg font-bold text-brand-amber">100% Provided</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FranchisePromo;
