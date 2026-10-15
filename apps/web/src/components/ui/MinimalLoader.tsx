import React from 'react';
import { cn } from '@/utils/cn';

interface MinimalLoaderProps {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MinimalLoader: React.FC<MinimalLoaderProps> = ({
  className,
  text = 'Brewing Sharon moments...',
  size = 'md',
}) => {
  const spinnerSizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }[size];

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 min-h-[200px]', className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div
          className={cn(
            'rounded-full border-brand-green/20 border-t-brand-burgundy animate-spin',
            spinnerSizes
          )}
        />
        {/* Center Tea Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-brand-amber animate-ping" />
      </div>

      {text && (
        <p className="mt-4 text-xs font-medium tracking-wider uppercase text-neutral-500 font-sans animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default MinimalLoader;
