import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  TrendingUp,
  Coins,
  Truck,
  GraduationCap,
  MapPin,
  Megaphone,
  CheckCircle,
  Sparkles,
  Store,
  Building2,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { BrandButton } from '@/components/ui/BrandButton';
import { cn } from '@/utils/cn';

const BENEFITS = [
  {
    icon: <Coins className="w-7 h-7 text-brand-amber" />,
    title: 'Low Initial Capital',
    description: 'Compact kiosk or cafe models designed for low setup expenses and minimum rent commitments.',
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-brand-leaf-green" />,
    title: 'High Gross Margins',
    description: 'Tea and hot beverages deliver industry-leading margins of 55% to 65% with everyday repeat customers.',
  },
  {
    icon: <Truck className="w-7 h-7 text-brand-rust" />,
    title: 'Direct Spice & Leaf Supply',
    description: 'Receive pre-portioned tea blends, secret spice masalas, and packaging directly from Sharon HQ.',
  },
  {
    icon: <GraduationCap className="w-7 h-7 text-brand-burgundy" />,
    title: 'Comprehensive Masterclass',
    description: 'Extensive hand-on training covering meter tea pouring, decoction brewing, billing, and customer service.',
  },
  {
    icon: <MapPin className="w-7 h-7 text-brand-green" />,
    title: 'Site Selection & Feasibility',
    description: 'Our team evaluates footfall density, visibility, competition, and demographic metrics before site approval.',
  },
  {
    icon: <Megaphone className="w-7 h-7 text-brand-chai" />,
    title: 'Brand Marketing Support',
    description: 'Digital promotions, local influencer marketing, inaugural launch flyers, and social media buzz.',
  },
];

const INVESTMENT_TIERS = [
  {
    name: 'Kiosk / Quick Counter',
    badge: 'Low Capex',
    price: '₹3.5L – ₹5L',
    area: '80 – 120 Sq. Ft',
    payback: '8 – 10 Months',
    icon: <Store className="w-7 h-7 text-brand-green" />,
    highlights: [
      'Modular stainless steel counter & samovar',
      'Tea brewing equipment & POS terminal',
      'Initial raw material & packaging kit',
      'Comprehensive barista training',
    ],
    recommended: false,
  },
  {
    name: 'Express Cafe Model',
    badge: 'Most Popular',
    price: '₹5L – ₹8L',
    area: '150 – 300 Sq. Ft',
    payback: '10 – 14 Months',
    icon: <Building2 className="w-7 h-7 text-brand-amber" />,
    highlights: [
      'Full branded interior styling & warm seating',
      'Hot snack display & cold drink dispenser',
      'Grand opening marketing campaign',
      'Dedicated launch supervisor on site',
    ],
    recommended: true,
  },
  {
    name: 'Regional Master Partner',
    badge: 'Exclusive',
    price: '₹15L+',
    area: 'Multi-Store Rights',
    payback: '14 – 18 Months',
    icon: <Crown className="w-7 h-7 text-brand-burgundy" />,
    highlights: [
      'Exclusive city or district territory rights',
      'Sub-franchise revenue sharing model',
      'Priority bulk spice & merchandise supply',
      'Quarterly operational & marketing audits',
    ],
    recommended: false,
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Submit Application',
    description: 'Fill out the franchise enquiry form below with your location and investment budget.',
  },
  {
    step: '02',
    title: 'Discussion & Site Feasibility',
    description: 'Our franchise manager will contact you, review potential store sites, and share financial models.',
  },
  {
    step: '03',
    title: 'Agreement & Fit-Out',
    description: 'Sign formal MOU, finalize modular kitchen setup, stainless counters, and branding signage.',
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
      <div data-aos="fade-up">
        <SectionHeading
          badge="Franchise Benefits"
          title="Why Partner With Sharon?"
          subtitle="A turnkey business model built on simplicity, high everyday demand, and genuine community loyalty."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {BENEFITS.map((benefit, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={(i % 3) * 40}
            className="group bg-brand-cream/40 rounded-2xl p-7 border border-neutral-200/80 hover:bg-white hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
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
        <div data-aos="fade-up">
          <SectionHeading
            badge="Investment Tiers"
            title="Choose Your Franchise Model"
            subtitle="Flexible investment tiers designed for standalone kiosks, bustling corner cafes, and regional master partners."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {INVESTMENT_TIERS.map((tier, idx) => (
            <div
              key={tier.name}
              data-aos="zoom-in-up"
              data-aos-delay={idx * 40}
              className={cn(
                'relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between hover:shadow-warm-lg',
                tier.recommended
                  ? 'border-brand-burgundy ring-2 ring-brand-burgundy/20 shadow-warm'
                  : 'border-neutral-200/80 hover:border-brand-green/40 shadow-sm'
              )}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-burgundy text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                  <span>{tier.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center border border-amber-900/10">
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
                    Setup Capex • ROI: <strong className="text-neutral-800">{tier.payback}</strong>
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
                className="w-full text-center"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Apply for {tier.name.split(' ')[0]}
              </BrandButton>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Step-by-Step Launch Process */}
      <div className="pt-8 border-t border-neutral-100" data-aos="fade-up">
        <SectionHeading
          badge="Roadmap"
          title="Simple 4-Step Onboarding Process"
          subtitle="From initial handshake to serving your first piping hot cup in under one month."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 35}
              className="relative bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col justify-between hover:shadow-warm transition-all duration-300"
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
