import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-[#3157D5]/10',
  iconColor = 'text-[#3157D5]',
  badgeText,
  badgeType = 'neutral',
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E8F0] p-5 shadow-xs hover:border-[#CBD5E1] transition-all duration-150 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213D] block">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {(subtext || badgeText) && (
        <div className="pt-3 mt-3 border-t border-[#F8FAFC] flex items-center justify-between text-xs">
          {subtext && <span className="text-[#667085]">{subtext}</span>}
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                badgeType === 'success'
                  ? 'bg-emerald-50 text-[#168568]'
                  : badgeType === 'primary'
                  ? 'bg-blue-50 text-[#3157D5]'
                  : 'bg-slate-100 text-[#475569]'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
