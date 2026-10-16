import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Sparkles, Calendar, Coffee, Heart, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const TIMELINE_STEPS = [
  {
    year: '2007',
    title: 'Brewing Since 2007 - The First Samovar',
    description:
      'Sharon opened its first doors with a single bubbling brass samovar, family-guarded spices, and an uncompromising commitment to whole tea leaves.',
    icon: <Coffee className="w-5 h-5 text-brand-amber" />,
  },
  {
    year: '2020',
    title: 'Proprietary Spice Formulations',
    description:
      'Standardized our signature cardamom, dry ginger, and royal masala decoction recipes, creating an everyday ritual for commuters and local residents.',
    icon: <Sparkles className="w-5 h-5 text-brand-leaf-green" />,
  },
  {
    year: '2022',
    title: 'Transit & Metro Hub Expansion',
    description:
      'Expanded across Indiranagar, Thippasandra, and high-footfall business corridors, proving our scalable quick-service tea kiosk blueprint.',
    icon: <Calendar className="w-5 h-5 text-brand-burgundy" />,
  },
  {
    year: '2024',
    title: '8,000+ Cups Daily & Retail Blends',
    description:
      'Surpassed 8,000 daily cups served and introduced freshness-sealed foil retail pouches for tea connoisseurs to enjoy Sharon chai at home.',
    icon: <Heart className="w-5 h-5 text-red-500 fill-red-500" />,
  },
  {
    year: 'Today',
    title: 'Scaling Turnkey Franchise Partnerships',
    description:
      'Empowering motivated entrepreneurs across South India with comprehensive barista training, direct estate supply, and proven commercial returns.',
    icon: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
  },
];

export const BrandIntroduction: React.FC = () => {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-24 md:py-32 bg-brand-green text-white overflow-hidden border-b border-brand-leaf-green/20">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
            <Sparkles className="w-3.5 h-3.5" />
            Brewing Since 2007 • Our Heritage & Story
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            The Soul of Sharon: Brewed With Heart
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-brand-cream/85 max-w-2xl mx-auto leading-relaxed font-normal">
            Brewing since 2007 and serving over 8,000 cups daily with 50+ handcrafted tea options, authentic spice recipes, and genuine hospitality.
          </p>
        </div>
      </section>

      {/* Brand Story In-Depth */}
      <SectionContainer background="white" className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="reveal-up">
            <SectionHeading
              badge="The Sharon Journey"
              title="50+ Tea Options"
              subtitle="Honoring the timeless ritual of chai with over 50+ handcrafted tea varieties, rich whole spices, and comforting aromas."
            />
          </div>

          <div className="prose prose-lg text-neutral-600 space-y-6 leading-relaxed font-normal">
            <p className="reveal-left text-reveal">
              Sharon Tea and Coffee was created out of deep admiration for India's roadside tea culture, elevated with uncompromising standards of hygiene, consistent taste, and premium whole spices.
            </p>
            <p className="reveal-right text-reveal">
              While ordinary tea stalls often resort to low-grade tea dust and artificial flavour essences, Sharon stood firm on a different path: only whole CTC tea leaves from Assam’s Brahmaputra valley, freshly pounded green cardamom pods from Kerala, ginger harvested at peak aroma, and thick, full-cream farm milk.
            </p>
            <blockquote
              className="border-l-4 border-brand-burgundy pl-5 italic text-brand-black font-display text-xl my-6 bg-brand-cream/60 py-4 rounded-r-xl shadow-xs reveal-scale"
            >
              "We believe that a single cup of piping hot tea has the power to uplift the spirit, turn strangers into companions, and bring peace to a hectic day."
            </blockquote>
            <p className="reveal-left text-reveal">
              Today, Sharon has grown into a cherished landmark across neighborhoods. Whether it is an early-morning commuter reaching for their first strong brew or a group of tech workers unwinding in the evening over fragrant Elaichi tea, every guest is met with the same authentic aroma and warmth.
            </p>
          </div>
        </div>

        {/* Heritage Timeline Section */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto pt-12 sm:pt-16 border-t border-neutral-100">
          <div className="text-center mb-10 sm:mb-16 reveal-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-burgundy bg-brand-burgundy/10 px-3.5 py-1 rounded-full border border-brand-burgundy/20">
              <Sparkles className="w-3.5 h-3.5 text-brand-burgundy" />
              Milestones
            </span>
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-brand-black mt-3">
              Our Heritage Timeline
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm max-w-md mx-auto mt-2 px-4">
              Every year brought a new chapter of flavour consistency and community bonding.
            </p>
          </div>

          {/* Timeline Nodes Container */}
          <div className="relative px-1 sm:px-4">
            {/* Mobile Continuous Left Spine Line */}
            <div
              className="md:hidden absolute left-6 sm:left-7 top-4 bottom-8 w-0.5 bg-gradient-to-b from-brand-green via-brand-burgundy to-brand-amber opacity-35"
              aria-hidden="true"
            />

            {/* Desktop Centered Vertical Spine Line */}
            <div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 top-4 bottom-8 w-0.5 bg-gradient-to-b from-brand-green via-brand-burgundy to-brand-amber opacity-35"
              aria-hidden="true"
            />

            <div className="space-y-6 sm:space-y-8 md:space-y-12 relative">
              {TIMELINE_STEPS.map((step, index) => {
                const isEven = index % 2 === 0;
                const stepNumber = String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={step.year}
                    className={cn(
                      'relative',
                      isEven ? 'reveal-left' : 'reveal-right'
                    )}
                    style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as React.CSSProperties}
                  >
                    {/* Mobile View: Vertical Left Spine with Clean Connected Card */}
                    <div className="flex md:hidden items-start gap-3 sm:gap-4">
                      {/* Left Node Badge */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border-2 border-brand-green shadow-xs flex items-center justify-center shrink-0 z-10 mt-1 transition-transform active:scale-95">
                        {step.icon}
                      </div>

                      {/* Right Content Card */}
                      <div className="flex-1 min-w-0 bg-white rounded-2xl p-4 sm:p-5 border border-amber-950/10 shadow-xs hover-lift transition-all duration-300">
                        {/* Top Meta: Year Pill & Step Number */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-brand-burgundy text-white shadow-2xs">
                            {step.year}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            Milestone {stepNumber}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-display text-sm sm:text-base font-bold text-brand-black leading-snug mb-1">
                          {step.title}
                        </h4>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Desktop View: Alternating Center Timeline */}
                    <div
                      className={cn(
                        'hidden md:flex items-center gap-8 lg:gap-10',
                        isEven ? 'flex-row' : 'flex-row-reverse'
                      )}
                    >
                      {/* Content Card */}
                      <div className={cn('w-1/2', isEven ? 'text-right' : 'text-left')}>
                        <div className="bg-white rounded-2xl p-6 border border-amber-950/10 shadow-xs hover-lift transition-all duration-300 group">
                          <div className={cn('flex items-center gap-2 mb-2', isEven ? 'justify-end' : 'justify-start')}>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black tracking-wider bg-brand-burgundy text-white shadow-2xs">
                              {step.year}
                            </span>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              Milestone {stepNumber}
                            </span>
                          </div>

                          <h4 className="font-display text-lg font-bold text-brand-black mb-1.5 group-hover:text-brand-burgundy transition-colors">
                            {step.title}
                          </h4>

                          <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Center Node Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-brand-green shadow-sm flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110">
                        {step.icon}
                      </div>

                      {/* Spacer for other side */}
                      <div className="w-1/2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
};

export default BrandIntroduction;
