import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { MinimalLoader } from '@/components/ui/MinimalLoader';
import HomePage from '@/pages/HomePage';
import AboutUsPage from '@/pages/AboutUsPage';
import MenuPage from '@/pages/MenuPage';
import ProductsPage from '@/pages/ProductsPage';
import FranchisePage from '@/pages/FranchisePage';
import VisitUsPage from '@/pages/VisitUsPage';
import CartPage from '@/pages/CartPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-cream">
          <MinimalLoader text="Pouring fresh Sharon tea..." size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="franchise" element={<FranchisePage />} />
          <Route path="visit-us" element={<VisitUsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
