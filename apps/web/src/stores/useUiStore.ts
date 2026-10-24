import { create } from 'zustand';
import type { Product } from '@/types';

interface UiState {
  mobileMenuOpen: boolean;
  activeMenuCategory: string;
  searchModalOpen: boolean;
  activeDrawerProduct: Product | null;
  isCartEnabled: boolean;
  cartDrawerOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setActiveMenuCategory: (categoryId: string) => void;
  setSearchModalOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  setActiveDrawerProduct: (product: Product | null) => void;
  setIsCartEnabled: (enabled: boolean) => void;
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  activeMenuCategory: 'all',
  searchModalOpen: false,
  activeDrawerProduct: null,
  isCartEnabled: true,
  cartDrawerOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setActiveMenuCategory: (categoryId) => set({ activeMenuCategory: categoryId }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),
  setActiveDrawerProduct: (product) => set({ activeDrawerProduct: product }),
  setIsCartEnabled: (enabled) => set({ isCartEnabled: enabled }),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
}));

