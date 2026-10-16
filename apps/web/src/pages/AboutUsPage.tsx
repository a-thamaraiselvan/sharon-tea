import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrandIntroduction } from '@/components/about/BrandIntroduction';
import { MissionVisionValues } from '@/components/about/MissionVisionValues';
import { BrandAchievement } from '@/components/about/BrandAchievement';
import { Gallery } from '@/components/about/Gallery';
import { WhySharon } from '@/components/about/WhySharon';

export const AboutUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | The Sharon Tea and Coffee Heritage & Journey</title>
        <meta
          name="description"
          content="Learn about Sharon Tea and Coffee's roots, culinary heritage, 8,000+ cups served daily, and commitment to pure farm-fresh ingredients."
        />
      </Helmet>

      {/* 5 Distinct Sections In Order */}
      <BrandIntroduction />
      <MissionVisionValues />
      <BrandAchievement />
      <Gallery />
      <WhySharon />
    </>
  );
};

export default AboutUsPage;
