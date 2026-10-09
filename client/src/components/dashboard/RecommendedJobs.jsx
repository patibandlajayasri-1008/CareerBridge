import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function RecommendedJobs({ studentSkills, onApplyClick }) {
  // Recommend jobs that share at least one skill with student
  const recommendations = SAMPLE_JOBS.filter((job) =>
    job.requiredSkills.some((skill) =>
      studentSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
    )
  ).slice(0, 3);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#3157D5]" />
          <h3 className="text-base font-semibold text-[#14213D]">
            Recommended for Your Skill Set
          </h3>
        </div>
        <Link to="/jobs">
          <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
            Browse All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((job) => (
          <div
            key={job.id}
            className="p-4 rounded-xl border border-[#E4E8F0] hover:border-[#3157D5] hover:bg-[#F8FAFC] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#667085]">
                  {job.company}
                </span>
                <Badge variant={job.employmentType === 'Internship' ? 'warning' : 'primary'}>
                  {job.employmentType}
                </Badge>
              </div>
              <Link to={`/jobs/${job.id}`}>
                <h4 className="text-sm font-semibold text-[#14213D] hover:text-[#3157D5] transition-colors leading-tight">
                  {job.title}
                </h4>
              </Link>
              <div className="text-xs font-semibold text-[#168568]">
                {job.salaryRange}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {job.requiredSkills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569] text-[10px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#E4E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#667085] truncate max-w-[120px]">
                {job.location}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplyClick(job)}
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
