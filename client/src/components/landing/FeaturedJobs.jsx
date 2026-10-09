import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Briefcase,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

export default function FeaturedJobs() {
  const [selectedJob, setSelectedJob] = useState(null);

  const featuredList = SAMPLE_JOBS.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#F6F8FC] border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3157D5]">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Campus Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Featured Placement Opportunities
            </h2>
            <p className="text-sm text-[#667085] max-w-xl">
              Curated on-campus and partner recruitment drives actively hiring graduates from the Class of 2026.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Opportunities
            </Button>
          </Link>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredList.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-[#E4E8F0] p-6 hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Row: Company Avatar + Badges */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-lg ${job.logoBg} text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-xs`}
                    >
                      {job.companyCode}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#667085]">
                        {job.company}
                      </h4>
                      <h3 className="text-base font-semibold text-[#14213D] group-hover:text-[#3157D5] transition-colors">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  <Badge variant={job.employmentType === 'Internship' ? 'warning' : 'primary'}>
                    {job.employmentType}
                  </Badge>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#667085] pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3157D5]" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-[#168568]">
                    <Briefcase className="w-3.5 h-3.5" />
                    {job.salaryRange}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#667085]" />
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                {/* Brief description */}
                <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-5 mt-5 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[11px] text-[#667085]">
                  Eligibility: <strong className="text-[#172033]">{job.eligibilityCriteria.allowedDegrees[0]}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJob(job)}
                  className="group-hover:border-[#3157D5] group-hover:text-[#3157D5]"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/jobs" className="w-full inline-block">
            <Button variant="outline" size="md" className="w-full">
              Explore All {SAMPLE_JOBS.length}+ Opportunities
            </Button>
          </Link>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={selectedJob.title}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E8F0]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${selectedJob.logoBg} text-white flex items-center justify-center font-bold text-base shadow-xs`}
                >
                  {selectedJob.companyCode}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#14213D]">
                    {selectedJob.company}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#667085] mt-0.5">
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span className="text-[#168568] font-medium">{selectedJob.salaryRange}</span>
                  </div>
                </div>
              </div>
              <Badge variant="primary">{selectedJob.employmentType}</Badge>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Role Overview
              </h5>
              <p className="text-sm text-[#172033] leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Key Responsibilities
              </h5>
              <ul className="space-y-2 text-sm text-[#172033]">
                {selectedJob.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#168568] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility & Qualifications */}
            <div className="p-4 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#14213D]">
                <GraduationCap className="w-4 h-4 text-[#3157D5]" />
                Eligibility Criteria
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[#667085]">Min Graduation:</span>{' '}
                  <strong className="text-[#172033]">{selectedJob.eligibilityCriteria.minGraduationYear} Batch</strong>
                </div>
                <div>
                  <span className="text-[#667085]">Min CGPA:</span>{' '}
                  <strong className="text-[#172033]">{selectedJob.eligibilityCriteria.minCgpa} / 10</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-[#667085]">Allowed Degrees:</span>{' '}
                  <strong className="text-[#172033]">{selectedJob.eligibilityCriteria.allowedDegrees.join(', ')}</strong>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
                Required Competencies
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedJob.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] text-xs font-medium border border-[#E2E8F0]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E4E8F0] flex items-center justify-between">
              <span className="text-xs text-[#667085]">
                Apply before {new Date(selectedJob.deadline).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Sign Up to Apply
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
