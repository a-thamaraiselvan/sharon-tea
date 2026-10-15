import React from 'react';
import { cn } from '@/utils/cn';

interface MapEmbedProps {
  embedUrl?: string;
  title?: string;
  className?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({
  embedUrl = 'https://maps.google.com/maps?q=%2334,+2nd+Main+Road,+1st+Stage,+Indiranagar,+Bangalore+-+560038&t=&z=15&ie=UTF8&iwloc=&output=embed',
  title = 'Sharon Tea Stall Google Map',
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/90 relative bg-neutral-100',
        className
      )}
    >
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
    </div>
  );
};

export default MapEmbed;
