import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { OutletList } from '@/components/visit/OutletList';
import { useOutlets } from '@/hooks/useOutlets';
import { FALLBACK_OUTLETS } from '@/services/outletService';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

export const VisitUsPage: React.FC = () => {
  const { data: outlets = FALLBACK_OUTLETS, isLoading } = useOutlets();

  return (
    <>
      <Helmet>
        <title>Visit Our Stalls | Find a Sharon Tea Stall Near You</title>
        <meta
          name="description"
          content="Find Sharon Tea Stall locations in Bangalore: Indiranagar, New Thippasandra, and Kaggadasapura. Check opening hours, street addresses, and get direct Google Maps navigation."
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative py-20 md:py-28 bg-brand-green text-white overflow-hidden text-center border-b border-brand-leaf-green/20">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
            <MapPin className="w-3.5 h-3.5" />
            Find Your Local Stall
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4" data-aos="fade-up">
            Visit Sharon Tea Stall
          </h1>
          <p
            className="text-base sm:text-lg text-brand-cream/85 max-w-2xl mx-auto font-normal"
            data-aos="fade-up"
            data-aos-delay="40"
          >
            Whether you need a brisk morning wake-up cup or an evening tea catchup with colleagues, our doors are open 7 days a week.
          </p>
        </div>
      </section>

      {/* Outlets Content Area */}
      <SectionContainer background="cream" className="py-16 md:py-24">
        <OutletList outlets={outlets} isLoading={isLoading} />
      </SectionContainer>
    </>
  );
};

export default VisitUsPage;
