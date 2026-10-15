import { create } from 'zustand';
import type { Product } from '@/types';

interface UiState {
  mobileMenuOpen: boolean;
  activeMenuCategory: string;
  searchModalOpen: boolean;
  activeDrawerProduct: Product | null;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setActiveMenuCategory: (categoryId: string) => void;
  setSearchModalOpen: (open: boolean) => void;
  toggleSearchModal: () => void;
  setActiveDrawerProduct: (product: Product | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  activeMenuCategory: 'all',
  searchModalOpen: false,
  activeDrawerProduct: null,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setActiveMenuCategory: (categoryId) => set({ activeMenuCategory: categoryId }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),
  setActiveDrawerProduct: (product) => set({ activeDrawerProduct: product }),
}));

