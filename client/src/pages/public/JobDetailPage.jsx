import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  GraduationCap,
  Share2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ApplyJobModal from '../../components/jobs/ApplyJobModal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';

const normalizeJob = (job) => ({
  id: job._id || job.id,
  _id: job._id || job.id,
  title: job.title,
  company: job.company,
  companyCode: job.companyCode || (job.company || 'COM').substring(0, 3).toUpperCase(),
  logoBg: job.logoBg || 'bg-[#14213D]',
  location: job.location,
  employmentType: job.employmentType,
  salaryRange: job.salaryRange,
  experienceLevel: job.experienceLevel || 'Entry Level',
  openings: job.openings || 1,
  deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '2026-05-30',
  description: job.description || 'Comprehensive placement opening for college graduates.',
  responsibilities: job.responsibilities || [
    'Collaborate with cross-functional product and engineering teams.',
    'Design, implement, and maintain scalable solutions.',
    'Participate in code reviews, design discussions, and sprint planning.',
  ],
  requirements: job.requirements || [
    'Bachelor’s or Master’s in Computer Science, IT, or related degree.',
    'Solid grasp of data structures, algorithms, and web technologies.',
    'Strong problem-solving, collaboration, and communication skills.',
  ],
  requiredSkills: job.requiredSkills || [],
  eligibilityCriteria: job.eligibilityCriteria || {
    minCgpa: 6.5,
    allowedBatches: [2025, 2026],
    allowedDegrees: ['B.Tech / B.E.', 'MCA', 'M.Tech'],
  },
});

