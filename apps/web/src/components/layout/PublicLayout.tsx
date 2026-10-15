import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { ScrollToTop } from './ScrollToTop';
import { WhatsAppFAB } from './WhatsAppFAB';
import { ProductSlideDrawer } from '@/components/products/ProductSlideDrawer';
import { useUiStore } from '@/stores/useUiStore';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const PublicLayout: React.FC = () => {
  const { activeDrawerProduct, setActiveDrawerProduct } = useUiStore();

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-brand-black selection:bg-brand-burgundy selection:text-white">
      <ScrollToTop />
      <Header />
      <MobileNav />
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppFAB />
      <ProductSlideDrawer
        product={activeDrawerProduct}
        isOpen={Boolean(activeDrawerProduct)}
        onClose={() => setActiveDrawerProduct(null)}
      />
    </div>
  );
};

export default PublicLayout;
