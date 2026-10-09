import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import mongoose from 'mongoose';

/**
 * @desc    Submit application for a campus job opening
 * @route   POST /api/v1/applications
 * @access  Private (Student)
 */
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return sendError(res, 400, 'A valid job ID is required to apply.');
    }

    // Verify job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Published') {
      return sendError(res, 404, 'This job listing is no longer accepting applications.');
    }

    // Check application deadline
    if (new Date(job.deadline) < new Date()) {
      return sendError(res, 400, 'The deadline for this job posting has already passed.');
    }

    // Retrieve student profile
    const student = await User.findById(req.user._id);
    if (!student) {
      return sendError(res, 404, 'Student account not found.');
    }

    // Attempt creation with atomic compound index protection
    try {
      const application = await Application.create({
        student: student._id,
        job: job._id,
        resumeSnapshot: {
          fileName: student.resume?.fileName || 'resume.pdf',
          originalName: student.resume?.originalName || student.resume?.fileName || 'resume.pdf',
          size: student.resume?.size || 0,
          mimeType: student.resume?.mimeType || 'application/pdf',
        },
        status: 'Applied',
        statusHistory: [
          {
            status: 'Applied',
            date: new Date(),
            note: 'Application submitted successfully with verified student profile.',
          },
        ],
      });

      return sendSuccess(res, 201, `Application submitted successfully for ${job.title}!`, application);
    } catch (dbError) {
      // Handle MongoDB E11000 duplicate key error
      if (dbError.code === 11000) {
        return sendError(res, 400, 'You have already submitted an application for this job posting.');
      }
      throw dbError;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications submitted by the logged in student
 * @route   GET /api/v1/applications/my
 * @access  Private (Student)
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .sort({ appliedAt: -1 })
      .populate('job', 'title company companyCode location employmentType salaryRange deadline status logoBg');

    return sendSuccess(res, 200, 'Your applications retrieved successfully', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student application statistics breakdown
 * @route   GET /api/v1/applications/stats
 * @access  Private (Student)
 */
export const getApplicationStats = async (req, res, next) => {
  try {
    const apps = await Application.find({ student: req.user._id });

    const stats = {
      total: apps.length,
      applied: 0,
      underReview: 0,
      shortlisted: 0,
      selected: 0,
      rejected: 0,
    };

    apps.forEach((a) => {
      if (a.status === 'Applied') stats.applied += 1;
      else if (a.status === 'Under Review') stats.underReview += 1;
      else if (a.status === 'Shortlisted') stats.shortlisted += 1;
      else if (a.status === 'Selected') stats.selected += 1;
      else if (a.status === 'Rejected') stats.rejected += 1;
    });

    return sendSuccess(res, 200, 'Application statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications across drives for placement administrators
 * @route   GET /api/v1/applications/admin
 * @access  Private (Admin)
 */
export const getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, jobId, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .sort({ appliedAt: -1, createdAt: -1 })
      .populate('job', 'title company location employmentType salaryRange status')
      .populate(
        'student',
        'name email college degree graduationYear cgpa skills phone resume resumeUrl'
      );

    let results = applications;
    if (search) {
      const q = search.toLowerCase();
      results = applications.filter((app) => {
        const studentName = app.student?.name?.toLowerCase() || '';
        const studentEmail = app.student?.email?.toLowerCase() || '';
        const jobTitle = app.job?.title?.toLowerCase() || '';
        const company = app.job?.company?.toLowerCase() || '';
        return (
          studentName.includes(q) ||
          studentEmail.includes(q) ||
          jobTitle.includes(q) ||
          company.includes(q)
        );
      });
    }

    return sendSuccess(res, 200, 'Applications retrieved successfully for admin review.', results, {
      total: results.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application recruitment status and append history
 * @route   PATCH /api/v1/applications/:id/status
 * @access  Private (Admin)
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];
    if (!status || !validStatuses.includes(status)) {
      return sendError(
        res,
        400,
        `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid application ID format.');
    }

    const application = await Application.findById(id);
    if (!application) {
      return sendError(res, 404, 'Application not found.');
    }

    application.status = status;
    application.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Application status transitioned to ${status} by placement admin.`,
    });

    await application.save();

    const populatedApp = await Application.findById(id)
      .populate('job', 'title company location employmentType')
      .populate('student', 'name email college degree graduationYear cgpa');

    return sendSuccess(
      res,
      200,
      `Application status updated to "${status}" successfully.`,
      populatedApp
    );
  } catch (error) {
    next(error);
  }
};
