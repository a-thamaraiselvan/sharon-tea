import React, { useState } from 'react';
import type { Outlet } from '@/types';
import { MapEmbed } from './MapEmbed';
import { MinimalLoader } from '@/components/ui/MinimalLoader';
import { MapPin, Clock, Phone, Navigation, Map } from 'lucide-react';
import { cn } from '@/utils/cn';

interface OutletListProps {
  outlets?: Outlet[];
  isLoading?: boolean;
}

export const OutletList: React.FC<OutletListProps> = ({ outlets = [], isLoading = false }) => {
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(
    outlets.length > 0 ? outlets[0] : null
  );

  if (isLoading) {
    return <MinimalLoader text="Locating Sharon outlets..." />;
  }

  const currentSelection = selectedOutlet || outlets[0];

  return (
    <div className="space-y-12">
      {/* Featured Outlet with Interactive Map */}
      {currentSelection && (
        <div
          className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-warm-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          data-aos="fade-up"
        >
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-green bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
              Selected Stall
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
              {currentSelection.name}
            </h3>

            <div className="space-y-3 text-sm text-neutral-600 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green flex-shrink-0 mt-1" />
                <span>
                  {currentSelection.address}, {currentSelection.city}, {currentSelection.state}{' '}
                  {currentSelection.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <span>{currentSelection.hours}</span>
              </div>
              {currentSelection.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-rust flex-shrink-0" />
                  <a
                    href={`tel:${currentSelection.phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-brand-burgundy transition-colors font-medium"
                  >
                    {currentSelection.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={currentSelection.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-burgundy hover:bg-brand-rust text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hello Sharon Tea Stall! I want directions to ${currentSelection.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-green/30 text-brand-green hover:bg-brand-green/5 text-xs font-semibold transition-all"
              >
                <span>WhatsApp Location</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7" data-aos="zoom-in">
            <MapEmbed
              embedUrl={currentSelection.embedUrl}
              title={`${currentSelection.name} Map`}
            />
          </div>
        </div>
      )}

      {/* Grid of all outlets */}
      <div>
        <h4 className="font-display text-2xl font-bold text-brand-black mb-6" data-aos="fade-up">
          All Sharon Stalls ({outlets.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outlets.map((outlet, index) => {
            const isSelected = currentSelection?.id === outlet.id;
            return (
              <div
                key={outlet.id}
                data-aos="fade-up"
                data-aos-delay={(index % 3) * 40}
                onClick={() => setSelectedOutlet(outlet)}
                className={cn(
                  'cursor-pointer bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-warm-lg',
                  isSelected
                    ? 'border-brand-green ring-2 ring-brand-green/20 shadow-warm'
                    : 'border-neutral-200/80 hover:border-brand-green/40'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-display text-lg font-bold text-brand-black">
                      {outlet.name}
                    </h4>
                    {outlet.isMainBranch && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber flex-shrink-0">
                        Main
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-neutral-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-green mt-0.5 flex-shrink-0" />
                      <span>{outlet.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-brand-amber flex-shrink-0" />
                      <span>{outlet.hours}</span>
                    </p>
                    {outlet.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-brand-rust flex-shrink-0" />
                        <span>{outlet.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-brand-green flex items-center gap-1">
                    <Map className="w-3.5 h-3.5" />
                    {isSelected ? 'Viewing on map' : 'Click to view map'}
                  </span>
                  <a
                    href={outlet.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-brand-burgundy font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Directions</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OutletList;
