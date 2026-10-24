import React from 'react';
import { Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUiStore } from '@/stores/useUiStore';
import { formatPrice } from '@/utils/formatPrice';
import { resolveImageUrl } from '@/utils/imageUrl';
import { createWhatsAppBulkOrderUrl } from '@/utils/whatsappLink';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { cartDrawerOpen, setCartDrawerOpen } = useUiStore();

  const handleClose = () => {
    setCartDrawerOpen(false);
  };

  const bulkOrderUrl = createWhatsAppBulkOrderUrl(
    items
      .filter((i) => i.product.inStock !== false)
      .map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: Number(i.product.price || 0),
        weight: i.product.weight || i.product.packSize,
      })),
    totalPrice
  );

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-green" />
            <span className="font-display font-bold text-lg text-brand-black">Your Cart</span>
            {totalItems > 0 && (
              <span className="bg-brand-burgundy text-white text-xs px-2 py-0.5 rounded-full font-bold font-sans">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      }
      placement="right"
      onClose={handleClose}
      open={cartDrawerOpen}
      closeIcon={<X className="w-5 h-5 text-neutral-500 hover:text-brand-black" />}
      width={typeof window !== 'undefined' && window.innerWidth < 420 ? '100%' : 380}
      styles={{
        header: {
          borderBottom: '1px solid #F3ECE0',
          padding: '16px 20px',
          background: '#FAF6EF',
        },
        body: {
          padding: '16px 20px',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div className="flex flex-col h-full">
        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 pr-1 -mr-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EF] flex items-center justify-center text-brand-green/60 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-800">Your cart is empty</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-[220px]">
                Add our signature handcrafted tea pouches to order in bulk on WhatsApp.
              </p>
              <Link
                to="/products"
                onClick={handleClose}
                className="mt-6 inline-flex items-center gap-2 bg-brand-green hover:bg-brand-leaf-green text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>Browse Tea Packs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const img = resolveImageUrl(item.product.imageUrl);
              const weight = item.product.weight || item.product.packSize;
              const lineTotal = Number(item.product.price || 0) * item.quantity;

              return (
                <div key={item.product.id} className="py-3.5 flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#FAF6EF] border border-[#F3ECE0] overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/img_3704.png';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-red-500 p-0.5 transition-colors shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {weight && (
                      <span className="inline-block text-[10px] text-neutral-500 font-medium">
                        {weight}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 px-1 py-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-xs sm:text-sm text-neutral-900">
                          {formatPrice(lineTotal)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-neutral-400">
                            {formatPrice(item.product.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {items.length > 0 && (
          <div className="pt-4 mt-auto border-t border-neutral-100 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                Estimated Total
              </span>
              <span className="font-display font-bold text-lg sm:text-xl text-brand-black">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <a
              href={bulkOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#119243] hover:bg-[#0E7B38] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
              <span>Checkout via WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <Link
                to="/cart"
                onClick={handleClose}
                className="text-brand-green hover:underline font-semibold"
              >
                View Full Cart
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-neutral-400 hover:text-red-500 underline transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
