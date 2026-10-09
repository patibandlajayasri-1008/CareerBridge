import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Building2,
  FileCheck2,
  Briefcase,
  Users,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (locationTerm.trim()) params.set('location', locationTerm.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E4E8F0]">
      {/* Background Subtle Gradient & Mesh Grid */}
      <div className="absolute inset-0 bg-radial from-[#3157D5]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6478F0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Search Form (7 columns) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E4E8F0] shadow-xs text-xs font-medium text-[#172033]">
              <span className="flex h-2 w-2 rounded-full bg-[#3157D5] animate-pulse" />
              <span className="text-[#3157D5] font-semibold">Campus Drive 2026</span>
              <span className="text-[#667085]">|</span>
              <span className="text-[#667085]">Verified Recruitment Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#14213D] leading-[1.12]">
              Your Next Career Move <span className="text-[#3157D5]">Starts Here.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#667085] max-w-2xl leading-relaxed">
              Discover opportunities that match your skills, showcase your potential, and take the next step toward your professional future.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/jobs">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Explore Opportunities
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Create Your Profile
                </Button>
              </Link>
            </div>

            {/* Prominent Search Component */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E4E8F0] shadow-sm hover:border-[#CBD5E1] transition-all">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* Job Title / Role Field */}
                <div className="sm:col-span-6 relative flex items-center">
                  <Search className="w-4 h-4 text-[#667085] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Job title, skills, or company..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm text-[#172033] placeholder-[#667085] bg-[#F6F8FC] rounded-lg border border-transparent focus:border-[#3157D5] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Location Field */}
                <div className="sm:col-span-4 relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#667085] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="Location (e.g. Remote)"
                    className="w-full pl-9 pr-3 py-2.5 text-sm text-[#172033] placeholder-[#667085] bg-[#F6F8FC] rounded-lg border border-transparent focus:border-[#3157D5] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Submit Search Button */}
                <div className="sm:col-span-2">
                  <Button type="submit" variant="primary" size="md" className="w-full h-full py-2.5">
                    Search
                  </Button>
                </div>
              </form>

              {/* Popular Search Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#F1F5F9] text-xs text-[#667085]">
                <span className="font-medium text-[#172033]">Popular:</span>
                {['Full Stack', 'Cloud Engineer', 'Frontend', 'Internship', 'Data Analyst'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchTerm(tag);
                      navigate(`/jobs?q=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust bullet indicators */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#667085] pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#168568]" />
                100% Verified Employers
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#168568]" />
                Zero Spam & Direct Submissions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#168568]" />
                Real-Time Application Status
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Placement SaaS Preview Card (5 columns) */}
          <div className="lg:col-span-5 relative">
            {/* Background Elevation Accent */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#3157D5]/10 to-[#6478F0]/10 rounded-2xl filter blur-xl opacity-70 pointer-events-none" />

            {/* Main Interactive SaaS Mockup Card */}
            <div className="relative bg-white rounded-2xl border border-[#E4E8F0] shadow-xl p-5 sm:p-6 space-y-5">
              {/* Header: Student Placement Status */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-sm">
                    CB
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#14213D]">
                      Student Candidate Portal
                    </h3>
                    <p className="text-xs text-[#667085]">
                      Class of 2026 • Verified Profile
                    </p>
                  </div>
                </div>
                <Badge variant="success">98% Match</Badge>
              </div>

              {/* Active Application Card Snapshot */}
              <div className="bg-[#F6F8FC] rounded-xl p-4 border border-[#E4E8F0] space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-[#3157D5] uppercase tracking-wider">
                      Active Application
                    </span>
                    <h4 className="text-sm font-semibold text-[#14213D]">
                      Associate Software Engineer
                    </h4>
                    <p className="text-xs text-[#667085]">Cognizant Technology Solutions</p>
                  </div>
                  <Badge variant="Shortlisted">Shortlisted</Badge>
                </div>

                {/* Visual Progress Stepper */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#667085] mb-1.5">
                    <span className="text-[#168568] font-semibold">1. Applied</span>
                    <span className="text-[#168568] font-semibold">2. Under Review</span>
                    <span className="text-[#3157D5] font-semibold">3. Shortlisted</span>
                    <span className="text-slate-400">4. Selected</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3157D5] rounded-full w-3/4 transition-all duration-500" />
                  </div>
                </div>
              </div>

              {/* Recruitment Highlights Mini Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-white border border-[#E4E8F0] shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#3157D5]" />
                    <span>Campus Offers</span>
                  </div>
                  <div className="text-lg font-bold text-[#14213D]">150+ Companies</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E4E8F0] shadow-2xs">
                  <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#168568]" />
                    <span>Top Package</span>
                  </div>
                  <div className="text-lg font-bold text-[#14213D]">₹18.0 LPA</div>
                </div>
              </div>

              {/* Hiring Partner Logo Bar */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <div className="text-[11px] font-medium text-[#667085] mb-2">
                  Recent Corporate Hiring Partners
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                  <span className="px-2 py-1 bg-[#F1F5F9] rounded">Cognizant</span>
                  <span className="px-2 py-1 bg-[#F1F5F9] rounded">Zoho Corp</span>
                  <span className="px-2 py-1 bg-[#F1F5F9] rounded">Deloitte</span>
                  <span className="px-2 py-1 bg-[#F1F5F9] rounded">Microsoft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
