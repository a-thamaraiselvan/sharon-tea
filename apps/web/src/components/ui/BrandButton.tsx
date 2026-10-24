import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'burgundy' | 'outline' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  to?: string;
  isExternal?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const BrandButton: React.FC<BrandButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  isExternal = false,
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed select-none shadow-sm';

  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-2.5 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5 shadow-md',
  }[size];

  const variantClasses = {
    // Primary: Deep Black/Forest (#241C24) -> hover Burgundy (#541424)
    primary:
      'bg-brand-black text-white hover:bg-brand-burgundy shadow-sm hover:shadow-md focus:ring-brand-black font-semibold',
    // Secondary / Burgundy: Deep Burgundy (#541424) -> hover Rust (#7C2C0C)
    secondary:
      'bg-brand-burgundy text-white hover:bg-brand-rust shadow-sm hover:shadow-warm-lg focus:ring-brand-burgundy font-semibold',
    burgundy:
      'bg-brand-burgundy text-white hover:bg-brand-rust shadow-sm hover:shadow-warm-lg focus:ring-brand-burgundy font-semibold',
    // Amber: Rich Amber (#E67E17) -> hover Rust/Chai with crisp high contrast
    amber:
      'bg-[#E67E17] text-white font-bold hover:bg-[#C2410C] focus:ring-[#E67E17] shadow-sm',
    // Outline: Deep Black/Forest Border
    outline:
      'border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white focus:ring-brand-black font-semibold',
    // Ghost
    ghost:
      'text-brand-black hover:bg-black/5 focus:ring-brand-black shadow-none font-semibold',
  }[variant];

  const combinedClasses = cn(baseClasses, sizeClasses, variantClasses, className);

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {content}
    </button>
  );
};

export default BrandButton;
