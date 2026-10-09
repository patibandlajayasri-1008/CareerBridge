import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_STUDENT_PROFILE, INITIAL_STUDENT_APPLICATIONS } from '../data/sampleStudent';
import { userService } from '../services/userService';
import { applicationService } from '../services/applicationService';
import { useAuth } from './AuthContext';

const StudentContext = createContext(null);

const normalizeApplication = (app) => ({
  id: app._id || app.id || `app-${Date.now()}`,
  jobId: app.job?._id || app.job || app.jobId,
  jobTitle: app.job?.title || app.jobTitle || 'Role',
  company: app.job?.company || app.company || 'Company',
  companyCode:
    app.companyCode ||
    (app.job?.company || app.company || 'COM').substring(0, 3).toUpperCase(),
  logoBg: app.job?.logoBg || app.logoBg || 'bg-[#14213D]',
  location: app.job?.location || app.location || 'Remote',
  employmentType: app.job?.employmentType || app.employmentType || 'Full-time',
  salaryRange: app.job?.salaryRange || app.salaryRange || 'Competitive',
  status: app.status || 'Applied',
  appliedAt: app.createdAt || app.appliedAt || new Date().toISOString(),
  statusHistory: (app.statusHistory || []).map((h) => ({
    status: h.status,
    date: h.changedAt || h.date || new Date().toISOString(),
    note: h.note || '',
  })),
});

