import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[#E2E8F0] rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E4E8F0] p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="w-24 h-3.5" />
            <Skeleton className="w-36 h-4.5" />
          </div>
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>

      <div className="flex gap-4 pt-1">
        <Skeleton className="w-28 h-3.5" />
        <Skeleton className="w-24 h-3.5" />
        <Skeleton className="w-32 h-3.5" />
      </div>

      <div className="space-y-1.5 pt-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-4/5 h-3" />
      </div>

      <div className="flex gap-2 pt-2">
        <Skeleton className="w-14 h-5 rounded" />
        <Skeleton className="w-14 h-5 rounded" />
        <Skeleton className="w-14 h-5 rounded" />
      </div>

      <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-center">
        <Skeleton className="w-28 h-3.5" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
}
