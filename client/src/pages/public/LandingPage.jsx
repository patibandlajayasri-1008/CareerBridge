import React from 'react';
import HeroSection from '../../components/landing/HeroSection';
import StatsSection from '../../components/landing/StatsSection';
import FeaturedJobs from '../../components/landing/FeaturedJobs';
import HowItWorks from '../../components/landing/HowItWorks';
import ValueProps from '../../components/landing/ValueProps';
import CtaBanner from '../../components/landing/CtaBanner';

export default function LandingPage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <FeaturedJobs />
      <HowItWorks />
      <ValueProps />
      <CtaBanner />
    </div>
  );
}
