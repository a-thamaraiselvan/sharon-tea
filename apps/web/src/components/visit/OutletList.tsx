import React, { useState, useMemo } from 'react';
import type { Outlet } from '@/types';
import { MapEmbed } from './MapEmbed';
import { MinimalLoader } from '@/components/ui/MinimalLoader';
import { MapPin, Clock, Phone, Navigation, LocateFixed, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getWhatsAppNumber } from '@/utils/whatsappLink';

interface OutletListProps {
  outlets?: Outlet[];
  isLoading?: boolean;
}

// Known coordinates for Sharon Tea and Coffee outlets in Bangalore
const DEFAULT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'outlet-1': { lat: 12.9719, lng: 77.6412 }, // Indiranagar Head Branch
  'outlet-2': { lat: 12.9723, lng: 77.6534 }, // New Thippasandra
  'outlet-3': { lat: 12.9847, lng: 77.6766 }, // Kaggadasapura
};

function getOutletCoords(outlet: Outlet): { lat: number; lng: number } {
  if (outlet.latitude && outlet.longitude) {
    return { lat: Number(outlet.latitude), lng: Number(outlet.longitude) };
  }
  if (DEFAULT_COORDINATES[outlet.id]) {
    return DEFAULT_COORDINATES[outlet.id];
  }
  const nameOrAddress = `${outlet.name} ${outlet.address}`.toLowerCase();
  if (nameOrAddress.includes('indiranagar')) {
    return { lat: 12.9719, lng: 77.6412 };
  }
  if (nameOrAddress.includes('thippasandra')) {
    return { lat: 12.9723, lng: 77.6534 };
  }
  if (nameOrAddress.includes('kaggadasapura')) {
    return { lat: 12.9847, lng: 77.6766 };
  }
  return { lat: 12.9716, lng: 77.5946 }; // Default Central Bangalore
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const OutletList: React.FC<OutletListProps> = ({ outlets = [], isLoading = false }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  // Compute distance for each outlet when user location is available
  const outletsWithDistance = useMemo(() => {
    return outlets.map((outlet) => {
      if (!userLocation) {
        return { ...outlet, distanceKm: undefined };
      }
      const coords = getOutletCoords(outlet);
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng);
      return { ...outlet, distanceKm: dist };
    });
  }, [outlets, userLocation]);

  // Sort outlets: nearest first if location available
  const sortedOutlets = useMemo(() => {
    if (!userLocation) return outletsWithDistance;
    return [...outletsWithDistance].sort((a, b) => {
      const distA = a.distanceKm ?? Infinity;
      const distB = b.distanceKm ?? Infinity;
      return distA - distB;
    });
  }, [outletsWithDistance, userLocation]);

  const currentSelection = selectedOutlet || sortedOutlets[0] || outlets[0];
  const nearestOutlet = userLocation && sortedOutlets.length > 0 ? sortedOutlets[0] : null;

  const handleFindNearby = () => {
    setLocationError(null);
    setLocationSuccess(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setIsLocating(false);

        // Find nearest outlet immediately
        let closest: (typeof outletsWithDistance)[0] | null = null;
        let minDistance = Infinity;

        outlets.forEach((o) => {
          const coords = getOutletCoords(o);
          const dist = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = { ...o, distanceKm: dist };
          }
        });

        if (closest) {
          setSelectedOutlet(closest);
          setLocationSuccess(
            `Found your nearest stall: ${(closest as any).name} (${minDistance} km away)`
          );
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            'Location permission was denied. Please allow location access in your browser settings to find the nearest outlet.'
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location information is currently unavailable. Please try again.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out. Please try again.');
        } else {
          setLocationError('Unable to retrieve your location. Please select an outlet manually below.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  if (isLoading) {
    return <MinimalLoader text="Locating Sharon outlets..." />;
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* "Find Nearby" Location Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
            <LocateFixed className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-brand-black">
              Find Sharon Outlets Near You
            </h4>
            <p className="text-xs text-neutral-500">
              {userLocation
                ? `Sorted by proximity to your current location`
                : 'Click "Find Nearby" to detect your closest Sharon Tea and Coffee'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFindNearby}
          disabled={isLocating}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-black text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <LocateFixed className="w-4 h-4 text-white" />
              <span>{userLocation ? 'Update Nearby Location' : 'Find Nearby'}</span>
            </>
          )}
        </button>
      </div>

      {/* Location Status Alerts */}
      {locationSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{locationSuccess}</span>
        </div>
      )}

      {locationError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Featured Outlet with Interactive Map */}
      {currentSelection && (
        <div
          className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-warm-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal-up"
        >
          <div className="lg:col-span-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-green bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
                Selected Outlet
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green/5 text-xs font-bold text-brand-green border border-brand-green/20">
                <span className="w-2 h-2 rounded-full bg-brand-leaf-green animate-pulse" />
                Open Now
              </span>
              {nearestOutlet && nearestOutlet.id === currentSelection.id && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Closest to You
                </span>
              )}
              {currentSelection.distanceKm !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-amber/15 text-brand-chai text-xs font-extrabold border border-brand-amber/30">
                  <LocateFixed className="w-3.5 h-3.5" />
                  {currentSelection.distanceKm} km away
                </span>
              )}
            </div>

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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-burgundy hover:bg-brand-rust text-white text-xs font-semibold shadow-sm transition-all button-interaction cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>

              <a
                href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(
                  `Hello Sharon Tea and Coffee! I want directions to ${currentSelection.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-green/30 text-brand-green hover:bg-brand-green/5 text-xs font-semibold transition-all button-interaction cursor-pointer"
              >
                <span>WhatsApp Location</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed Container with smooth reveal */}
          <div className="lg:col-span-7 reveal-fade relative z-10">
            <MapEmbed
              embedUrl={currentSelection.embedUrl}
              title={`${currentSelection.name} Map`}
            />
          </div>
        </div>
      )}

      {/* Grid of all outlets */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-6 reveal-up">
          <h4 className="font-display text-2xl font-bold text-brand-black">
            All Sharon Outlets ({sortedOutlets.length})
          </h4>
          {userLocation && (
            <span className="text-xs font-bold text-brand-green bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
              ✓ Ordered by Distance
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
          {sortedOutlets.map((outlet, index) => {
            const isSelected = currentSelection?.id === outlet.id;
            const isClosest = nearestOutlet && nearestOutlet.id === outlet.id;

            return (
              <div
                key={outlet.id}
                onClick={() => setSelectedOutlet(outlet)}
                style={{ '--reveal-delay': `${(index % 3) * 60}ms` } as React.CSSProperties}
                className={cn(
                  'cursor-pointer bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between hover-lift reveal-up relative',
                  isSelected
                    ? 'border-brand-green ring-2 ring-brand-green/20 shadow-warm'
                    : isClosest
                    ? 'border-emerald-500/60 shadow-xs'
                    : 'border-neutral-200/80 hover:border-brand-green/40'
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-brand-leaf-green">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-leaf-green animate-pulse" />
                        <span>Open Now</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-brand-black">
                        {outlet.name}
                      </h4>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {outlet.isMainBranch && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber flex-shrink-0">
                          Main
                        </span>
                      )}
                      {isClosest && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">
                          Nearest
                        </span>
                      )}
                    </div>
                  </div>

                  {outlet.distanceKm !== undefined && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#F3ECE0] text-xs font-bold text-brand-chai">
                      <LocateFixed className="w-3.5 h-3.5" />
                      <span>{outlet.distanceKm} km away</span>
                    </div>
                  )}

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

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-brand-green">
                    {isSelected ? '✓ Viewing on Map' : 'Click to View on Map'}
                  </span>
                  <Navigation className="w-3.5 h-3.5 text-brand-green" />
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
