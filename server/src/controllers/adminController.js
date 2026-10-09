import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { sendSuccess } from '../utils/responseFormatter.js';

/**
 * @desc    Get aggregate placement metrics and summary for Admin Dashboard
 * @route   GET /api/v1/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalJobs,
      publishedJobs,
      totalStudents,
      totalApplications,
      appliedCount,
      underReviewCount,
      shortlistedCount,
      selectedCount,
      rejectedCount,
      recentApplications,
    ] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Published' }),
      User.countDocuments({ role: 'student' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Applied' }),
      Application.countDocuments({ status: 'Under Review' }),
      Application.countDocuments({ status: 'Shortlisted' }),
      Application.countDocuments({ status: 'Selected' }),
      Application.countDocuments({ status: 'Rejected' }),
      Application.find()
        .sort({ appliedAt: -1, createdAt: -1 })
        .limit(5)
        .populate('job', 'title company')
        .populate('student', 'name email college cgpa'),
    ]);

    const stats = {
      totalJobs,
      publishedJobs,
      totalStudents,
      totalApplications,
      statusBreakdown: {
        applied: appliedCount,
        underReview: underReviewCount,
        shortlisted: shortlistedCount,
        selected: selectedCount,
        rejected: rejectedCount,
      },
      recentApplications,
    };

    return sendSuccess(res, 200, 'Placement analytics loaded successfully.', stats);
  } catch (error) {
    next(error);
  }
};
