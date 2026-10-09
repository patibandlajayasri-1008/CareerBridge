import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterX, Sparkles } from 'lucide-react';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import JobFilterBar from '../../components/jobs/JobFilterBar';
import Pagination from '../../components/jobs/Pagination';
import Button from '../../components/common/Button';
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
  requiredSkills: job.requiredSkills || [],
  deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '2026-05-30',
  description: job.description || '',
  openings: job.openings || 1,
});

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { isAuthenticated, isStudent } = useAuth();
  const { applyForJob, profile, uploadResume, hasApplied } = useStudent();

  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [apiJobs, setApiJobs] = useState(null);

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || 'All',
    skills: searchParams.getAll('skills') || [],
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Background fetch of live database jobs on mount with seamless fallback
  useEffect(() => {
    let isMounted = true;
    jobService
      .getJobs()
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.jobs)
          ? res.data.jobs
          : null;
        if (isMounted && res.success && list && list.length > 0) {
          setApiJobs(list.map(normalizeJob));
        }
      })
      .catch(() => {
        // Backend offline or error -> maintain sample dataset
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.location) params.set('location', filters.location);
    if (filters.type !== 'All') params.set('type', filters.type);
    filters.skills.forEach((s) => params.append('skills', s));
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);

    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      location: '',
      type: 'All',
      skills: [],
      sortBy: 'newest',
    });
  };

  // Base dataset is apiJobs if loaded, otherwise SAMPLE_JOBS
  const activeDataset = apiJobs || SAMPLE_JOBS;

  // Real-time Instant Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return activeDataset
      .filter((job) => {
        // Keyword search (title, company, skills)
        if (filters.q) {
          const query = filters.q.toLowerCase();
          const matchesTitle = job.title?.toLowerCase().includes(query);
          const matchesCompany = job.company?.toLowerCase().includes(query);
          const matchesSkills = (job.requiredSkills || []).some((s) =>
            s.toLowerCase().includes(query)
          );
          if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
        }

        // Location search
        if (filters.location) {
          const loc = filters.location.toLowerCase();
          if (!job.location?.toLowerCase().includes(loc)) return false;
        }

        // Employment Type filter
        if (filters.type !== 'All') {
          if (job.employmentType !== filters.type) return false;
        }

        // Skills multi-filter
        if (filters.skills.length > 0) {
          const hasSkill = filters.skills.some((selectedSkill) =>
            (job.requiredSkills || []).some((s) =>
              s.toLowerCase().includes(selectedSkill.toLowerCase())
            )
          );
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (filters.sortBy === 'salary') {
          return (b.salaryRange || '').localeCompare(a.salaryRange || '');
        }
        return 0;
      });
  }, [activeDataset, filters]);

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      showToast(
        `To apply for ${job.title} at ${job.company}, please sign in or register your student account.`,
        'info'
      );
      return;
    }

    if (!isStudent) {
      showToast('Only registered student candidates can apply for campus placement drives.', 'error');
      return;
    }

    if (hasApplied(job._id || job.id)) {
      showToast('You have already submitted an application for this drive.', 'info');
      return;
    }

    setSelectedJobForApply(job);
    setIsApplyModalOpen(true);
  };

  const handleConfirmApply = async (job, coverNote) => {
    try {
      setIsApplying(true);
      const res = await applyForJob(job, coverNote);
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

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Breadcrumb Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3157D5]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Campus Recruitment Drive 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14213D]">
          Explore Placement Opportunities
        </h1>
        <p className="text-sm text-[#667085] max-w-2xl leading-relaxed">
          Discover verified on-campus and partner company openings. Filter by domain, skills, and compensation to find your ideal career launchpad.
        </p>
      </div>

      {/* Filter and Search Bar Component */}
      <JobFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredJobs.length}
      />

      {/* Job Cards Grid */}
      {filteredJobs.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-[#E4E8F0] p-12 text-center max-w-lg mx-auto space-y-5 my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] text-[#667085] flex items-center justify-center mx-auto">
            <FilterX className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#14213D]">
              No Matching Opportunities
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              We couldn’t find any jobs matching your current filter criteria. Try expanding your search or clearing active filters.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredJobs.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* 3-Step Apply Modal: Review details & attach resume */}
      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={selectedJobForApply}
        profile={profile}
        onConfirmApply={handleConfirmApply}
        onResumeUpload={uploadResume}
        isLoading={isApplying}
      />
    </div>
  );
}
