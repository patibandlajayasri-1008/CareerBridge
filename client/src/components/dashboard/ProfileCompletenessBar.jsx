import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

export default function ProfileCompletenessBar({ completeness }) {
  const { percentage, missingItems } = completeness;

  const isComplete = percentage >= 100;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3157D5]">
              Recruiter Visibility
            </span>
            <span className="text-xs text-[#667085]">•</span>
            <span className="text-xs font-medium text-[#172033]">
              {isComplete ? 'All verification criteria met' : `${100 - percentage}% more to reach maximum visibility`}
            </span>
          </div>
          <span className="text-sm font-bold text-[#14213D]">{percentage}% Complete</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 80 ? 'bg-[#3157D5]' : percentage >= 50 ? 'bg-[#B7791F]' : 'bg-[#C2414B]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status Text & Missing Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#667085]">
          {isComplete ? (
            <span className="flex items-center gap-1.5 text-[#168568] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Your academic profile & resume are 100% complete for campus drives.
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1 text-[#B7791F] font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing fields:
              </span>
              {missingItems.slice(0, 3).map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] capitalize text-[11px]"
                >
                  {item}
                </span>
              ))}
              {missingItems.length > 3 && (
                <span className="text-[11px] text-[#667085]">
                  +{missingItems.length - 3} more
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <Link to="/profile">
          <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
            Manage Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
