import React from 'react';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  dark = false,
}) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div className={cn('flex flex-col mb-10 md:mb-14', alignmentClasses, className)}>
      {badge && (
        <span
          className={cn(
            'inline-block px-3.5 py-1 text-xs font-semibold tracking-widest uppercase rounded-full mb-3 border',
            dark
              ? 'bg-brand-green/30 text-brand-amber border-brand-amber/30'
              : 'bg-brand-green/10 text-brand-green border-brand-green/20'
          )}
        >
          {badge}
        </span>
      )}

      <h2
        className={cn(
          'font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
          dark ? 'text-white' : 'text-brand-black',
          titleClassName
        )}
      >
        {title}
      </h2>

      {/* Decorative Tea Leaf Divider */}
      <div className="flex items-center gap-3 my-4">
        <span className={cn('h-[1px] w-12', dark ? 'bg-white/20' : 'bg-brand-burgundy/20')} />
        <svg
          viewBox="0 0 24 24"
          className={cn('w-5 h-5 flex-shrink-0', dark ? 'text-brand-amber' : 'text-brand-leaf-green')}
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <span className={cn('h-[1px] w-12', dark ? 'bg-white/20' : 'bg-brand-burgundy/20')} />
      </div>

      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base md:text-lg leading-relaxed font-normal',
            dark ? 'text-brand-cream/80' : 'text-neutral-600'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
