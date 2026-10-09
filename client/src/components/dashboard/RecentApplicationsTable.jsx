import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ExternalLink, Inbox } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function RecentApplicationsTable({ applications }) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E4E8F0] p-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] text-[#667085] flex items-center justify-center mx-auto">
          <Inbox className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-[#14213D]">
            No Applications Submitted Yet
          </h4>
          <p className="text-xs text-[#667085] max-w-sm mx-auto">
            You haven’t applied for any campus recruitment drives yet. Explore active opportunities to submit your profile.
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
            Explore Placement Drives
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] overflow-hidden shadow-xs">
      <div className="p-6 border-b border-[#E4E8F0] flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#14213D]">
            Recent Placement Applications
          </h3>
          <p className="text-xs text-[#667085]">
            Live status of your submitted candidatures
          </p>
        </div>
        <Link to="/applications">
          <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
            View All ({applications.length})
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] border-b border-[#E4E8F0] text-[#667085] uppercase tracking-wider font-semibold">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Role & Company
              </th>
              <th scope="col" className="px-6 py-3.5">
                Type
              </th>
              <th scope="col" className="px-6 py-3.5">
                Package
              </th>
              <th scope="col" className="px-6 py-3.5">
                Applied Date
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {applications.slice(0, 5).map((app) => (
              <tr
                key={app.id}
                className="hover:bg-[#F8FAFC] transition-colors duration-100"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${app.logoBg || 'bg-[#14213D]'} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                    >
                      {app.companyCode || 'CB'}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#14213D] block">
                        {app.jobTitle}
                      </span>
                      <span className="text-[#667085] text-xs">
                        {app.company}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#172033] font-medium">
                  {app.employmentType}
                </td>
                <td className="px-6 py-4 font-semibold text-[#168568]">
                  {app.salaryRange}
                </td>
                <td className="px-6 py-4 text-[#667085]">
                  {new Date(app.appliedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={app.status}>{app.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="inline-flex items-center gap-1 text-[#3157D5] hover:text-[#2444b0] font-semibold text-xs transition-colors"
                  >
                    <span>View Role</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
