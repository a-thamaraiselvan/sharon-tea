import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Target, Compass, HeartHandshake } from 'lucide-react';

const PILLARS = [
  {
    icon: <Target className="w-8 h-8 text-brand-burgundy" />,
    title: 'Our Mission',
    description:
      'To serve wholesome, authentic, and delightfully affordable tea and beverages that bring cheer and genuine connection to thousands of everyday commuters and families.',
  },
  {
    icon: <Compass className="w-8 h-8 text-brand-green" />,
    title: 'Our Vision',
    description:
      'To become India’s most beloved and trustworthy neighborhood tea destination, while empowering passionate local entrepreneurs through transparent, high-return franchise partnerships.',
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-brand-amber" />,
    title: 'Our Core Values',
    description:
      'Pure farm-fresh ingredients, zero compromises on hygiene, deep respect for culinary heritage, fair pricing for our patrons, and warmth in every interaction.',
  },
];

export const MissionVisionValues: React.FC = () => {
  return (
    <SectionContainer background="cream" className="py-20 md:py-28">
      <div className="reveal-up">
        <SectionHeading
          badge="Foundations"
          title="Mission, Vision & Core Values"
          subtitle="The guiding principles that steer every cup we pour and every new outlet we establish."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto reveal-stagger">
        {PILLARS.map((pillar, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-8 border border-amber-950/5 shadow-sm hover-lift transition-all duration-300 flex flex-col justify-between reveal-up"
            style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center mb-6 border border-amber-950/10">
                {pillar.icon}
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-black mb-3">
                {pillar.title}
              </h3>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                {pillar.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-burgundy">
              <span>Sharon Standard</span>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default MissionVisionValues;
