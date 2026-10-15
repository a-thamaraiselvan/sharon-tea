import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrandButton } from '@/components/ui/BrandButton';
import { Coffee, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Sharon Tea Stall</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-brand-cream text-center">
        <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-warm-lg">
          {/* Animated/illustrated cup */}
          <div className="w-20 h-20 rounded-full bg-brand-cream border-2 border-brand-green/20 flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-10 h-10 text-brand-burgundy" />
          </div>

          <span className="font-display text-5xl sm:text-6xl font-black text-brand-green block mb-2">
            404
          </span>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-3">
            This Cup Is Empty!
          </h1>

          <p className="text-sm text-neutral-600 leading-relaxed font-normal mb-8">
            The page you are looking for might have been spilled, moved, or never existed. Let's get you back to fresh tea.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <BrandButton
              to="/"
              variant="primary"
              size="md"
              icon={<Home className="w-4 h-4" />}
            >
              Return Home
            </BrandButton>
            <BrandButton
              to="/menu"
              variant="outline"
              size="md"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Explore Menu
            </BrandButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