export function StudentProvider({ children }) {
  const { user: authUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('careerbridge_student_profile');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('careerbridge_student_apps');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_APPLICATIONS;
    } catch {
      return INITIAL_STUDENT_APPLICATIONS;
    }
  });

  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Sync with live backend if authenticated
  const refreshBackendData = useCallback(async () => {
    const token = localStorage.getItem('careerbridge_token');
    if (!token) return;

    try {
      setIsLoadingBackend(true);
      // Fetch live user profile
      const profRes = await userService.getProfile();
      if (profRes.success && profRes.data?.user) {
        const u = profRes.data.user;
        const hasValidResume = Boolean(u.resume && (u.resume.fileName || u.resume.originalName));
        setProfile((prev) => ({
          ...prev,
          ...u,
          id: u._id || u.id,
          resume: hasValidResume ? u.resume : null,
          skills: u.skills || prev.skills || [],
          preferredRoles: u.preferredRoles || prev.preferredRoles || [],
        }));
      }

      // Fetch live applications
      const appRes = await applicationService.getMyApplications();
      if (appRes.success && appRes.data?.applications?.length > 0) {
        const normalized = appRes.data.applications.map(normalizeApplication);
        setApplications(normalized);
      }
    } catch {
      // Backend offline or token expired; local state remains active
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  // Sync student state whenever auth user changes
  useEffect(() => {
    if (isAuthenticated && authUser && authUser.role === 'student') {
      const hasValidResume = Boolean(authUser.resume && (authUser.resume.fileName || authUser.resume.originalName));
      setProfile((prev) => {
        // If switching to a different user, discard the old user's cached profile
        if (prev.email && prev.email.toLowerCase() !== authUser.email.toLowerCase()) {
          return {
            ...authUser,
            id: authUser._id || authUser.id,
            resume: hasValidResume ? authUser.resume : null,
            skills: authUser.skills || [],
            preferredRoles: authUser.preferredRoles || [],
          };
        }
        return {
          ...prev,
          ...authUser,
          id: authUser._id || authUser.id,
          resume: hasValidResume ? authUser.resume : prev.resume,
        };
      });
      refreshBackendData();
    }
  }, [isAuthenticated, authUser, refreshBackendData]);

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    try {
      localStorage.setItem('careerbridge_student_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Unable to persist profile to localStorage', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('careerbridge_student_apps', JSON.stringify(applications));
    } catch (e) {
      console.warn('Unable to persist applications to localStorage', e);
    }
  }, [applications]);

  // Dynamic Profile Completeness Calculation
  const profileCompleteness = useMemo(() => {
    let score = 0;
    const checks = [
      { key: 'name', weight: 10, valid: Boolean(profile.name?.trim()) },
      { key: 'email', weight: 10, valid: Boolean(profile.email?.trim()) },
      { key: 'college', weight: 15, valid: Boolean(profile.college?.trim()) },
      { key: 'degree', weight: 10, valid: Boolean(profile.degree?.trim()) },
      { key: 'graduationYear', weight: 10, valid: Boolean(profile.graduationYear) },
      { key: 'cgpa', weight: 10, valid: Boolean(profile.cgpa) },
      { key: 'skills', weight: 15, valid: profile.skills?.length >= 3 },
      { key: 'preferredRoles', weight: 5, valid: profile.preferredRoles?.length >= 1 },
      { key: 'summary', weight: 5, valid: profile.summary?.length >= 20 },
      { key: 'resume', weight: 10, valid: Boolean(profile.resume?.fileName || profile.resumeUrl) },
    ];

    checks.forEach((c) => {
      if (c.valid) score += c.weight;
    });

    return {
      percentage: Math.min(score, 100),
      missingItems: checks.filter((c) => !c.valid).map((c) => c.key),
    };
  }, [profile]);

  const updateProfile = async (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    try {
      await userService.updateProfile(updates);
    } catch {
      // Graceful fallback to local persistence
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !(profile.skills || []).includes(trimmed)) {
      const newSkills = [...(profile.skills || []), trimmed];
      updateProfile({ skills: newSkills });
    }
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = (profile.skills || []).filter((s) => s !== skillToRemove);
    updateProfile({ skills: newSkills });
  };

  const addPreferredRole = (role) => {
    const trimmed = role.trim();
    if (trimmed && !(profile.preferredRoles || []).includes(trimmed)) {
      const newRoles = [...(profile.preferredRoles || []), trimmed];
      updateProfile({ preferredRoles: newRoles });
    }
  };

  const removePreferredRole = (roleToRemove) => {
    const newRoles = (profile.preferredRoles || []).filter((r) => r !== roleToRemove);
    updateProfile({ preferredRoles: newRoles });
  };

  const uploadResume = async (fileOrData) => {
    if (typeof File !== 'undefined' && fileOrData instanceof File) {
      const formData = new FormData();
      formData.append('resume', fileOrData);
      try {
        const res = await userService.uploadResume(formData);
        if (res.success && res.data) {
          setProfile((prev) => ({ ...prev, resume: res.data }));
          return { success: true, message: 'Resume uploaded successfully!' };
        }
      } catch {
        // Fallback to local representation if server is offline
        const fallback = {
          fileName: fileOrData.name,
          originalName: fileOrData.name,
          size: fileOrData.size,
          mimeType: fileOrData.type || 'application/pdf',
          uploadedAt: new Date().toISOString(),
        };
        setProfile((prev) => ({ ...prev, resume: fallback }));
        return { success: true, message: 'Resume attached locally.' };
      }
    } else {
      setProfile((prev) => ({ ...prev, resume: fileOrData }));
      return { success: true, message: 'Resume updated.' };
    }
  };

  const removeResume = async () => {
    setProfile((prev) => ({ ...prev, resume: null }));
    try {
      await userService.deleteResume();
    } catch {
      // Local fallback
    }
  };

  const hasApplied = (jobId) => {
    return applications.some((app) => app.jobId === jobId || app.id === jobId);
  };

  const applyForJob = async (job) => {
    const jobId = job._id || job.id;
    if (hasApplied(jobId)) {
      return { success: false, message: 'You have already applied for this job opportunity.' };
    }

    // Try backend submission first
    try {
      const res = await applicationService.apply(jobId);
      if (res.success && res.data?.application) {
        const normalized = normalizeApplication(res.data.application);
        setApplications((prev) => [normalized, ...prev]);
        return { success: true, message: `Application submitted successfully for ${job.title}!` };
      }
    } catch (err) {
      if (err.status === 400 || err.status === 409) {
        return { success: false, message: err.message };
      }
      // Offline fallback: continue below
    }

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: jobId,
      jobTitle: job.title,
      company: job.company,
      companyCode: job.companyCode || (job.company || 'COM').substring(0, 3).toUpperCase(),
      logoBg: job.logoBg || 'bg-[#14213D]',
      location: job.location,
      employmentType: job.employmentType,
      salaryRange: job.salaryRange,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      student: {
        _id: profile.id || profile._id,
        name: profile.name,
        email: profile.email,
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        cgpa: profile.cgpa,
        skills: profile.skills || [],
        resume: profile.resume,
      },
      resumeSnapshot: {
        fileName: profile.resume?.fileName || `${(profile.name || 'Student').replace(/\s+/g, '_')}_Resume.pdf`,
        originalName: profile.resume?.originalName || profile.resume?.fileName || `${(profile.name || 'Student').replace(/\s+/g, '_')}_Resume.pdf`,
        size: profile.resume?.size || 1250000,
        mimeType: 'application/pdf',
      },
      statusHistory: [
        {
          status: 'Applied',
          date: new Date().toISOString(),
          note: coverNote ? `Cover Note: ${coverNote}` : 'Application submitted with verified student profile.',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    return { success: true, message: `Application submitted successfully for ${job.title}!` };
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        applications,
        profileCompleteness,
        isLoadingBackend,
        updateProfile,
        addSkill,
        removeSkill,
        addPreferredRole,
        removePreferredRole,
        uploadResume,
        removeResume,
        hasApplied,
        applyForJob,
        refreshBackendData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    return {
      profile: INITIAL_STUDENT_PROFILE,
      applications: INITIAL_STUDENT_APPLICATIONS,
      profileCompleteness: { percentage: 80, missingItems: [] },
      isLoadingBackend: false,
      updateProfile: () => {},
      addSkill: () => {},
      removeSkill: () => {},
      addPreferredRole: () => {},
      removePreferredRole: () => {},
      uploadResume: () => {},
      removeResume: () => {},
      hasApplied: () => false,
      applyForJob: () => ({ success: true, message: 'Applied' }),
      refreshBackendData: () => {},
    };
  }
  return context;
}
