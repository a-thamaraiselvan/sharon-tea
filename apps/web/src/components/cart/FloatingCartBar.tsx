import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useUiStore } from '@/stores/useUiStore';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';
import { useLocation } from 'react-router-dom';

export const FloatingCartBar: React.FC = () => {
  const { totalItems, totalPrice } = useCart();
  const { isCartEnabled: uiCartEnabled, setCartDrawerOpen, cartDrawerOpen } = useUiStore();
  const { data: settings } = useBusinessSettings();
  const location = useLocation();

  const isCartEnabled =
    (settings as any)?.isCartEnabled ??
    (settings as any)?.is_cart_enabled ??
    uiCartEnabled;

  // Don't render on the full cart page or if cart is empty / disabled or drawer is open
  if (!isCartEnabled || totalItems === 0 || cartDrawerOpen || location.pathname === '/cart') {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideUp">
      <div
        onClick={() => setCartDrawerOpen(true)}
        className="cursor-pointer bg-brand-black text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between hover:bg-neutral-900 transition-all duration-200 active:scale-98 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-burgundy text-white flex items-center justify-center shrink-0 shadow-sm relative">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-brand-amber text-brand-black text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </div>

          <div>
            <div className="text-xs text-neutral-300 font-medium">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in Cart
            </div>
            <div className="font-display font-extrabold text-base sm:text-lg text-white font-sans">
              {formatPrice(totalPrice)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#119243] hover:bg-[#0E7B38] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0">
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
