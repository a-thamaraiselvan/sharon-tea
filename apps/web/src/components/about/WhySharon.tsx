import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Coffee, Flame, MapPin, PackageCheck } from 'lucide-react';

const DIFFERENTIATORS = [
  {
    icon: <Coffee className="w-8 h-8 text-brand-burgundy" />,
    title: 'Extensive Beverage Variety',
    description:
      'From strong morning Assam chai and south Indian chicory coffee to iced rose milk and lemon coolers, our menu caters to every mood, weather, and craving.',
  },
  {
    icon: <Flame className="w-8 h-8 text-brand-rust" />,
    title: 'Signature Proprietary Flavours',
    description:
      'Our spice formulations are guarded family recipes—freshly cracked Malabar cardamoms, cinnamon quills, and dry ginger balanced in exact ratios.',
  },
  {
    icon: <MapPin className="w-8 h-8 text-brand-green" />,
    title: 'Convenient Neighborhood Hubs',
    description:
      'Strategically positioned along busy transport junctions, metro stations, and office corridors to ensure you are never more than minutes away from good tea.',
  },
  {
    icon: <PackageCheck className="w-8 h-8 text-brand-amber" />,
    title: 'Home-Packaged Tea Blends',
    description:
      'Take our culinary craft home with vacuum-sealed aroma pouches. Order easily directly over WhatsApp with door-step dispatch.',
  },
];

export const WhySharon: React.FC = () => {
  return (
    <SectionContainer background="white" className="py-20 md:py-28">
      <div className="reveal-up">
        <SectionHeading
          badge="The Sharon Advantage"
          title="Why Patrons Choose Sharon"
          subtitle="Four defining pillars that set our tea stall apart from the ordinary street vendor."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
        {DIFFERENTIATORS.map((diff, index) => (
          <div
            key={index}
            className="group bg-brand-cream/50 rounded-2xl p-7 border border-neutral-200/80 hover:bg-white hover-lift transition-all duration-300 reveal-up"
            style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as React.CSSProperties}
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-neutral-100">
              {diff.icon}
            </div>

            <h3 className="font-display text-xl font-bold text-brand-black mb-3 group-hover:text-brand-burgundy transition-colors">
              {diff.title}
            </h3>

            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {diff.description}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default WhySharon;
