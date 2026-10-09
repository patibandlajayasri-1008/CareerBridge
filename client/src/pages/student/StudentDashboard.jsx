import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileCheck,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  UserCheck,
  Send,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { SAMPLE_JOBS } from '../../data/sampleJobs';
import StudentNav from '../../components/dashboard/StudentNav';
import StatCard from '../../components/dashboard/StatCard';
import ProfileCompletenessBar from '../../components/dashboard/ProfileCompletenessBar';
import ApplicationStatusChart from '../../components/dashboard/ApplicationStatusChart';
import RecentApplicationsTable from '../../components/dashboard/RecentApplicationsTable';
import RecommendedJobs from '../../components/dashboard/RecommendedJobs';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export default function StudentDashboard() {
  const { profile, applications, profileCompleteness, applyForJob } = useStudent();
  const { showToast } = useToast();

  // Metrics
  const totalAvailableJobs = SAMPLE_JOBS.length;
  const totalApplications = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Selected'
  ).length;

  const handleApplyClick = (job) => {
    const res = applyForJob(job);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      {/* Student Subnav */}
      <StudentNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#3157D5]/10 text-xs font-semibold text-[#3157D5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Recruitment Batch {profile.graduationYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#667085]">
              {profile.degree} • {profile.college}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/jobs">
              <Button variant="primary" size="md" icon={Briefcase}>
                Browse Drives
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="md" icon={UserCheck}>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Available Drives"
            value={totalAvailableJobs}
            subtext="Actively hiring campus partners"
            icon={Briefcase}
            iconBg="bg-blue-50"
            iconColor="text-[#3157D5]"
          />
          <StatCard
            title="Total Applications"
            value={totalApplications}
            subtext="Submitted candidatures"
            icon={Send}
            iconBg="bg-slate-100"
            iconColor="text-[#14213D]"
            badgeText="Active"
            badgeType="primary"
          />
          <StatCard
            title="Under Review"
            value={underReviewCount}
            subtext="Currently with HR recruiters"
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-[#B7791F]"
            badgeText="In Progress"
            badgeType="neutral"
          />
          <StatCard
            title="Shortlisted / Offers"
            value={shortlistedCount}
            subtext="Advanced to next stage"
            icon={Award}
            iconBg="bg-emerald-50"
            iconColor="text-[#168568]"
            badgeText={shortlistedCount > 0 ? 'High Momentum' : 'Pending'}
            badgeType="success"
          />
        </div>

        {/* Profile Completeness Bar */}
        <ProfileCompletenessBar completeness={profileCompleteness} />

        {/* Chart + Recommended Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6">
            <ApplicationStatusChart applications={applications} />
          </div>
          <div className="lg:col-span-6">
            <RecommendedJobs
              studentSkills={profile.skills}
              onApplyClick={handleApplyClick}
            />
          </div>
        </div>

        {/* Recent Applications Table */}
        <RecentApplicationsTable applications={applications} />
      </div>
    </div>
  );
}
