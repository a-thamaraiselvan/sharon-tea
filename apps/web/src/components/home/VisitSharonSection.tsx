import React from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { OutletCard } from '@/components/ui/OutletCard';
import { BrandButton } from '@/components/ui/BrandButton';
import { useOutlets } from '@/hooks/useOutlets';
import { FALLBACK_OUTLETS } from '@/services/outletService';
import { MapPin, Navigation } from 'lucide-react';

export const VisitSharonSection: React.FC = () => {
  const { data: outlets } = useOutlets();
  const validFallback = Array.isArray(FALLBACK_OUTLETS) && FALLBACK_OUTLETS.length > 0
    ? FALLBACK_OUTLETS
    : [];
  const rawOutlets = Array.isArray(outlets) && outlets.length > 0 ? outlets : validFallback;
  const displayOutlets = (rawOutlets.length > 0 ? rawOutlets : validFallback).slice(0, 3);

  return (
    <SectionContainer background="cream" className="py-20 md:py-28">
      <div data-aos="fade-up">
        <SectionHeading
          badge="Locations"
          title="Visit Your Neighborhood Sharon Stall"
          subtitle="Step in for a steaming cutting chai, friendly greetings, and an atmosphere buzzing with life."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {displayOutlets.map((outlet, index) => (
          <div key={outlet.id} data-aos="fade-up" data-aos-delay={(index % 3) * 40}>
            <OutletCard outlet={outlet} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center" data-aos="fade-up">
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