export default function JobDetailPage() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
  const { hasApplied, applyForJob, profile, uploadResume } = useStudent();

  const [job, setJob] = useState(() => {
    return SAMPLE_JOBS.find((j) => j.id === id) || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Fetch from backend API with fallback
  const fetchJob = useCallback(async () => {
    try {
      const res = await jobService.getJobById(id);
      if (res.success && res.data?.job) {
        setJob(normalizeJob(res.data.job));
      }
    } catch {
      // Backend offline or not found by MongoDB ID -> sample fallback remains active
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-medium text-[#667085]">Loading opportunity details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-5 bg-white p-8 rounded-2xl border border-[#E4E8F0]">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#C2414B] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#14213D]">
            Job Opportunity Not Found
          </h2>
          <p className="text-xs text-[#667085]">
            The requested placement drive does not exist or may have been unlisted by the placement cell.
          </p>
          <Link to="/jobs">
            <Button variant="primary" size="sm" icon={ArrowLeft}>
              Back to All Opportunities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyApplied = hasApplied(job._id || job.id);

  // Similar jobs: same employment type or sharing at least one skill, excluding current
  const similarJobs = SAMPLE_JOBS.filter(
    (j) =>
      j.id !== job.id &&
      (j.employmentType === job.employmentType ||
        (j.requiredSkills || []).some((s) => (job.requiredSkills || []).includes(s)))
  ).slice(0, 3);

  const handleApply = () => {
    if (!isAuthenticated) {
      showToast(
        `To submit your profile for ${job.title}, please sign in or register your student account.`,
        'info'
      );
      return;
    }

    if (isAdmin) {
      showToast('Administrators manage drives and cannot submit applications as candidates.', 'warning');
      return;
    }

    if (isAlreadyApplied) {
      showToast('You have already submitted an application for this drive.', 'info');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = async (appliedJob, coverNote) => {
    try {
      setIsApplying(true);
      const res = await applyForJob(appliedJob, coverNote);
      if (res.success) {
        showToast(res.message, 'success');
        setIsApplyModalOpen(false);
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job listing link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#3157D5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#667085] hover:text-[#172033] px-2.5 py-1 rounded-md border border-[#E4E8F0] bg-white transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Role</span>
        </button>
      </div>

      {/* Main Grid: Details (8 cols) + Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl ${job.logoBg} text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0`}
                >
                  {job.companyCode}
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-[#667085]">
                    {job.company}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                    {job.title}
                  </h1>
                </div>
              </div>
              <Badge variant={job.employmentType === 'Internship' ? 'warning' : 'primary'}>
                {job.employmentType}
              </Badge>
            </div>

            {/* Quick Metadata Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#F1F5F9]">
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider">
                  Location
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14213D]">
                  <MapPin className="w-3.5 h-3.5 text-[#3157D5]" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider">
                  Compensation
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#168568]">
                  <span>{job.salaryRange}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider">
                  Target Batch
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14213D]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#3157D5]" />
                  <span>
                    {job.eligibilityCriteria?.batch ||
                      (job.eligibilityCriteria?.allowedBatches
                        ? `${job.eligibilityCriteria.allowedBatches.join(', ')} Passing Out`
                        : '2026 Passing Out')}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#667085] uppercase tracking-wider">
                  Application Deadline
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14213D]">
                  <Calendar className="w-3.5 h-3.5 text-[#B7791F]" />
                  <span>{job.deadline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role Description */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-[#14213D] uppercase tracking-wider text-xs">
              Role Overview
            </h2>
            <p className="text-sm text-[#172033] leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-[#14213D] uppercase tracking-wider text-xs">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#172033]">
                    <CheckCircle2 className="w-4 h-4 text-[#3157D5] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Criteria */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-[#14213D] uppercase tracking-wider text-xs">
                Candidate Prerequisites
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#172033]">
                    <CheckCircle2 className="w-4 h-4 text-[#168568] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility Criteria Breakdown */}
          {job.eligibilityCriteria && (
            <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-[#14213D] uppercase tracking-wider text-xs">
                Placement Cell Eligibility Criteria
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] space-y-1">
                  <span className="text-[#667085]">Minimum Academic CGPA</span>
                  <p className="font-bold text-[#14213D] text-sm">
                    {job.eligibilityCriteria.minCgpa ? `${job.eligibilityCriteria.minCgpa} CGPA or above` : '6.0 CGPA'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] space-y-1">
                  <span className="text-[#667085]">Eligible Degrees</span>
                  <p className="font-bold text-[#14213D] text-sm">
                    {job.eligibilityCriteria.allowedDegrees
                      ? job.eligibilityCriteria.allowedDegrees.join(', ')
                      : 'All Engineering & Computer Applications'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Required Skills Competencies */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-base font-semibold text-[#14213D] uppercase tracking-wider text-xs">
                Required Technical Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#172033] text-xs font-medium border border-[#E2E8F0]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Application Card & Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                Ready to Apply?
              </span>
              <h3 className="text-lg font-bold text-[#14213D]">
                {isAlreadyApplied ? 'Application Submitted' : 'Submit Your Application'}
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                {isAlreadyApplied
                  ? 'Your profile and credentials have been submitted to the placement review committee.'
                  : 'Ensure your student profile is up to date with your latest semester marks and resume.'}
              </p>
            </div>

            {isAlreadyApplied ? (
              <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#168568] flex items-center justify-center gap-2 font-semibold text-sm">
                <Check className="w-4 h-4" />
                <span>Applied Successfully</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                onClick={handleApply}
                isLoading={isApplying}
              >
                Apply with Profile
              </Button>
            )}

            {!isAuthenticated && (
              <Link to="/register" className="block text-center">
                <span className="text-xs text-[#3157D5] hover:underline">
                  New here? Create student account
                </span>
              </Link>
            )}

            <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 text-xs text-[#667085]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#168568]" />
                <span>Verified campus placement drive</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#3157D5]" />
                <span>Direct recruitment coordinator review</span>
              </div>
            </div>
          </div>

          {/* Similar Opportunities */}
          {similarJobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Similar Campus Drives
              </h3>
              <div className="space-y-3">
                {similarJobs.map((simJob) => (
                  <Link
                    key={simJob.id}
                    to={`/jobs/${simJob.id}`}
                    className="block p-3 rounded-xl border border-[#E4E8F0] hover:border-[#3157D5] hover:bg-[#F6F8FC] transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#14213D] group-hover:text-[#3157D5] transition-colors">
                          {simJob.title}
                        </h4>
                        <p className="text-[11px] text-[#667085]">{simJob.company}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#3157D5]" />
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#667085]">
                      <span>{simJob.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#168568]">{simJob.salaryRange}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3-Step Apply Modal: Review details & attach resume */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        profile={profile}
        onConfirmApply={handleConfirmApply}
        onResumeUpload={uploadResume}
        isLoading={isApplying}
      />
    </div>
  );
}
