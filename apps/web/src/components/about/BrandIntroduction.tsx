import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Sparkles, Store, Coffee, Heart, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const TIMELINE_STEPS = [
  {
    year: '2007',
    category: 'Stores',
    title: 'First Store in Bangalore',
    description:
      'SHARON TEA STALL launched its first store in Bangalore. We were never built just to serve tea — we were built to give the authentic taste to people who move India forward.',
    icon: <Store className="w-5 h-5 text-white" />,
  },
  {
    year: '2011',
    category: '100+ Varieties',
    title: 'Beverages & Made-For-Tea Bites',
    description:
      'We launched many varieties (100+) of our beverages and made-for-tea snacks and bites, creating an everyday culinary tradition for our community.',
    icon: <Coffee className="w-5 h-5 text-white" />,
  },
  {
    year: '2016',
    category: 'Expansion',
    title: 'Second Branch in Indiranagar',
    description:
      'We inaugurated our second branch in Indiranagar, which unlocked immense new potential and brought our authentic brewing to an iconic Bangalore hub.',
    icon: <Sparkles className="w-5 h-5 text-white" />,
  },
  {
    year: '2017',
    category: 'Packaged Products',
    title: 'Packaged Retail Blends & Online Store',
    description:
      'Authentic beverages and packaged blends became available online, enabling tea lovers to brew the signature Sharon taste in their own homes.',
    icon: <Heart className="w-5 h-5 text-white" />,
  },
  {
    year: '2020',
    category: 'FICO Model',
    title: 'Franchise Investment & Resilience',
    description:
      'Launched a new Franchise-Invested, Company-Operated (FICO) model combining partner investment with Sharon’s end-to-end operational expertise. Our journey has seen highs, lows, and difficult losses — every challenge taught us something and gave us the strength to keep going.',
    icon: <HeartHandshake className="w-5 h-5 text-white" />,
  },
  {
    year: '2026',
    category: 'Cafe Model',
    title: 'Cafe Model Outlet & "Taste and See the Lord is Good"',
    description:
      'We inaugurated our cafe model outlet, proudly spreading our motto: "TASTE AND SEE THE LORD IS GOOD". Today, nearly 20 years later, with six shops across Bengaluru, our story is still growing. The next chapter is brewing.',
    icon: <CheckCircle2 className="w-5 h-5 text-white" />,
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
            Nearly 20 years of authentic brewing, six shops across Bengaluru, 100+ beverage varieties, and the same passion that started it all in 2007.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-brand-amber font-display italic text-sm sm:text-base">
            "Taste and see the Lord is good."
          </div>
        </div>
      </section>

      {/* Brand Story In-Depth */}
      <SectionContainer background="white" className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="reveal-up">
            <SectionHeading
              badge="The Sharon Journey"
              title="100+ Beverage Varieties & Made-For-Tea Bites"
              subtitle="From a single bubbling samovar in 2007 to six thriving locations across Bengaluru, built to serve the people who move India forward."
            />
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-5 reveal-up">
            <p className="text-lg sm:text-xl text-brand-black font-medium leading-relaxed">
              Launched in Bangalore in 2007, Sharon was never built just to serve tea — we were built to give authentic taste to the people who move India forward.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Nearly 20 years and six shops later, our journey continues with the same passion: whole estate CTC leaves, fresh milk, and whole spices pounded by hand. Today, with our modern cafe model and the motto <span className="font-semibold text-brand-black">"Taste and see the Lord is good"</span>, our story is still growing. The next chapter is brewing.
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
              From our first store in 2007 to our modern cafe model outlet — every chapter shaped with passion and perseverance.
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
                      <div
                        className={cn(
                          'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl shadow-xs flex items-center justify-center shrink-0 z-10 mt-1 transition-transform active:scale-95 text-white',
                          isEven ? 'bg-brand-rust' : 'bg-brand-green'
                        )}
                      >
                        {step.icon}
                      </div>

                      {/* Right Content Card */}
                      <div className="flex-1 min-w-0 bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs hover-lift transition-all duration-300">
                        {/* Top Meta: Year Pill & Step Number */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-brand-burgundy text-white shadow-2xs">
                            {step.year}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            {step.category || `Milestone ${stepNumber}`}
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
                        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs hover-lift transition-all duration-300 group">
                          <div className={cn('flex items-center gap-2 mb-2', isEven ? 'justify-end' : 'justify-start')}>
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black tracking-wider bg-brand-burgundy text-white shadow-2xs">
                              {step.year}
                            </span>
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              {step.category || `Milestone ${stepNumber}`}
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
                      <div
                        className={cn(
                          'w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 text-white',
                          isEven ? 'bg-brand-rust' : 'bg-brand-green'
                        )}
                      >
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
