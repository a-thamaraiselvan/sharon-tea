import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Coffee, CupSoda, Leaf, Package, Store, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const HIGHLIGHTS = [
  {
    icon: <Award className="w-7 h-7 text-brand-amber" />,
    title: '8,000+ Cups Served Daily',
    customTitle: (
      <span>
        <AnimatedCounter target={8000} suffix="+" /> Cups Served Daily
      </span>
    ),
    description: 'Every sunrise, thousands of tea lovers flock to Sharon outlets for our unforgettable freshly strained chai.',
    link: '/about-us',
  },
  {
    icon: <Coffee className="w-7 h-7 text-brand-burgundy" />,
    title: '50+ Tea Options',
    description: 'From cardamom-infused Elaichi tea to robust Masala chai, herbal wellness infusions, and refreshing filter coffees crafted to culinary precision.',
    link: '/menu',
  },
  {
    icon: <CupSoda className="w-7 h-7 text-brand-rust" />,
    title: 'Hot & Cold Beverages',
    description: 'Traditional frothy filter coffee, thick Sharon cold coffee, and chilled rose milk tailored for all seasons.',
    link: '/menu',
  },
  {
    icon: <Leaf className="w-7 h-7 text-brand-leaf-green" />,
    title: 'Herbal Tea Selections',
    description: 'Rich in antioxidants, zero artificial additives, handpicked botanicals to detoxify and boost overall immunity.',
    link: '/menu',
  },
  {
    icon: <Package className="w-7 h-7 text-brand-chai" />,
    title: 'Packaged Tea Products',
    description: 'Take the signature Sharon taste home. Fresh 250g foil-sealed pouches available for instant WhatsApp ordering.',
    link: '/products',
  },
  {
    icon: <Store className="w-7 h-7 text-brand-green" />,
    title: 'Franchise Opportunities',
    description: 'Join South India’s fastest growing tea family with high ROI, standard recipes, training, and full operational guidance.',
    link: '/franchise',
  },
];

export const BrandHighlights: React.FC = () => {
  return (
    <SectionContainer background="cream" className="py-20 md:py-28">
      <div className="reveal-up">
        <SectionHeading
          badge="Why Sharon"
          title="Brewed with Passion, Served with Love"
          subtitle="Discover what makes Sharon Tea and Coffee the most cherished neighborhood gathering spot across South India."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 reveal-stagger">
        {HIGHLIGHTS.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-7 border border-amber-900/10 shadow-sm hover-lift transition-all duration-300 flex flex-col justify-between reveal-up"
            style={{ '--reveal-delay': `${(index % 3) * 80}ms` } as React.CSSProperties}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-cream flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-amber-900/5">
                {item.icon}
              </div>

              <h3 className="font-display text-xl font-bold text-brand-black mb-2.5 group-hover:text-brand-burgundy transition-colors">
                {item.customTitle || item.title}
              </h3>

              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                to={item.link}
                className="text-xs font-semibold uppercase tracking-wider text-brand-green group-hover:text-brand-burgundy flex items-center gap-1.5 transition-colors"
              >
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default BrandHighlights;
