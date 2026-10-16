import React from 'react';
import { cn } from '@/utils/cn';

interface SharonLogoProps {
  className?: string;
  variant?: 'full' | 'badge' | 'text-only' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SharonLogo: React.FC<SharonLogoProps> = ({
  className,
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  }[size];

  if (variant === 'badge') {
    return (
      <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
        <img
          src="/Sharon_logo.jpg"
          alt="Sharon Tea and Coffee"
          className={cn(
            'rounded-full object-cover aspect-square shadow-md border border-brand-black/15',
            sizeClasses
          )}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={cn('flex flex-col justify-center leading-none select-none', className)}>
        <span
          className={cn(
            'font-display font-extrabold tracking-tight text-brand-green',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl sm:text-2xl',
            size === 'lg' && 'text-2xl sm:text-3xl',
            size === 'xl' && 'text-3xl sm:text-4xl'
          )}
        >
          SHARON
        </span>
        <span
          className={cn(
            'font-semibold uppercase tracking-[0.25em] text-brand-burgundy',
            size === 'sm' && 'text-[9px]',
            size === 'md' && 'text-[10px] sm:text-[11px]',
            size === 'lg' && 'text-[12px] sm:text-[13px]',
            size === 'xl' && 'text-sm'
          )}
        >
          Tea & Coffee
        </span>
      </div>
    );
  }

  // Full Horizontal Brand Lockup (Official Emblem Image + Refined Typography)
  return (
    <div className={cn('flex items-center gap-2.5 sm:gap-3 group select-none', className)}>
      <div className={cn('relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105', sizeClasses)}>
        <img
          src="/Sharon_logo.jpg"
          alt="Sharon Tea and Coffee"
          className={cn(
            'h-full w-full rounded-full object-cover aspect-square',
            variant === 'light'
              ? 'border-2 border-white/20 ring-1 ring-white/20 shadow-md'
              : 'border border-brand-black/15 shadow-sm'
          )}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      <div className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            'font-display font-extrabold tracking-tight',
            variant === 'light' ? 'text-white' : 'text-brand-green',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-xl sm:text-2xl',
            size === 'lg' && 'text-2xl sm:text-3xl',
            size === 'xl' && 'text-3xl sm:text-4xl'
          )}
        >
          SHARON
        </span>
        <span
          className={cn(
            'font-semibold uppercase tracking-[0.25em]',
            variant === 'light' ? 'text-brand-amber' : 'text-brand-burgundy',
            size === 'sm' && 'text-[9px]',
            size === 'md' && 'text-[10px] sm:text-[11px]',
            size === 'lg' && 'text-[12px] sm:text-[13px]',
            size === 'xl' && 'text-sm'
          )}
        >
          Tea & Coffee
        </span>
      </div>
    </div>
  );
};

export default SharonLogo;
