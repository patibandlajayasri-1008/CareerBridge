/**
 * PRE-PRODUCTION DEMO STUDENT PROFILE & APPLICATIONS
 * NOTE: Used for frontend UI prototyping during Phase 4.
 * Real database storage & authentication will be connected in Phase 6-8.
 */

export const INITIAL_STUDENT_PROFILE = {
  id: 'student-demo-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@nitk.edu.in',
  college: 'National Institute of Technology Karnataka (NITK)',
  degree: 'B.Tech / B.E.',
  branch: 'Computer Science and Engineering',
  graduationYear: 2026,
  cgpa: 8.65,
  phone: '+91 98765 43210',
  preferredRoles: ['Full Stack Developer', 'Frontend Engineer', 'Cloud Solutions'],
  skills: ['React.js', 'Node.js', 'JavaScript', 'SQL', 'Python', 'Tailwind CSS', 'Git'],
  summary:
    'Pre-final year Computer Science undergraduate passionate about building scalable, user-centric web applications and distributed systems. Strong foundation in data structures, algorithms, and full-stack JavaScript architectures.',
  resume: {
    fileName: 'Aarav_Sharma_Resume_2026.pdf',
    originalName: 'Aarav_Sharma_Resume.pdf',
    size: 1420000, // 1.42 MB
    mimeType: 'application/pdf',
    uploadedAt: '2026-10-01T10:30:00.000Z',
  },
};

export const INITIAL_STUDENT_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Associate Software Engineer',
    company: 'Cognizant Technology Solutions',
    companyCode: 'CTS',
    logoBg: 'bg-blue-600',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹6.5 LPA - ₹8.5 LPA',
    status: 'Shortlisted',
    appliedAt: '2026-10-02T14:20:00.000Z',
    statusHistory: [
      { status: 'Applied', date: '2026-10-02T14:20:00.000Z', note: 'Application submitted successfully.' },
      { status: 'Under Review', date: '2026-10-05T09:15:00.000Z', note: 'Resume screened and approved by recruitment panel.' },
      { status: 'Shortlisted', date: '2026-10-08T11:45:00.000Z', note: 'Shortlisted for Technical Assessment Round 1.' },
    ],
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Full Stack Developer Intern',
    company: 'Zoho Corporation',
    companyCode: 'ZH',
    logoBg: 'bg-red-600',
    location: 'Chennai, India (On-site)',
    employmentType: 'Internship',
    salaryRange: '₹35,000 / month Stipend',
    status: 'Under Review',
    appliedAt: '2026-10-04T16:00:00.000Z',
    statusHistory: [
      { status: 'Applied', date: '2026-10-04T16:00:00.000Z', note: 'Application submitted with profile snapshot.' },
      { status: 'Under Review', date: '2026-10-06T13:30:00.000Z', note: 'Initial eligibility verification completed.' },
    ],
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'Cloud Solutions Engineer',
    company: 'Deloitte USI',
    companyCode: 'DT',
    logoBg: 'bg-emerald-700',
    location: 'Hyderabad, India (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹8.0 LPA - ₹11.0 LPA',
    status: 'Applied',
    appliedAt: '2026-10-07T11:10:00.000Z',
    statusHistory: [
      { status: 'Applied', date: '2026-10-07T11:10:00.000Z', note: 'Application received by placement cell.' },
    ],
  },
];
