import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Select from '../common/Select';
import {
  User,
  Mail,
  GraduationCap,
  Award,
  Phone,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  Save,
} from 'lucide-react';

export default function ApplicationReviewModal({
  isOpen,
  onClose,
  application,
  onUpdateStatus,
  isLoading = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState('Applied');
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status || 'Applied');
      setReviewNote('');
    }
  }, [application, isOpen]);

  if (!application) return null;

  const student = application.student || {};
  const job = application.job || {};

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateStatus(application.id || application._id, {
      status: selectedStatus,
      note: reviewNote.trim() || `Status updated to ${selectedStatus} by Placement Admin`,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <Badge variant="success">Selected</Badge>;
      case 'Shortlisted':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="neutral">Applied</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Application Review"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 py-2">
        {/* Candidate Profile Summary Box */}
        <div className="p-4 rounded-2xl bg-[#F6F8FC] border border-[#E4E8F0] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#14213D] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#14213D]">{student.name || 'Candidate Name'}</h3>
                <p className="text-xs text-[#667085]">{student.email || 'student@university.edu'}</p>
              </div>
            </div>
            {getStatusBadge(application.status)}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E4E8F0] text-xs">
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider">College</span>
              <p className="font-semibold text-[#14213D] truncate">{student.college || 'National University'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider">Degree</span>
              <p className="font-semibold text-[#14213D] truncate">{student.degree || 'B.Tech / B.E.'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider">Batch</span>
              <p className="font-semibold text-[#14213D]">{student.graduationYear || '2026'}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#667085] uppercase tracking-wider">CGPA</span>
              <p className="font-semibold text-[#168568]">{student.cgpa || '8.8'}</p>
            </div>
          </div>

          {/* Candidate Skills */}
          {student.skills && student.skills.length > 0 && (
            <div className="pt-2 border-t border-[#E4E8F0]">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider block mb-1.5">
                Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#E4E8F0] text-[11px] font-medium text-[#172033]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applied Drive Details */}
        <div className="p-3.5 rounded-xl border border-[#E4E8F0] bg-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-[#667085] tracking-wider">
              Applied Drive
            </span>
            <p className="text-xs font-bold text-[#14213D]">{job.title || application.jobTitle}</p>
            <p className="text-[11px] text-[#667085]">{job.company || application.company}</p>
          </div>
          <div className="text-right text-xs">
            <span className="text-[10px] text-[#667085]">Submission Date</span>
            <p className="font-semibold text-[#14213D]">
              {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recent'}
            </p>
          </div>
        </div>

        {/* Candidate Resume Inspection Box */}
        {(() => {
          const resume = student.resume || application.resumeSnapshot;
          const hasResume = Boolean(resume && (resume.originalName || resume.fileName));
          const resumeName =
            resume?.originalName ||
            resume?.fileName ||
            (student.name ? `${student.name.replace(/\s+/g, '_')}_Resume.pdf` : null);
          const resumeFileName = resume?.fileName || resumeName;

          if (hasResume || resumeName) {
            return (
              <div className="p-3.5 rounded-xl border border-[#168568]/30 bg-emerald-50/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#168568] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#14213D] truncate">
                      {resumeName}
                    </p>
                    <p className="text-[10px] text-[#667085]">
                      {resume?.size ? `${(resume.size / (1024 * 1024)).toFixed(2)} MB • ` : ''}Verified Candidate Resume
                    </p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000/api/v1/users/resume/${encodeURIComponent(resumeFileName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3157D5] hover:bg-[#2444b0] text-white text-xs font-semibold transition-colors shrink-0"
                >
                  <span>View Resume PDF</span>
                </a>
              </div>
            );
          }

          return (
            <div className="p-3.5 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-[#667085] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#667085]">No resume uploaded yet</p>
                  <p className="text-[10px] text-[#94A3B8]">Candidate has not uploaded a verified PDF file</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-[#667085] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0]">
                Pending Upload
              </span>
            </div>
          );
        })()}

        {/* Status Transition & Review Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-[#F1F5F9]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Transition Recruitment Status"
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'Applied', label: 'Applied (Received)' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Shortlisted', label: 'Shortlisted for Interview' },
                { value: 'Selected', label: 'Selected / Offer Extended' },
                { value: 'Rejected', label: 'Rejected / Archived' },
              ]}
            />

            <div className="flex flex-col justify-end">
              <span className="text-[11px] text-[#667085] mb-2">
                Updating this status updates the candidate's real-time timeline.
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#172033]">
              Placement Officer Note / Reason
            </label>
            <textarea
              rows="2"
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. Recommended for Round 2 technical evaluation based on coding assessment score."
              className="w-full p-2.5 text-xs rounded-xl border border-[#E4E8F0] bg-white text-[#172033] focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5] outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              icon={Save}
              isLoading={isLoading}
            >
              Update Application Status
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
