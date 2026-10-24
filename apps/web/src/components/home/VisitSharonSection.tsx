import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OutletCard } from '@/components/ui/OutletCard';
import { BrandButton } from '@/components/ui/BrandButton';
import { useOutlets } from '@/hooks/useOutlets';
import { FALLBACK_OUTLETS } from '@/services/outletService';
import { Navigation } from 'lucide-react';

export const VisitSharonSection: React.FC = () => {
  const { data: outlets } = useOutlets();
  const validFallback = Array.isArray(FALLBACK_OUTLETS) && FALLBACK_OUTLETS.length > 0
    ? FALLBACK_OUTLETS
    : [];
  const rawOutlets = Array.isArray(outlets) && outlets.length > 0 ? outlets : validFallback;
  const displayOutlets = (rawOutlets.length > 0 ? rawOutlets : validFallback).slice(0, 3);

  return (
    <SectionContainer background="cream" className="py-20 md:py-28">
      <div className="reveal-up">
        <SectionHeading
          badge="Locations"
          title="Visit Your Neighborhood Sharon Tea & Coffee"
          subtitle="Step in for a steaming cup of tea or coffee, friendly greetings, and an atmosphere buzzing with life."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto reveal-stagger">
        {displayOutlets.map((outlet, index) => (
          <div
            key={outlet.id}
            className="reveal-up"
            style={{ '--reveal-delay': `${(index % 3) * 80}ms` } as React.CSSProperties}
          >
            <OutletCard outlet={outlet} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center reveal-up" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>
        <BrandButton
          to="/visit-us"
          variant="secondary"
          size="lg"
          icon={<Navigation className="w-4 h-4" />}
        >
          Find Your Nearest Outlet & Directions
        </BrandButton>
      </div>
    </SectionContainer>
  );
};

export default VisitSharonSection;
