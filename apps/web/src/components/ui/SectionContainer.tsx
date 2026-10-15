import React from 'react';
import { cn } from '@/utils/cn';

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  containerClassName?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
  background?: 'cream' | 'white' | 'forest' | 'dark' | 'transparent';
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  as: Component = 'section',
  className,
  containerClassName,
  size = 'default',
  background = 'transparent',
  children,
  ...props
}) => {
  const bgClasses = {
    cream: 'bg-brand-cream',
    white: 'bg-white',
    forest: 'bg-brand-green text-white',
    dark: 'bg-brand-black text-white',
    transparent: '',
  }[background];

  const maxWidthClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  }[size];

  return (
    <Component
      className={cn(
        'w-full py-16 md:py-24 relative overflow-hidden',
        bgClasses,
        className
      )}
      {...props}
    >
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidthClasses, containerClassName)}>
        {children}
      </div>
    </Component>
  );
};

export default SectionContainer;
