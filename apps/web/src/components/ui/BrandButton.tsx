import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber';
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
    // Primary: Burgundy (#541424)
    primary:
      'bg-brand-burgundy text-white hover:bg-brand-rust hover:shadow-warm-lg focus:ring-brand-burgundy',
    // Secondary: Forest Green (#1C4C34)
    secondary:
      'bg-brand-green text-white hover:bg-brand-black hover:shadow-green-subtle focus:ring-brand-green',
    // Outline: Border Burgundy or Forest Green
    outline:
      'border-2 border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white focus:ring-brand-burgundy',
    // Amber: Amber Highlight (#FC9C34)
    amber:
      'bg-brand-amber text-brand-black font-semibold hover:bg-[#e08928] focus:ring-brand-amber shadow-warm',
    // Ghost
    ghost:
      'text-brand-green hover:bg-brand-green/10 focus:ring-brand-green shadow-none',
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
