import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import Select from '../common/Select';
import Button from '../common/Button';

export default function JobFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) {
  const employmentTypes = ['All', 'Full-Time', 'Internship'];

  const availableSkills = [
    'React',
    'Node.js',
    'Python',
    'SQL',
    'Cloud',
    'JavaScript',
    'Java',
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest Postings' },
    { value: 'deadline', label: 'Deadline Approaching' },
    { value: 'salary', label: 'Highest Package' },
  ];

  const hasActiveFilters =
    Boolean(filters.q) ||
    Boolean(filters.location) ||
    filters.type !== 'All' ||
    filters.skills.length > 0;

  const handleSkillToggle = (skill) => {
    const isSelected = filters.skills.includes(skill);
    const updated = isSelected
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onFilterChange('skills', updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Search Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="sm:col-span-6 relative flex items-center">
          <Search className="w-4 h-4 text-[#667085] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onFilterChange('q', e.target.value)}
            placeholder="Search by job title, company name, or keywords..."
            className="w-full pl-9 pr-3 py-2.5 text-sm text-[#172033] placeholder-[#94A3B8] bg-[#F6F8FC] rounded-lg border border-transparent focus:border-[#3157D5] focus:bg-white focus:outline-none transition-all"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => onFilterChange('q', '')}
              className="absolute right-3 text-[#94A3B8] hover:text-[#172033]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Filter */}
        <div className="sm:col-span-3 relative flex items-center">
          <MapPin className="w-4 h-4 text-[#667085] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            placeholder="Location (e.g. Bengaluru, Remote)"
            className="w-full pl-9 pr-3 py-2.5 text-sm text-[#172033] placeholder-[#94A3B8] bg-[#F6F8FC] rounded-lg border border-transparent focus:border-[#3157D5] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full py-2.5 px-3 text-sm rounded-lg border border-[#E4E8F0] bg-white text-[#172033] focus:border-[#3157D5] focus:outline-none transition-all"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Pills Row */}
      <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4">
        {/* Employment Type Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#667085] mr-1">Type:</span>
          {employmentTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onFilterChange('type', type)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-150 ${
                filters.type === type
                  ? 'bg-[#3157D5] text-white shadow-2xs font-semibold'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Skills Multi-Select Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-[#667085] mr-1">Skills:</span>
          {availableSkills.map((skill) => {
            const isSelected = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  isSelected
                    ? 'bg-[#14213D] text-white'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        {/* Reset Filters CTA if any active */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C2414B] hover:text-[#991B1B] transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Results summary counter */}
      <div className="flex items-center justify-between pt-1 text-xs text-[#667085]">
        <span>
          Showing <strong className="text-[#172033]">{totalResults}</strong> placement {totalResults === 1 ? 'opportunity' : 'opportunities'}
        </span>
        {hasActiveFilters && (
          <span className="text-slate-500 italic">Filters active</span>
        )}
      </div>
    </div>
  );
}
