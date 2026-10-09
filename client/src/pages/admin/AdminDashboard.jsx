import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Briefcase,
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building,
} from 'lucide-react';
import AdminNav from '../../components/admin/AdminNav';
import JobFormModal from '../../components/admin/JobFormModal';
import ApplicationReviewModal from '../../components/admin/ApplicationReviewModal';
import StatCard from '../../components/dashboard/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { adminService } from '../../services/adminService';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import { INITIAL_STUDENT_APPLICATIONS, INITIAL_STUDENT_PROFILE } from '../../data/sampleStudent';

// Fallback seed admin data for preview/testing with distinct resumes per student
const SEED_APPLICATIONS = [
  {
    id: 'app-seed-1',
    _id: 'app-seed-1',
    jobId: 'job-1',
    jobTitle: 'Associate Software Engineer',
    company: 'Cognizant Technology Solutions',
    status: 'Shortlisted',
    appliedAt: '2026-03-24T10:30:00.000Z',
    resumeSnapshot: {
      originalName: 'Alex_Chen_SWE_Resume.pdf',
      fileName: 'Alex_Chen_SWE_Resume.pdf',
      size: 1420000,
    },
    student: {
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      college: 'Institute of Engineering & Technology',
      degree: 'B.Tech / B.E.',
      graduationYear: 2026,
      cgpa: '8.8',
      skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS'],
      resume: {
        originalName: 'Alex_Chen_SWE_Resume.pdf',
        fileName: 'Alex_Chen_SWE_Resume.pdf',
        size: 1420000,
      },
    },
  },
  {
    id: 'app-seed-2',
    _id: 'app-seed-2',
    jobId: 'job-2',
    jobTitle: 'Full Stack Developer Intern',
    company: 'Zoho Corporation',
    status: 'Under Review',
    appliedAt: '2026-03-27T14:15:00.000Z',
    resumeSnapshot: {
      originalName: 'Priya_Sharma_FullStack_Resume.pdf',
      fileName: 'Priya_Sharma_FullStack_Resume.pdf',
      size: 1180000,
    },
    student: {
      name: 'Priya Sharma',
      email: 'priya.sharma@university.edu',
      college: 'College of Engineering & Technology',
      degree: 'B.Tech / B.E.',
      graduationYear: 2026,
      cgpa: '9.2',
      skills: ['Java', 'Spring Boot', 'React', 'SQL'],
      resume: {
        originalName: 'Priya_Sharma_FullStack_Resume.pdf',
        fileName: 'Priya_Sharma_FullStack_Resume.pdf',
        size: 1180000,
      },
    },
  },
  {
    id: 'app-seed-3',
    _id: 'app-seed-3',
    jobId: 'job-3',
    jobTitle: 'Graduate Technology Associate',
    company: 'Deloitte USI',
    status: 'Selected',
    appliedAt: '2026-03-20T09:00:00.000Z',
    resumeSnapshot: {
      originalName: 'Rahul_Verma_DataScientist_Resume.pdf',
      fileName: 'Rahul_Verma_DataScientist_Resume.pdf',
      size: 2050000,
    },
    student: {
      name: 'Rahul Verma',
      email: 'rahul.verma@university.edu',
      college: 'National Institute of Technology',
      degree: 'MCA',
      graduationYear: 2025,
      cgpa: '8.5',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      resume: {
        originalName: 'Rahul_Verma_DataScientist_Resume.pdf',
        fileName: 'Rahul_Verma_DataScientist_Resume.pdf',
        size: 2050000,
      },
    },
  },
  {
    id: 'app-seed-4',
    _id: 'app-seed-4',
    jobId: 'job-4',
    jobTitle: 'Cloud & DevOps Associate',
    company: 'Infosys Limited',
    status: 'Applied',
    appliedAt: '2026-03-29T16:45:00.000Z',
    resumeSnapshot: {
      originalName: 'Sneha_Patel_CloudDevOps_Resume.pdf',
      fileName: 'Sneha_Patel_CloudDevOps_Resume.pdf',
      size: 1640000,
    },
    student: {
      name: 'Sneha Patel',
      email: 'sneha.patel@university.edu',
      college: 'Institute of Engineering & Technology',
      degree: 'B.Tech / B.E.',
      graduationYear: 2026,
      cgpa: '8.4',
      skills: ['Linux', 'AWS', 'Docker', 'Bash', 'Git'],
      resume: {
        originalName: 'Sneha_Patel_CloudDevOps_Resume.pdf',
        fileName: 'Sneha_Patel_CloudDevOps_Resume.pdf',
        size: 1640000,
      },
    },
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobs' | 'applications'
  const { showToast } = useToast();

  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [stats, setStats] = useState({
    totalJobs: SAMPLE_JOBS.length,
    totalApplications: SEED_APPLICATIONS.length,
    shortlistedCount: SEED_APPLICATIONS.filter((a) => a.status === 'Shortlisted').length,
    selectedCount: SEED_APPLICATIONS.filter((a) => a.status === 'Selected').length,
  });

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isJobSubmitting, setIsJobSubmitting] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingApp, setReviewingApp] = useState(null);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // Filters state
  const [jobSearch, setJobSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  // Load live data from backend if available
  const loadData = useCallback(async () => {
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.allSettled([
        adminService.getStats(),
        jobService.getJobs(),
        applicationService.getAdminApplications(),
      ]);

      if (jobsRes.status === 'fulfilled' && jobsRes.value.success) {
        const liveJobs = Array.isArray(jobsRes.value.data)
          ? jobsRes.value.data
          : jobsRes.value.data?.jobs;
        if (liveJobs && liveJobs.length > 0) {
          setJobs(
            liveJobs.map((j) => ({
              ...j,
              id: j._id || j.id,
            }))
          );
        }
      }

      if (appsRes.status === 'fulfilled' && appsRes.value.success) {
        const liveApps = Array.isArray(appsRes.value.data)
          ? appsRes.value.data
          : appsRes.value.data?.applications;
        if (liveApps && liveApps.length > 0) {
          setApplications(
            liveApps.map((a) => ({
              ...a,
              id: a._id || a.id,
            }))
          );
        }
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        const s = statsRes.value.data;
        setStats({
          totalJobs: s.totalJobs,
          totalApplications: s.totalApplications,
          shortlistedCount: s.statusBreakdown?.shortlisted || 0,
          selectedCount: s.statusBreakdown?.selected || 0,
        });
      }
    } catch {
      // Fallback state remains active
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Job Form Submit (Create or Update)
  const handleJobSubmit = async (formData) => {
    setIsJobSubmitting(true);
    try {
      if (editingJob) {
        // Update Job
        try {
          await jobService.updateJob(editingJob.id || editingJob._id, formData);
        } catch {
          // Local fallback
        }
        setJobs((prev) =>
          prev.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j))
        );
        showToast(`Job listing "${formData.title}" updated successfully!`, 'success');
      } else {
        // Create Job
        let newId = `job-${Date.now()}`;
        try {
          const res = await jobService.createJob(formData);
          if (res.success && res.data) {
            newId = res.data._id || newId;
          }
        } catch {
          // Local fallback
        }
        const created = { id: newId, _id: newId, ...formData };
        setJobs((prev) => [created, ...prev]);
        setStats((prev) => ({ ...prev, totalJobs: prev.totalJobs + 1 }));
        showToast(`New drive "${formData.title}" published successfully!`, 'success');
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
    } finally {
      setIsJobSubmitting(false);
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete the placement drive for "${jobTitle}"?`)) {
      try {
        await jobService.deleteJob(jobId);
      } catch {
        // Local fallback
      }
      setJobs((prev) => prev.filter((j) => j.id !== jobId && j._id !== jobId));
      setStats((prev) => ({ ...prev, totalJobs: Math.max(0, prev.totalJobs - 1) }));
      showToast(`Drive "${jobTitle}" removed successfully.`, 'info');
    }
  };

  // Handle Update Status
  const handleUpdateStatus = async (appId, { status, note }) => {
    setIsReviewSubmitting(true);
    try {
      try {
        await applicationService.updateApplicationStatus(appId, { status, note });
      } catch {
        // Local fallback
      }
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId || app._id === appId
            ? {
                ...app,
                status,
                statusHistory: [
                  ...(app.statusHistory || []),
                  { status, note, date: new Date().toISOString() },
                ],
              }
            : app
        )
      );
      showToast(`Application status updated to "${status}".`, 'success');
      setIsReviewModalOpen(false);
      setReviewingApp(null);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (!jobSearch) return true;
      const q = jobSearch.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, jobSearch]);

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appStatusFilter !== 'All' && app.status !== appStatusFilter) return false;
      if (!appSearch) return true;
      const q = appSearch.toLowerCase();
      const studentName = app.student?.name?.toLowerCase() || '';
      const studentEmail = app.student?.email?.toLowerCase() || '';
      const jobTitle = app.jobTitle?.toLowerCase() || app.job?.title?.toLowerCase() || '';
      const company = app.company?.toLowerCase() || app.job?.company?.toLowerCase() || '';
      return (
        studentName.includes(q) ||
        studentEmail.includes(q) ||
        jobTitle.includes(q) ||
        company.includes(q)
      );
    });
  }, [applications, appStatusFilter, appSearch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <Badge variant="success">Selected</Badge>;
      case 'Shortlisted':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="neutral">Applied</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      {/* Admin Nav */}
      <AdminNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCreateModal={() => {
          setEditingJob(null);
          setIsJobModalOpen(true);
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Placement Drives"
            value={stats.totalJobs}
            icon={Briefcase}
            subtext="Verified campus drives"
          />
          <StatCard
            title="Total Candidate Applications"
            value={applications.length}
            icon={Users}
            subtext="Submissions across all drives"
          />
          <StatCard
            title="Shortlisted for Interview"
            value={applications.filter((a) => a.status === 'Shortlisted').length}
            icon={TrendingUp}
            subtext="Cleared preliminary rounds"
          />
          <StatCard
            title="Selected / Placed Candidates"
            value={applications.filter((a) => a.status === 'Selected').length}
            icon={Award}
            subtext="Offers successfully rolled out"
          />
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Applications Quick Card (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-[#14213D]">
                      Recent Candidate Applications
                    </h3>
                    <p className="text-xs text-[#667085]">
                      Latest submissions awaiting officer evaluation
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('applications')}
                  >
                    View All
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4E8F0] text-[#667085] uppercase tracking-wider text-[10px]">
                        <th className="pb-3 font-semibold">Candidate</th>
                        <th className="pb-3 font-semibold">Drive</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {applications.slice(0, 5).map((app) => (
                        <tr key={app.id || app._id} className="hover:bg-[#F6F8FC] transition-colors">
                          <td className="py-3">
                            <p className="font-semibold text-[#14213D]">{app.student?.name || 'Student'}</p>
                            <p className="text-[11px] text-[#667085]">{app.student?.email}</p>
                          </td>
                          <td className="py-3">
                            <p className="font-medium text-[#14213D]">{app.jobTitle || app.job?.title}</p>
                            <p className="text-[11px] text-[#667085]">{app.company || app.job?.company}</p>
                          </td>
                          <td className="py-3">{getStatusBadge(app.status)}</td>
                          <td className="py-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReviewingApp(app);
                                setIsReviewModalOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Drives Status Breakdown (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#14213D]">
                    Placement Pipeline Status
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('jobs')}
                  >
                    Manage
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Applied (Received)', count: applications.filter((a) => a.status === 'Applied').length, color: 'bg-slate-500' },
                    { label: 'Under Review', count: applications.filter((a) => a.status === 'Under Review').length, color: 'bg-amber-500' },
                    { label: 'Shortlisted for Interview', count: applications.filter((a) => a.status === 'Shortlisted').length, color: 'bg-blue-600' },
                    { label: 'Offers Extended (Selected)', count: applications.filter((a) => a.status === 'Selected').length, color: 'bg-emerald-600' },
                    { label: 'Archived / Rejected', count: applications.filter((a) => a.status === 'Rejected').length, color: 'bg-rose-500' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                        <span className="text-xs font-medium text-[#172033]">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-[#14213D]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PLACEMENT DRIVES */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#14213D]">
                  Campus Placement Drives ({filteredJobs.length})
                </h3>
                <p className="text-xs text-[#667085]">
                  Create, update eligibility rules, or close recruitment postings.
                </p>
              </div>

              {/* Search Bar & Action */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search drives..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E4E8F0] bg-[#F6F8FC] text-[#172033] focus:bg-white focus:border-[#3157D5] outline-none transition-all"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setEditingJob(null);
                    setIsJobModalOpen(true);
                  }}
                >
                  New Drive
                </Button>
              </div>
            </div>

            {/* Drives Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E4E8F0] text-[#667085] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Job Title & Company</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">CTC / Compensation</th>
                    <th className="pb-3 font-semibold">Deadline</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredJobs.map((job) => (
                    <tr key={job.id || job._id} className="hover:bg-[#F6F8FC] transition-colors">
                      <td className="py-3.5">
                        <p className="font-bold text-[#14213D]">{job.title}</p>
                        <p className="text-[11px] text-[#667085]">{job.company}</p>
                      </td>
                      <td className="py-3.5 text-[#172033]">{job.location}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#3157D5]/10 text-[#3157D5] text-[10px] font-semibold">
                          {job.employmentType}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[#168568]">{job.salaryRange}</td>
                      <td className="py-3.5 text-[#667085]">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="py-3.5">
                        <Badge variant={job.status === 'Published' || !job.status ? 'success' : 'neutral'}>
                          {job.status || 'Published'}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJob(job);
                            setIsJobModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-[#E4E8F0] text-[#667085] hover:text-[#3157D5] hover:border-[#3157D5] transition-colors"
                          title="Edit Drive"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id || job._id, job.title)}
                          className="p-1.5 rounded-lg border border-[#E4E8F0] text-[#667085] hover:text-[#C2414B] hover:border-[#C2414B] transition-colors"
                          title="Delete Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CANDIDATE APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#14213D]">
                  Student Candidate Applications ({filteredApplications.length})
                </h3>
                <p className="text-xs text-[#667085]">
                  Evaluate candidate qualifications, verify marks, and transition round statuses.
                </p>
              </div>

              {/* Status Tabs & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Search candidate/company..."
                    className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E4E8F0] bg-[#F6F8FC] text-[#172033] focus:bg-white focus:border-[#3157D5] outline-none transition-all"
                  />
                </div>

                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E4E8F0] bg-white text-[#172033] outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E4E8F0] text-[#667085] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Candidate Information</th>
                    <th className="pb-3 font-semibold">Academic Details</th>
                    <th className="pb-3 font-semibold">Target Drive</th>
                    <th className="pb-3 font-semibold">Applied Date</th>
                    <th className="pb-3 font-semibold">Current Status</th>
                    <th className="pb-3 font-semibold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredApplications.map((app) => (
                    <tr key={app.id || app._id} className="hover:bg-[#F6F8FC] transition-colors">
                      <td className="py-3.5">
                        <p className="font-bold text-[#14213D]">{app.student?.name || 'Candidate Name'}</p>
                        <p className="text-[11px] text-[#667085]">{app.student?.email}</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-medium text-[#14213D]">{app.student?.degree || 'B.Tech'}</p>
                        <p className="text-[11px] text-[#168568] font-semibold">{app.student?.cgpa || '8.5'} CGPA</p>
                      </td>
                      <td className="py-3.5">
                        <p className="font-medium text-[#14213D]">{app.jobTitle || app.job?.title}</p>
                        <p className="text-[11px] text-[#667085]">{app.company || app.job?.company}</p>
                      </td>
                      <td className="py-3.5 text-[#667085]">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5">{getStatusBadge(app.status)}</td>
                      <td className="py-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setReviewingApp(app);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          Review & Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Job Create/Edit Modal */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleJobSubmit}
        initialJob={editingJob}
        isLoading={isJobSubmitting}
      />

      {/* Candidate Review Modal */}
      <ApplicationReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingApp(null);
        }}
        application={reviewingApp}
        onUpdateStatus={handleUpdateStatus}
        isLoading={isReviewSubmitting}
      />
    </div>
  );
}
