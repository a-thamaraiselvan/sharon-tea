import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { PrivateRoute } from './PrivateRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { AdminLayout } from '../../components/layout/AdminLayout';

// Lazy-loaded pages
const LoginPage = lazy(() =>
  import('../../pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('../../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const MenuCategoriesPage = lazy(() =>
  import('../../pages/MenuCategoriesPage').then((m) => ({ default: m.MenuCategoriesPage }))
);
const MenuItemsPage = lazy(() =>
  import('../../pages/MenuItemsPage').then((m) => ({ default: m.MenuItemsPage }))
);
const ProductsPage = lazy(() =>
  import('../../pages/ProductsPage').then((m) => ({ default: m.ProductsPage }))
);
const ProductCategoriesPage = lazy(() =>
  import('../../pages/ProductCategoriesPage').then((m) => ({ default: m.ProductCategoriesPage }))
);
const WhatsAppAnalyticsPage = lazy(() =>
  import('../../pages/WhatsAppAnalyticsPage').then((m) => ({ default: m.WhatsAppAnalyticsPage }))
);
const FranchiseEnquiriesPage = lazy(() =>
  import('../../pages/FranchiseEnquiriesPage').then((m) => ({ default: m.FranchiseEnquiriesPage }))
);
const ContactEnquiriesPage = lazy(() =>
  import('../../pages/ContactEnquiriesPage').then((m) => ({ default: m.ContactEnquiriesPage }))
);
const OutletsPage = lazy(() =>
  import('../../pages/OutletsPage').then((m) => ({ default: m.OutletsPage }))
);
const GalleryPage = lazy(() =>
  import('../../pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const HeroSlidesPage = lazy(() =>
  import('../../pages/HeroSlidesPage').then((m) => ({ default: m.HeroSlidesPage }))
);
const DeliveryPartnersPage = lazy(() =>
  import('../../pages/DeliveryPartnersPage').then((m) => ({ default: m.DeliveryPartnersPage }))
);
const SettingsPage = lazy(() =>
  import('../../pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const ProfilePage = lazy(() =>
  import('../../pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#1C4C34' }} spin />} />
    <span className="mt-3 text-xs text-gray-500 font-medium">Loading Sharon Admin...</span>
  </div>
);

export const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public only: Login */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/menu-categories" element={<MenuCategoriesPage />} />
            <Route path="/menu-items" element={<MenuItemsPage />} />
            <Route path="/product-categories" element={<ProductCategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
            <Route path="/whatsapp-analytics" element={<WhatsAppAnalyticsPage />} />
            <Route path="/franchise-enquiries" element={<FranchiseEnquiriesPage />} />
            <Route path="/contact-enquiries" element={<ContactEnquiriesPage />} />
            <Route path="/outlets" element={<OutletsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/hero-slides" element={<HeroSlidesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};
