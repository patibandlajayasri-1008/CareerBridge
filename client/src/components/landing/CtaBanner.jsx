import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import Button from '../common/Button';

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#14213D] text-white px-6 py-12 sm:px-12 sm:py-16 shadow-xl">
          {/* Subtle geometric pattern overlay */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#3157D5]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-[#6478F0]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-slate-200">
              <Shield className="w-3.5 h-3.5 text-[#6478F0]" />
              <span>Campus Recruitment Drive 2026</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Accelerate Your Career Placement?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Join thousands of graduating students building verified profiles, discovering dream roles, and accelerating their hiring journey today.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-[#3157D5] hover:bg-[#2444b0] shadow-md"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Create Student Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white"
                >
                  Explore Current Jobs
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free for Students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Instant Profile Setup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Direct Placement Cell Integration
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
