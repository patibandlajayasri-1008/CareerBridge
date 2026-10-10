import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { API_BASE_URL } from '../../services/api';

export default function ResumeUploadZone({ resume, onResumeUpload, onResumeRemove }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const validateAndProcessFile = (file) => {
    setError(null);

    if (!file) return;

    // Strict PDF validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Only PDF documents (.pdf) are allowed.');
      return;
    }

    // Size check (< 5MB)
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the 5 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      return;
    }

    // Pass file object directly for real multipart upload
    onResumeUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#14213D]">
            Curriculum Vitae / Resume
          </h3>
          <p className="text-xs text-[#667085]">
            Attach your official ATS-formatted resume in PDF format (Max 5 MB).
          </p>
        </div>
      </div>

      {resume && (resume.fileName || resume.originalName) ? (
        /* Uploaded File Card */
        <div className="p-4 rounded-xl border border-[#168568]/30 bg-emerald-50/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#168568] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-[#14213D] truncate block">
                {resume.fileName || resume.originalName}
              </span>
              <div className="flex items-center gap-2 text-xs text-[#667085]">
                {resume.size && <span>{(resume.size / (1024 * 1024)).toFixed(2)} MB • </span>}
                <span>Uploaded {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Verified'}</span>
                <span className="text-[#168568] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified PDF
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {resume.fileName && (
              <a
                href={`${API_BASE_URL}/users/resume/${encodeURIComponent(resume.fileName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-[#E4E8F0] text-[#3157D5] hover:bg-[#F6F8FC] transition-colors"
              >
                View PDF
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <button
              type="button"
              onClick={onResumeRemove}
              className="p-2 text-[#C2414B] hover:bg-rose-50 rounded-lg transition-colors"
              aria-label="Remove resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-[#3157D5] bg-[#3157D5]/5'
              : 'border-[#E4E8F0] hover:border-[#CBD5E1] bg-[#F8FAFC]'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E8F0] text-[#3157D5] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-[#14213D] mb-1">
            Click to upload or drag & drop your resume
          </h4>
          <p className="text-xs text-[#667085] max-w-sm mx-auto">
            Strictly PDF documents up to 5 MB. Evaluated directly by hiring campus coordinators.
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#C2414B] font-medium pt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
