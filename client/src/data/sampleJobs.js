/**
 * PRE-PRODUCTION DEMO DATA
 * NOTE: Used strictly for frontend UI design preview during Phase 2.
 * Real backend database records are populated in Phase 6 & Phase 8.
 */
export const SAMPLE_JOBS = [
  {
    id: 'job-1',
    title: 'Associate Software Engineer',
    company: 'Cognizant Technology Solutions',
    companyCode: 'CTS',
    logoBg: 'bg-blue-600',
    location: 'Bengaluru, India (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹6.5 LPA - ₹8.5 LPA',
    deadline: '2026-11-15',
    requiredSkills: ['JavaScript', 'React.js', 'Node.js', 'SQL'],
    description:
      'Looking for graduating engineers with strong computer science fundamentals, problem-solving ability, and experience in modern JavaScript frameworks.',
    responsibilities: [
      'Collaborate with agile cross-functional teams to build scalable enterprise modules.',
      'Develop clean, responsive UI components using React and RESTful APIs.',
      'Participate in code reviews, automated unit testing, and technical documentation.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['B.Tech / B.E.', 'MCA', 'M.Tech'],
      minCgpa: 7.0,
    },
    featured: true,
  },
  {
    id: 'job-2',
    title: 'Full Stack Developer Intern',
    company: 'Zoho Corporation',
    companyCode: 'ZH',
    logoBg: 'bg-red-600',
    location: 'Chennai, India (On-site)',
    employmentType: 'Internship',
    salaryRange: '₹35,000 / month Stipend',
    deadline: '2026-10-30',
    requiredSkills: ['React', 'Express.js', 'MongoDB', 'REST APIs'],
    description:
      'Join Zoho’s engineering incubation team to craft web applications used by over 100 million users worldwide. Opportunity to convert to full-time placement.',
    responsibilities: [
      'Build end-to-end features using MERN stack under the mentorship of senior engineers.',
      'Optimize database queries and maintain high-efficiency REST endpoints.',
      'Write robust integration tests for mission-critical SaaS flows.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['B.Tech / B.E.', 'B.Sc Computer Science', 'BCA'],
      minCgpa: 6.5,
    },
    featured: true,
  },
  {
    id: 'job-3',
    title: 'Cloud Solutions Engineer',
    company: 'Deloitte USI',
    companyCode: 'DT',
    logoBg: 'bg-emerald-700',
    location: 'Hyderabad, India (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹8.0 LPA - ₹11.0 LPA',
    deadline: '2026-11-20',
    requiredSkills: ['Cloud Fundamentals', 'Python', 'Node.js', 'Linux'],
    description:
      'Deloitte is recruiting graduating technology enthusiasts to engineer resilient cloud platforms and automated deployment pipelines for Fortune 500 clients.',
    responsibilities: [
      'Design, configure, and monitor cloud-native infrastructure components.',
      'Implement security best practices, role-based access, and automated backups.',
      'Collaborate with global solution architects to deploy enterprise applications.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['B.Tech / B.E.', 'M.Tech'],
      minCgpa: 7.5,
    },
    featured: true,
  },
  {
    id: 'job-4',
    title: 'Frontend Platform Engineer',
    company: 'Infosys Limited',
    companyCode: 'INF',
    logoBg: 'bg-sky-700',
    location: 'Pune, India (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹5.5 LPA - ₹7.5 LPA',
    deadline: '2026-12-05',
    requiredSkills: ['React.js', 'Tailwind CSS', 'TypeScript Basics', 'Git'],
    description:
      'Focus on crafting accessible, performant design systems and frontend architectures across enterprise banking and retail applications.',
    responsibilities: [
      'Convert Figma design tokens into reusable, pixel-perfect React components.',
      'Ensure web accessibility compliance (WCAG 2.1 AA) across devices.',
      'Profile application performance and eliminate layout reflows.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['All Engineering Branches', 'MCA'],
      minCgpa: 6.0,
    },
    featured: true,
  },
  {
    id: 'job-5',
    title: 'Data Analyst & BI Associate',
    company: 'Tata Consultancy Services',
    companyCode: 'TCS',
    logoBg: 'bg-indigo-700',
    location: 'Mumbai, India (On-site)',
    employmentType: 'Full-Time',
    salaryRange: '₹5.0 LPA - ₹7.0 LPA',
    deadline: '2026-11-10',
    requiredSkills: ['SQL', 'Python', 'PowerBI', 'Data Modeling'],
    description:
      'Join our Analytics & Insights unit to analyze large-scale business datasets, extract strategic patterns, and publish executive KPI dashboards.',
    responsibilities: [
      'Write advanced SQL queries for dataset aggregation and ETL pipeline verification.',
      'Design clear, actionable data visual representations for leadership.',
      'Audit placement and operational datasets for completeness and consistency.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['B.Tech / B.E.', 'B.Sc Data Science', 'MCA'],
      minCgpa: 6.5,
    },
    featured: false,
  },
  {
    id: 'job-6',
    title: 'Backend Systems Developer',
    company: 'Microsoft India (Campus Hiring)',
    companyCode: 'MS',
    logoBg: 'bg-slate-900',
    location: 'Bengaluru / Hyderabad (Hybrid)',
    employmentType: 'Full-Time',
    salaryRange: '₹14.0 LPA - ₹18.0 LPA',
    deadline: '2026-11-28',
    requiredSkills: ['Data Structures', 'C++', 'Java', 'Distributed Systems'],
    description:
      'High-impact software engineering role building core services for Microsoft 365 and Azure Developer Tools.',
    responsibilities: [
      'Engineer low-latency microservices with sub-millisecond response guarantees.',
      'Solve distributed storage and concurrency challenges at cloud scale.',
      'Contribute to open-source developer tooling and developer ecosystems.',
    ],
    eligibilityCriteria: {
      minGraduationYear: 2026,
      allowedDegrees: ['B.Tech (CSE, IT, ECE)', 'M.Tech'],
      minCgpa: 8.0,
    },
    featured: true,
  },
];

export const DEMO_PLATFORM_STATS = {
  isDemoData: true,
  recruitersCount: '150+',
  placementsCount: '4,200+',
  highestPackage: '₹18.0 LPA',
  avgPackage: '₹7.8 LPA',
  placementRate: '94.2%',
};
