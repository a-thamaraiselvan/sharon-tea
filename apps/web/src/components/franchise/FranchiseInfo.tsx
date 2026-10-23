import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BrandButton } from '@/components/ui/BrandButton';
import {
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  Headphones,
  Store,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const BENEFITS = [
  {
    icon: <TrendingUp className="w-7 h-7 text-brand-green" />,
    title: 'High Gross Margins',
    description:
      'High repeat daily consumption ensures strong gross profit margins with swift cash flow from day one.',
  },
  {
    icon: <Award className="w-7 h-7 text-brand-green" />,
    title: 'Established Brand Equity',
    description:
      'Leverage Sharon’s strong recall across South India. Patrons recognize our samovars and trust our quality.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-brand-green" />,
    title: 'Centralized Supply Chain',
    description:
      'Receive our proprietary tea leaf blends, authentic whole spices, and packaging directly at wholesale rates.',
  },
  {
    icon: <Users className="w-7 h-7 text-brand-green" />,
    title: 'Complete Staff Training',
    description:
      'Comprehensive 7-day culinary SOP onboarding covering exact tea proportions, boiling timings, hygiene, and guest care.',
  },
  {
    icon: <Store className="w-7 h-7 text-brand-green" />,
    title: 'Compact Store Footprint',
    description:
      'Turnkey kiosk models designed for 80–120 sq. ft. minimizing rental overheads while maximizing per-sq-ft sales.',
  },
  {
    icon: <Headphones className="w-7 h-7 text-brand-green" />,
    title: 'Continuous Marketing Support',
    description:
      'Digital promotions, local influencer marketing, inaugural launch flyers, and social media buzz.',
  },
];

const INVESTMENT_TIERS = [
  {
    name: 'Sharon Cafe Model',
    price: '₹15 – ₹20 Lakhs',
    payback: '10–12 Months',
    area: '150 – 300 Sq. Ft.',
    badge: 'Most Recommended',
    recommended: true,
    icon: <Store className="w-7 h-7 text-brand-burgundy" />,
    highlights: [
      'Semi-dine-in seating with beverage + snack menu',
      'Enhanced branding, digital menus & acoustic setup',
      'Full point-of-sale billing & inventory software',
      'Prime corner location advisory & grand launch campaign',
    ],
  },
  {
    name: 'Sharon Master Franchise',
    price: '₹25 – ₹30 Lakhs',
    payback: '14–18 Months',
    area: 'Territory / City Rights',
    badge: 'Exclusive Regional Rights',
    recommended: false,
    icon: <Award className="w-7 h-7 text-brand-amber" />,
    highlights: [
      'Multi-unit expansion rights for entire district/city',
      'Sub-franchise revenue sharing & territory protection',
      'Direct central warehouse dispatch rates',
      'Dedicated field expansion manager support',
    ],
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Application & Discovery',
    description: 'Submit your franchise inquiry online. Our expansion team connects within 24 hours to assess location suitability.',
  },
  {
    step: '02',
    title: 'Site Selection & Agreement',
    description: 'Our real-estate team validates your site catchment area and signs the official franchise partnership deed.',
  },
  {
    step: '03',
    title: 'Store Fabrication & Equipment',
    description: 'Complete interior fabrication, samovar plumbing, branding signages, and POS setup completed in 15–20 days.',
  },
  {
    step: '04',
    title: 'Training & Grand Launch',
    description: 'Staff training on Sharon brewing recipes followed by an exciting launch day campaign.',
  },
];

export const FranchiseInfo: React.FC = () => {
  const scrollToForm = () => {
    const formEl = document.getElementById('franchise-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionContainer background="white" className="py-20 md:py-28">
      {/* 1. Value Pillars */}
      <div className="reveal-up">
        <SectionHeading
          badge="Franchise Benefits"
          title="Why Partner With Sharon?"
          subtitle="A turnkey business model built on simplicity, high everyday demand, and genuine community loyalty."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 reveal-stagger">
        {BENEFITS.map((benefit, i) => (
          <div
            key={i}
            className="group bg-brand-cream/40 rounded-2xl p-7 border border-neutral-200/80 hover:bg-white hover-lift transition-all duration-300 reveal-up"
            style={{ '--reveal-delay': `${(i % 3) * 60}ms` } as React.CSSProperties}
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-neutral-100">
              {benefit.icon}
            </div>
            <h3 className="font-display text-xl font-bold text-brand-black mb-2.5 group-hover:text-brand-burgundy transition-colors">
              {benefit.title}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Investment Tier Cards */}
      <div className="pt-8 border-t border-neutral-100 mb-24">
        <div className="reveal-up">
          <SectionHeading
            badge="Investment Tiers"
            title="Choose Your Franchise Model"
            subtitle="Flexible investment tiers designed for bustling corner cafes and regional master partners."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8 reveal-stagger">
          {INVESTMENT_TIERS.map((tier, idx) => (
            <div
              key={tier.name}
              className={cn(
                'relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between hover-lift reveal-scale',
                tier.recommended
                  ? 'border-brand-burgundy ring-2 ring-brand-burgundy/20 shadow-warm'
                  : 'border-neutral-200/80 hover:border-brand-green/40 shadow-sm'
              )}
              style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-burgundy text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center border border-brand-amber/20">
                    {tier.icon}
                  </div>
                  {!tier.recommended && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-brand-black">
                  {tier.name}
                </h3>

                <div className="mt-4 mb-6 pb-6 border-b border-neutral-100">
                  <span className="text-3xl font-display font-extrabold text-brand-burgundy">
                    {tier.price}
                  </span>
                  <span className="text-xs text-neutral-500 block mt-1">
                    Setup Capex • ROI: <strong className="text-brand-amber font-semibold">{tier.payback}</strong>
                  </span>
                  <span className="text-xs text-brand-green font-semibold block mt-0.5">
                    Space: {tier.area}
                  </span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 mb-8">
                  {tier.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-leaf-green shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <BrandButton
                variant={tier.recommended ? 'primary' : 'outline'}
                size="md"
                onClick={scrollToForm}
                className="w-full text-center button-interaction"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Apply for {tier.name.replace('Sharon ', '')}
              </BrandButton>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Step-by-Step Launch Process */}
      <div className="pt-8 border-t border-neutral-100">
        <div className="reveal-up">
          <SectionHeading
            badge="Roadmap"
            title="Simple 4-Step Onboarding Process"
            subtitle="From initial handshake to serving your first piping hot cup in under one month."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative reveal-stagger">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col justify-between hover-lift transition-all duration-300 reveal-up"
              style={{ '--reveal-delay': `${idx * 60}ms` } as React.CSSProperties}
            >
              <div>
                <span className="font-display text-4xl font-black text-brand-green/20 block mb-2">
                  {s.step}
                </span>
                <h4 className="font-display text-lg font-bold text-brand-black mb-2">
                  {s.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-semibold text-brand-green">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Phase {s.step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default FranchiseInfo;
