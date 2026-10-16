import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { BrandButton } from '@/components/ui/BrandButton';
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const BrandStoryPreview: React.FC = () => {
  return (
    <SectionContainer background="white" className="py-20 md:py-28 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Image Collage / Visual */}
        <div className="relative reveal-left">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] image-zoom-container">
            <img
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85"
              alt="Art of Sharon Chai Boiling"
              className="w-full h-full object-cover image-zoom"
            />
            <div className="absolute inset-x-0 bottom-0 bg-brand-black/85 p-6 text-white border-t border-white/10">
              <span className="text-xs uppercase tracking-wider text-brand-amber font-semibold">
                Since Day One
              </span>
              <p className="font-display text-xl font-bold mt-1">
                Authentic decoctions, never compromising on milk richness.
              </p>
            </div>
          </div>

          {/* Floating Highlight Card */}
          <div
            className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white border border-brand-green/20 rounded-2xl p-4 sm:p-5 shadow-warm-lg max-w-xs hidden sm:block reveal-scale hover-lift"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-green text-brand-amber flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-brand-amber" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Daily Ritual</p>
                <p className="font-display font-bold text-base text-brand-green">
                  8,000+ Happy Smiles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Story */}
        <div className="flex flex-col justify-center reveal-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 bg-brand-burgundy/10 text-brand-burgundy border border-brand-burgundy/20 w-fit">
            Our Story & Heritage
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-black leading-tight">
            Crafted for Comfort, Built on{' '}
            <span className="italic text-brand-burgundy">Tradition.</span>
          </h2>

          <p
            className="mt-6 text-base text-neutral-600 leading-relaxed font-normal text-reveal"
            style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
          >
            Sharon Tea and Coffee began with a humble philosophy: teatime isn't just about grabbing a drink;
            it is a cherished pause in a bustling day. A moment when colleagues share dreams,
            friends reconnect, and everyday travelers recharge.
          </p>

          <p
            className="mt-4 text-base text-neutral-600 leading-relaxed font-normal text-reveal"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            We source our tea leaves directly from prime estates in Assam and the Nilgiris,
            blending them with freshly cracked green cardamom, whole cinnamon quills, and hand-crushed ginger.
            No artificial extracts, no powders—just unadulterated flavor and true hospitality.
          </p>

          {/* Key pillars */}
          <div
            className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-neutral-100 reveal-up"
            style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
          >
            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-brand-black">Pure Ingredients</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Farm fresh milk & real whole spices</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-brand-black">Consistent Taste</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Standardized brewing excellence</p>
              </div>
            </div>
          </div>

          <div
            className="mt-10 reveal-up"
            style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
          >
            <BrandButton
              to="/about-us"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Read Our Full Story
            </BrandButton>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default BrandStoryPreview;
