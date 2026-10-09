import React from 'react';
import { Building, Users, Award, TrendingUp, Info } from 'lucide-react';
import { DEMO_PLATFORM_STATS } from '../../data/sampleJobs';

export default function StatsSection() {
  const stats = [
    {
      label: 'Campus Recruiters',
      value: DEMO_PLATFORM_STATS.recruitersCount,
      description: 'Actively participating companies',
      icon: Building,
      color: 'text-[#3157D5]',
    },
    {
      label: 'Graduates Placed',
      value: DEMO_PLATFORM_STATS.placementsCount,
      description: 'Verified student appointments',
      icon: Users,
      color: 'text-[#168568]',
    },
    {
      label: 'Highest Package',
      value: DEMO_PLATFORM_STATS.highestPackage,
      description: 'Offered in current recruitment cycle',
      icon: Award,
      color: 'text-[#B7791F]',
    },
    {
      label: 'Placement Conversion',
      value: DEMO_PLATFORM_STATS.placementRate,
      description: 'Shortlist-to-offer ratio',
      icon: TrendingUp,
      color: 'text-[#6478F0]',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Development environment transparency badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#667085]">
            <Info className="w-3.5 h-3.5 text-[#3157D5]" />
            <span>Sample Platform Benchmarks (Pre-Production Simulation)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] hover:border-[#CBD5E1] transition-all duration-150"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-white border border-[#E4E8F0] ${stat.color}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight text-[#14213D] mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
