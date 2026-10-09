import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function JobCard({ job, onApplyClick }) {
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="bg-white rounded-xl border border-[#E4E8F0] p-6 hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Header: Company Avatar & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl ${job.logoBg} text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-xs`}
            >
              {job.companyCode}
            </div>
            <div>
              <span className="text-xs font-medium text-[#667085] block">
                {job.company}
              </span>
              <Link to={`/jobs/${job.id}`}>
                <h3 className="text-base font-semibold text-[#14213D] group-hover:text-[#3157D5] transition-colors leading-snug">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={job.employmentType === 'Internship' ? 'warning' : 'primary'}>
              {job.employmentType}
            </Badge>
            {job.featured && (
              <span className="text-[10px] font-semibold text-[#3157D5] uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#667085]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#3157D5]" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#168568]">
            <Briefcase className="w-3.5 h-3.5" />
            {job.salaryRange}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[11px] font-medium border border-[#E2E8F0]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-5 mt-5 border-t border-[#F1F5F9] flex items-center justify-between">
        <span className="text-[11px] text-[#667085]">
          Eligible: <strong className="text-[#172033]">{job.eligibilityCriteria?.allowedDegrees[0] || 'Graduates'}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job.id}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            disabled={isExpired}
            onClick={() => onApplyClick && onApplyClick(job)}
          >
            {isExpired ? 'Closed' : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  );
}
