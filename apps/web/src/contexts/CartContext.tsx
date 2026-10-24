import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getPublicProducts } from '@/services/productService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sharon_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore cart from localStorage:', e);
    }
    return [];
  });

  // Sync with live products to ensure prices are up to date
  const { data: liveProducts } = useQuery<Product[]>({
    queryKey: ['public-products'],
    queryFn: getPublicProducts,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!liveProducts || liveProducts.length === 0) return;

    setItems((currentItems) => {
      let hasChanges = false;
      const updated = currentItems.map((item) => {
        const fresh = liveProducts.find((p) => p.id === item.product.id);
        if (fresh) {
          const freshPrice = Number(fresh.price);
          const currentPrice = Number(item.product.price);
          if (
            freshPrice !== currentPrice ||
            fresh.name !== item.product.name ||
            fresh.imageUrl !== item.product.imageUrl ||
            fresh.inStock !== item.product.inStock
          ) {
            hasChanges = true;
            return {
              ...item,
              product: {
                ...item.product,
                ...fresh,
                price: freshPrice,
              },
            };
          }
        }
        return item;
      });

      return hasChanges ? updated : currentItems;
    });
  }, [liveProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { product, quantity: Math.max(1, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
