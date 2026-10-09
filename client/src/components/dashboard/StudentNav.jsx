import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, UserCheck, Briefcase } from 'lucide-react';

export default function StudentNav() {
  const links = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Applications', to: '/applications', icon: FileText },
    { label: 'Profile & Resume', to: '/profile', icon: UserCheck },
    { label: 'Browse Jobs', to: '/jobs', icon: Briefcase },
  ];

  return (
    <div className="border-b border-[#E4E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5" aria-label="Student portal navigation">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#3157D5]/10 text-[#3157D5]'
                      : 'text-[#667085] hover:text-[#14213D] hover:bg-[#F6F8FC]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
