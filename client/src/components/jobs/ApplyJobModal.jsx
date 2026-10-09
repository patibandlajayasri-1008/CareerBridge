import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  Briefcase,
  Building,
  User,
  Mail,
  GraduationCap,
  Award,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function ApplyJobModal({
  isOpen,
  onClose,
  job,
  profile,
  onConfirmApply,
  onResumeUpload,
  isLoading = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const fileInputRef = useRef(null);

  if (!job) return null;

  const currentResume = profile?.resume;
  const hasResume = Boolean(
    (currentResume && (currentResume.fileName || currentResume.originalName)) || selectedFile
  );

  const handleFileChange = async (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Invalid format: Only PDF resumes (.pdf) are accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5 MB. Please upload a smaller PDF.');
      return;
    }

    setSelectedFile(file);

    if (onResumeUpload) {
      try {
        setIsUploading(true);
        await onResumeUpload(file);
      } catch (err) {
        setUploadError(err.message || 'Failed to upload resume file.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasResume) {
      setUploadError('Please upload your PDF resume to complete this application.');
      return;
    }
    onConfirmApply(job, coverNote);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Placement Application"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Header Summary */}
        <div className="p-4 rounded-xl bg-[#F6F8FC] border border-[#E4E8F0] flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14213D] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#14213D] leading-tight">{job.title}</h4>
              <p className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                <span>{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
              </p>
            </div>
          </div>
          <Badge variant="primary">{job.salaryRange || 'Competitive'}</Badge>
        </div>

        {/* Step 1: Candidate Profile Details */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#14213D] uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#3157D5]" />
            <span>1. Your Candidate Profile</span>
          </label>
          <div className="p-3.5 rounded-xl border border-[#E4E8F0] bg-white grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Candidate Name</span>
              <p className="font-semibold text-[#14213D] truncate">{profile?.name || 'Student Candidate'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Registered Email</span>
              <p className="font-semibold text-[#14213D] truncate">{profile?.email || 'student@university.edu'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block">College / Institute</span>
              <p className="font-semibold text-[#14213D] truncate">{profile?.college || 'University'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Degree & CGPA</span>
              <p className="font-semibold text-[#14213D] truncate">
                {profile?.degree || 'B.Tech'} • CGPA: <span className="text-[#168568]">{profile?.cgpa || '8.0+'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Resume Attachment */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#14213D] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#3157D5]" />
            <span>2. Resume Attached for this Application</span>
          </label>

          {hasResume ? (
            <div className="p-3.5 rounded-xl border border-[#168568]/30 bg-emerald-50/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#168568] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#14213D] truncate">
                    {selectedFile?.name || currentResume?.originalName || currentResume?.fileName || 'Resume.pdf'}
                  </p>
                  <p className="text-[10px] text-[#667085] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#168568]" />
                    <span>Verified PDF Resume Attached</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#3157D5] hover:text-[#2444b0] px-2.5 py-1 rounded bg-white border border-[#E4E8F0] shrink-0 transition-colors"
              >
                Change PDF
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#14213D]">
                  No resume attached to your profile yet
                </p>
                <p className="text-[11px] text-[#667085]">
                  Attach your official PDF resume to submit this application (Max 5 MB)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                Choose PDF Resume
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadError && (
            <p className="text-xs text-[#C2414B] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* Step 3: Optional Cover Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#14213D] flex items-center justify-between">
            <span>3. Note to Recruiter / Placement Cell (Optional)</span>
            <span className="text-[10px] font-normal text-[#667085]">Optional</span>
          </label>
          <textarea
            rows="2"
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder="e.g. Excited to apply! Specialized in React and Node.js with previous internship experience..."
            className="w-full p-2.5 text-xs rounded-xl border border-[#E4E8F0] text-[#14213D] focus:border-[#3157D5] focus:outline-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            icon={Send}
            isLoading={isLoading}
            disabled={!hasResume}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
