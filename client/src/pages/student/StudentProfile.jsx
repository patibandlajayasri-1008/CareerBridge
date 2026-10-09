import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Award,
  Phone,
  Plus,
  X,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import StudentNav from '../../components/dashboard/StudentNav';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import ResumeUploadZone from '../../components/profile/ResumeUploadZone';
import ProfileCompletenessBar from '../../components/dashboard/ProfileCompletenessBar';
import { useToast } from '../../context/ToastContext';

export default function StudentProfile() {
  const {
    profile,
    profileCompleteness,
    updateProfile,
    addSkill,
    removeSkill,
    addPreferredRole,
    removePreferredRole,
    uploadResume,
    removeResume,
  } = useStudent();

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    college: profile.college || '',
    degree: profile.degree || 'B.Tech / B.E.',
    branch: profile.branch || '',
    graduationYear: profile.graduationYear || 2026,
    cgpa: profile.cgpa || '',
    summary: profile.summary || '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const degrees = [
    'B.Tech / B.E.',
    'M.Tech',
    'MCA',
    'BCA / B.Sc Computer Science',
    'MBA',
    'Other Engineering Program',
  ];

  const graduationYears = ['2024', '2025', '2026', '2027', '2028'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.trim()) {
      addPreferredRole(newRole.trim());
      setNewRole('');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile(formData);

    setTimeout(() => {
      setIsSaving(false);
      showToast('Student academic profile updated successfully!', 'success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] pb-16">
      <StudentNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E8F0]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Student Profile & Resume
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Keep your credentials and placement documents up to date for campus recruiters.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Save}
            isLoading={isSaving}
            onClick={handleSaveProfile}
          >
            Save Changes
          </Button>
        </div>

        {/* Profile Completeness Bar */}
        <ProfileCompletenessBar completeness={profileCompleteness} />

        {/* Main Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Card 1: Academic & Personal Info */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#F1F5F9]">
              <GraduationCap className="w-5 h-5 text-[#3157D5]" />
              <h2 className="text-base font-semibold text-[#14213D]">
                Academic & Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="College Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="+91 98765 43210"
              />

              <Input
                label="College / Institute"
                name="college"
                value={formData.college}
                onChange={handleChange}
                icon={Building}
                required
              />

              <Select
                label="Degree Program"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                options={degrees}
                required
              />

              <Input
                label="Discipline / Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
              />

              <Select
                label="Graduation Year"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                options={graduationYears}
                required
              />

              <Input
                label="Cumulative CGPA (Out of 10)"
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.65"
                icon={Award}
              />
            </div>
          </div>

          {/* Card 2: Professional Summary & Preferences */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#F1F5F9]">
              <FileText className="w-5 h-5 text-[#3157D5]" />
              <h2 className="text-base font-semibold text-[#14213D]">
                Professional Summary & Target Roles
              </h2>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#172033] tracking-wide">
                Candidate Bio / Professional Summary
              </label>
              <textarea
                name="summary"
                rows={4}
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a brief professional overview summarizing your projects, interests, and academic focus..."
                className="w-full text-sm rounded-lg border border-[#E4E8F0] p-3.5 text-[#172033] placeholder-[#94A3B8] focus:border-[#3157D5] focus:outline-none transition-all"
              />
              <span className="text-[11px] text-[#667085] block text-right">
                {formData.summary.length} characters
              </span>
            </div>

            {/* Preferred Roles Manager */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-[#172033] tracking-wide">
                Preferred Job Roles
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {profile.preferredRoles?.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#3157D5]/10 text-[#3157D5] text-xs font-medium border border-[#3157D5]/20"
                  >
                    <span>{role}</span>
                    <button
                      type="button"
                      onClick={() => removePreferredRole(role)}
                      className="hover:text-[#2444b0]"
                      aria-label={`Remove role ${role}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md pt-1">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Backend Developer"
                  className="flex-1 text-xs rounded-lg border border-[#E4E8F0] px-3 py-2 text-[#172033] focus:border-[#3157D5] focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRole}
                  icon={Plus}
                >
                  Add Role
                </Button>
              </div>
            </div>
          </div>

          {/* Card 3: Technical Skills Manager */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#F1F5F9]">
              <Award className="w-5 h-5 text-[#3157D5]" />
              <h2 className="text-base font-semibold text-[#14213D]">
                Technical Skills & Tools
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {profile.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F1F5F9] text-[#172033] text-xs font-medium border border-[#E2E8F0]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[#667085] hover:text-[#C2414B]"
                      aria-label={`Remove skill ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md pt-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. TypeScript, Docker, MongoDB"
                  className="flex-1 text-xs rounded-lg border border-[#E4E8F0] px-3 py-2 text-[#172033] focus:border-[#3157D5] focus:outline-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  icon={Plus}
                >
                  Add Skill
                </Button>
              </div>
            </div>
          </div>

          {/* Card 4: Resume Upload */}
          <div className="bg-white rounded-2xl border border-[#E4E8F0] p-6 sm:p-8 shadow-xs">
            <ResumeUploadZone
              resume={profile.resume}
              onResumeUpload={uploadResume}
              onResumeRemove={removeResume}
            />
          </div>

          {/* Save Action Bottom Bar */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              isLoading={isSaving}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
