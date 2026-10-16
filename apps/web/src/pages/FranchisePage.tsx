import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FranchiseHero } from '@/components/franchise/FranchiseHero';
import { FranchiseInfo } from '@/components/franchise/FranchiseInfo';
import { FranchiseFAQ } from '@/components/franchise/FranchiseFAQ';
import { FranchiseForm } from '@/components/franchise/FranchiseForm';

export const FranchisePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Franchise Opportunity | Grow With Sharon Tea and Coffee</title>
        <meta
          name="description"
          content="Open your own Sharon Tea and Coffee franchise. High ROI, turnkey operations, comprehensive barista training, and direct spice supplies. Apply online today."
        />
      </Helmet>

      {/* 4 Franchise Sections in Order */}
      <FranchiseHero />
      <FranchiseInfo />
      <FranchiseFAQ />
      <FranchiseForm />
    </>
  );
};

export default FranchisePage;
