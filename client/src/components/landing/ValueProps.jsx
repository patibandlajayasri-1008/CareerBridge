import React from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  FileCheck,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function ValueProps() {
  const benefits = [
    {
      title: 'Verified Corporate Drives',
      description:
        'Zero spam, zero ghost jobs. Every listing is published and authenticated directly by authorized campus recruitment coordinators.',
      icon: ShieldCheck,
      color: 'text-[#3157D5]',
      bg: 'bg-[#3157D5]/10',
    },
    {
      title: 'Real-Time Application Tracking',
      description:
        'Transparent status progression across five distinct review stages: Applied, Under Review, Shortlisted, Selected, and Rejected.',
      icon: Zap,
      color: 'text-[#168568]',
      bg: 'bg-[#168568]/10',
    },
    {
      title: 'Zero-Trust Role-Based Access',
      description:
        'Secure authorization boundary separating student permissions from administrative controls, backed by server-side verification.',
      icon: Lock,
      color: 'text-[#14213D]',
      bg: 'bg-[#14213D]/10',
    },
    {
      title: 'Atomic Duplicate Prevention',
      description:
        'Database-level compound unique indexing guarantees students can never accidentally submit duplicate applications to the same drive.',
      icon: Layers,
      color: 'text-[#6478F0]',
      bg: 'bg-[#6478F0]/10',
    },
    {
      title: 'Secure PDF Resume Storage',
      description:
        'Strict MIME-type validation and size controls protect candidate resumes, ensuring documents are accessible only to verified hiring staff.',
      icon: FileCheck,
      color: 'text-[#B7791F]',
      bg: 'bg-[#B7791F]/10',
    },
    {
      title: 'Comprehensive Placement Insights',
      description:
        'Placement coordinators gain high-resolution analytics into student application velocities, shortlisting ratios, and hiring trends.',
      icon: BarChart3,
      color: 'text-[#3157D5]',
      bg: 'bg-[#3157D5]/10',
    },
  ];

  return (
    <section id="benefits" className="py-16 sm:py-24 bg-[#F6F8FC] border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3157D5]">
            Why CareerBridge
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14213D]">
            Engineered for Modern Campus Recruitment
          </h2>
          <p className="text-base text-[#667085] leading-relaxed">
            Eliminating chaos, unvetted spreadsheets, and opaque placement processes with a purpose-built, secure platform.
          </p>
        </div>

        {/* Feature Grid (2x3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-xl border border-[#E4E8F0] p-6 hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-lg ${benefit.bg} ${benefit.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-[#14213D] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F8FAFC] flex items-center gap-1.5 text-[11px] font-medium text-[#168568]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Production-Grade Architecture</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
