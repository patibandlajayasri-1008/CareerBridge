import React from 'react';
import { LayoutDashboard, Briefcase, Users, Plus, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

export default function AdminNav({ activeTab, onTabChange, onOpenCreateModal }) {
  const tabs = [
    { id: 'overview', label: 'Placement Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Manage Drives', icon: Briefcase },
    { id: 'applications', label: 'Candidate Applications', icon: Users },
  ];

  return (
    <div className="bg-white border-b border-[#E4E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-0 sm:h-16 gap-4">
          {/* Section Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#6478F0]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#14213D] tracking-tight">
                Placement Admin Portal
              </h2>
              <p className="text-[10px] text-[#667085]">
                Corporate Relations & Drive Management
              </p>
            </div>
          </div>

          {/* Navigation Tab Pills */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3157D5] text-white shadow-2xs'
                      : 'text-[#667085] hover:text-[#14213D] hover:bg-[#F6F8FC]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action: Post New Opportunity */}
          <div className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={onOpenCreateModal}
            >
              Post New Drive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
