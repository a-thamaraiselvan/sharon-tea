import React from 'react';
import type { Outlet } from '@/types';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { cn } from '@/utils/cn';

interface OutletCardProps {
  outlet: Outlet;
  className?: string;
}

export const OutletCard: React.FC<OutletCardProps> = ({ outlet, className }) => {
  if (!outlet) return null;

  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border border-neutral-200/80 shadow-sm hover-lift overflow-hidden flex flex-col justify-between',
        className
      )}
    >
      {/* Top Image (if present) */}
      {outlet.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-brand-cream image-zoom-container">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {outlet.isMainBranch && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-burgundy text-white shadow-sm">
                Flagship Outlet
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-brand-green shadow-xs border border-white/40">
              <span className="w-2 h-2 rounded-full bg-brand-leaf-green animate-pulse" />
              Open Now
            </span>
          </div>
          <img
            src={outlet.imageUrl}
            alt={outlet.name || 'Sharon Tea and Coffee Outlet'}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover image-zoom"
          />
        </div>
      )}

      {/* Outlet Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {!outlet.imageUrl && (
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-brand-leaf-green">
              <span className="w-2 h-2 rounded-full bg-brand-leaf-green animate-pulse" />
              <span>Open Now</span>
            </div>
          )}
          <h3 className="font-display text-xl font-bold text-brand-black group-hover:text-brand-green transition-colors">
            {outlet.name}
          </h3>

          <div className="mt-4 space-y-2.5 text-sm text-neutral-600">
            {/* Address */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
              <span>
                {outlet.address}, {outlet.city}, {outlet.state}
                {outlet.pincode ? ` - ${outlet.pincode}` : ''}
              </span>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-amber flex-shrink-0" />
              <span>{outlet.hours}</span>
            </div>

            {/* Phone */}
            {outlet.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-rust flex-shrink-0" />
                <a
                  href={`tel:${outlet.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-brand-burgundy transition-colors"
                >
                  {outlet.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <a
            href={outlet.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-black transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </a>

          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hello! I would like to visit Sharon Tea and Coffee (${outlet.name}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-400 hover:text-brand-burgundy transition-colors"
          >
            Contact Stall
          </a>
        </div>
      </div>
    </div>
  );
};

export default OutletCard;
