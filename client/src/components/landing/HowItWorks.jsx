import React from 'react';
import { UserCheck, Search, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Build Your Profile',
      description:
        'Create your student account, input your academic records, highlight key technical skills, and upload an ATS-optimized PDF resume.',
      icon: UserCheck,
      badge: 'Step 1 • Profile Setup',
    },
    {
      number: '02',
      title: 'Discover Opportunities',
      description:
        'Explore verified on-campus and partner recruitment drives. Filter by domain, compensation, location, and graduation year eligibility.',
      icon: Search,
      badge: 'Step 2 • Smart Search',
    },
    {
      number: '03',
      title: 'Apply and Track Progress',
      description:
        'Submit applications with duplicate-proof validation. Monitor your real-time status as recruiters review, shortlist, and extend offers.',
      icon: Send,
      badge: 'Step 3 • Live Tracking',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3157D5]">
            Placement Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14213D]">
            How CareerBridge Works
          </h2>
          <p className="text-base text-[#667085] leading-relaxed">
            A frictionless, transparent recruitment process connecting students directly with verified corporate hiring managers.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#F6F8FC] rounded-2xl border border-[#E4E8F0] p-8 hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-[#3157D5]/20 font-mono">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E8F0] text-[#3157D5] flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="inline-block text-[11px] font-semibold tracking-wide text-[#3157D5] uppercase mb-2">
                    {step.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#14213D] mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#667085] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtext info */}
                <div className="pt-6 mt-6 border-t border-[#E4E8F0] flex items-center text-xs font-medium text-[#172033]">
                  <span>Instant Verification</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="text-[#168568]">100% Free for Students</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar below steps */}
        <div className="mt-12 text-center">
          <Link to="/register">
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
              Start Your Placement Journey
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
