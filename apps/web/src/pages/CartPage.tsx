import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatPrice';
import { resolveImageUrl } from '@/utils/imageUrl';
import { createWhatsAppBulkOrderUrl } from '@/utils/whatsappLink';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { BrandButton } from '@/components/ui/BrandButton';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles, Package } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

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
    <>
      <Helmet>
        <title>Your Cart | Sharon Tea and Coffee</title>
        <meta
          name="description"
          content="Review your selected Sharon Tea and Coffee retail packs and place a bulk order directly via WhatsApp."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-brand-green text-white py-12 md:py-16 border-b border-brand-leaf-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-brand-cream/80 hover:text-white mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tea Blends</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/30 text-xs font-semibold mb-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Bulk Ordering & Cart</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
                Your Order Summary
              </h1>
            </div>
            {totalItems > 0 && (
              <div className="text-brand-cream/80 text-sm font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <SectionContainer background="cream" className="py-12 md:py-20 min-h-[50vh]">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-white rounded-3xl border border-[#F3ECE0] shadow-warm">
            <div className="w-20 h-20 rounded-full bg-[#FAF6EF] flex items-center justify-center text-brand-green/60 mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-display font-bold text-2xl text-brand-black">Your Cart is Empty</h2>
            <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
              You haven't added any of our authentic estate tea blends yet. Explore our signature packs to order directly via WhatsApp!
            </p>
            <div className="mt-8">
              <BrandButton to="/products" variant="primary" size="md">
                Explore Tea Packs
              </BrandButton>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 8 Cols: Item List */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#F3ECE0] shadow-warm p-4 sm:p-6 md:p-8">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-black">
                  Items ({totalItems})
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-500 underline transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {items.map((item) => {
                  const img = resolveImageUrl(item.product.imageUrl);
                  const weight = item.product.weight || item.product.packSize;
                  const lineTotal = Number(item.product.price || 0) * item.quantity;

                  return (
                    <div key={item.product.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF6EF] border border-[#F3ECE0] overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img
                          src={img}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/img_3704.png';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-neutral-900">
                              {item.product.name}
                            </h3>
                            {weight && (
                              <span className="inline-block text-xs font-semibold text-neutral-500 mt-0.5">
                                {weight}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-red-500 p-1 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-1">
                          {/* Stepper */}
                          <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 px-2 py-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-brand-black transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right">
                            <div className="font-bold text-base sm:text-lg text-neutral-900 font-sans">
                              {formatPrice(lineTotal)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-neutral-400">
                                {formatPrice(item.product.price)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-brand-green hover:underline font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Add More Products</span>
                </Link>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary & Bulk WhatsApp Checkout */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#F3ECE0] shadow-warm p-6 md:p-8 space-y-6 sticky top-24">
              <h2 className="font-display font-bold text-xl text-brand-black border-b border-neutral-100 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-neutral-900 font-sans">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Packaging & Sealing</span>
                  <span className="text-brand-green font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                    FREE
                  </span>
                </div>
                <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                  <span className="font-bold text-base text-neutral-900">Total</span>
                  <span className="font-display font-bold text-2xl text-brand-black font-sans">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Bulk WhatsApp Order Button */}
              <a
                href={bulkOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#119243] hover:bg-[#0E7B38] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white shrink-0" />
                <span>Place Order via WhatsApp</span>
              </a>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-neutral-600">
                  <Package className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Freshly roasted & packed whole Assam CTC leaves with fresh spices.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Direct order fulfillment with our Sharon Tea & Coffee central team.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-600">
                  <Sparkles className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <span>Payment and delivery details confirmed in direct chat.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionContainer>
    </>
  );
};

export default CartPage;
