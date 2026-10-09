import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Briefcase,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  Inbox,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import StudentNav from '../../components/dashboard/StudentNav';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function MyApplications() {
  const { applications } = useStudent();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedTimelineApp, setSelectedTimelineApp] = useState(null);

  const tabs = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'All') return true;
    return app.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      <StudentNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E8F0]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              My Placement Applications
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Track your real-time review progress, assessment stages, and campus recruiter decisions.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="primary" size="md" icon={Briefcase}>
              Explore More Drives
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#E4E8F0]">
          {tabs.map((tab) => {
            const count =
              tab === 'All'
                ? applications.length
                : applications.filter((a) => a.status === tab).length;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-[#3157D5] text-white shadow-2xs'
                    : 'text-[#667085] hover:text-[#14213D] hover:bg-white'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-[#F1F5F9] text-[#667085]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content: Table for Desktop / Cards for Mobile */}
        {filteredApplications.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] text-[#667085] flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#14213D]">
                No applications in "{activeTab}"
              </h3>
              <p className="text-xs text-[#667085]">
                {activeTab === 'All'
                  ? 'You haven’t applied for any campus recruitment drives yet.'
                  : `None of your applications are currently in the '${activeTab}' stage.`}
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" size="sm">
                Browse Campus Opportunities
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E8F0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E4E8F0] text-[#667085] uppercase tracking-wider font-semibold">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Company & Role
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Compensation
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Current Stage
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F8FAFC] transition-colors duration-100"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${app.logoBg || 'bg-[#14213D]'} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            {app.companyCode || 'CB'}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#14213D] block">
                              {app.jobTitle}
                            </span>
                            <span className="text-xs text-[#667085]">
                              {app.company}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#667085]">
                        {app.location}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#172033]">
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTimelineApp(app)}
                            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#14213D] font-medium text-xs transition-colors"
                          >
                            Timeline
                          </button>
                          <Link
                            to={`/jobs/${app.jobId}`}
                            className="p-1 text-[#667085] hover:text-[#3157D5] transition-colors"
                            aria-label="View job specs"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Status Timeline Modal */}
      {selectedTimelineApp && (
        <Modal
          isOpen={!!selectedTimelineApp}
          onClose={() => setSelectedTimelineApp(null)}
          title={`Application Status • ${selectedTimelineApp.jobTitle}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#667085]">
                  {selectedTimelineApp.company}
                </span>
                <h4 className="text-sm font-bold text-[#14213D]">
                  {selectedTimelineApp.jobTitle}
                </h4>
              </div>
              <Badge variant={selectedTimelineApp.status}>
                {selectedTimelineApp.status}
              </Badge>
            </div>

            {/* Stepper progression */}
            <div className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Verification & Review History
              </h5>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E8F0]">
                {selectedTimelineApp.statusHistory?.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-1">
                    <div className="w-5 h-5 rounded-full bg-[#3157D5] text-white flex items-center justify-center shrink-0 z-10 text-[10px] font-bold">
                      ✓
                    </div>
                    <div className="space-y-0.5 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#14213D]">
                          {step.status}
                        </span>
                        <span className="text-[11px] text-[#667085]">
                          {new Date(step.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed">
                        {step.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E8F0] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTimelineApp(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
