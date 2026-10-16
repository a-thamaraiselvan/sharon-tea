import React, { useState } from 'react';
import { generateProductOrderLink, type OrderProductInfo } from '@/utils/whatsappLink';
import { trackOrderClick } from '@/services/whatsappService';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WhatsAppOrderButtonProps {
  product: OrderProductInfo;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const WhatsAppOrderButton: React.FC<WhatsAppOrderButtonProps> = ({
  product,
  className,
  size = 'md',
  fullWidth = false,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    trackOrderClick({
      productName: product.name,
      quantity: product.quantity || 1,
      price: product.price || 0,
      source: 'whatsapp_order_button',
    });

    setClicked(true);
    setTimeout(() => setClicked(false), 2000);

    const link = generateProductOrderLink(product);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }[size];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl bg-brand-burgundy hover:bg-brand-rust text-white shadow-sm hover:shadow-warm transition-all duration-200 active:scale-95',
        sizeClasses,
        fullWidth && 'w-full',
        className
      )}
    >
      {clicked ? (
        <>
          <Check className="w-4 h-4 text-brand-leaf-green" />
          <span>Opening WhatsApp...</span>
        </>
      ) : (
        <>
          <WhatsAppIcon className="w-4 h-4 fill-current" />
          <span>Order on WhatsApp</span>
        </>
      )}
    </button>
  );
};

export default WhatsAppOrderButton;
