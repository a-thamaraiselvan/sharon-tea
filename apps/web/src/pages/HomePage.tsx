import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroSection } from '@/components/home/HeroSection';
import { BrandHighlights } from '@/components/home/BrandHighlights';
import { FeaturedMenu } from '@/components/home/FeaturedMenu';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandStoryPreview } from '@/components/home/BrandStoryPreview';
import { FranchisePromo } from '@/components/home/FranchisePromo';
import { VisitSharonSection } from '@/components/home/VisitSharonSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sharon Tea Stall | Every Cup, A Moment to Savour</title>
        <meta
          name="description"
          content="Discover the comforting taste of tea, refreshing beverages, and signature flavours crafted for every moment at Sharon Tea Stall. Over 8,000+ cups served daily."
        />
        <meta
          name="keywords"
          content="Sharon Tea, Chai, Masala Tea, Filter Coffee, Tea Stall, Tea Franchise Chennai"
        />
      </Helmet>

      {/* Home Page Sections In Specified Order */}
      <HeroSection />
      <BrandHighlights />
      <FeaturedMenu />
      <FeaturedProducts />
      <BrandStoryPreview />
      <FranchisePromo />
      <VisitSharonSection />
    </>
  );
};

export default HomePage;
