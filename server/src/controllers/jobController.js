import Job from '../models/Job.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import mongoose from 'mongoose';

/**
 * @desc    Get all published jobs with search, filtering, sorting, and pagination
 * @route   GET /api/v1/jobs
 * @access  Public
 */
export const getJobs = async (req, res, next) => {
  try {
    const { q, location, type, skills, sortBy, page = 1, limit = 12 } = req.query;

    const query = { status: 'Published' };

    // Search keyword across title, company, and requiredSkills
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { requiredSkills: { $in: [searchRegex] } },
      ];
    }

    // Location filter
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Employment Type filter
    if (type && type !== 'All') {
      query.employmentType = type;
    }

    // Skills filter (supports comma-separated string or array)
    if (skills) {
      const skillsList = Array.isArray(skills) ? skills : skills.split(',');
      const skillRegexes = skillsList.map((s) => new RegExp(s.trim(), 'i'));
      query.requiredSkills = { $in: skillRegexes };
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === 'deadline') {
      sortOptions = { deadline: 1 };
    } else if (sortBy === 'salary') {
      sortOptions = { salaryRange: -1 };
    }

    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 12;
    const skip = (currentPage - 1) * itemsPerPage;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .populate('createdBy', 'name email');

    return sendSuccess(res, 200, 'Jobs retrieved successfully', jobs, {
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job by ID with detailed criteria
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid job listing ID format.');
    }

    const job = await Job.findById(id).populate('createdBy', 'name email');
    if (!job) {
      return sendError(res, 404, 'Job listing not found or has been closed.');
    }

    return sendSuccess(res, 200, 'Job details retrieved successfully', job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new campus placement drive listing
 * @route   POST /api/v1/jobs
 * @access  Private (Admin)
 */
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      companyCode,
      location,
      employmentType,
      salaryRange,
      experienceLevel,
      openings,
      deadline,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      eligibilityCriteria,
      logoBg,
      status = 'Published',
    } = req.body;

    if (!title || !company || !location || !employmentType || !salaryRange || !deadline || !description) {
      return sendError(res, 400, 'Please provide all mandatory job details.');
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      companyCode: companyCode?.trim() || company.trim().substring(0, 3).toUpperCase(),
      location: location.trim(),
      employmentType,
      salaryRange: salaryRange.trim(),
      experienceLevel: experienceLevel || 'Entry Level',
      openings: openings || 1,
      deadline: new Date(deadline),
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      eligibilityCriteria: eligibilityCriteria || {
        minCgpa: 6.0,
        allowedBatches: [2025, 2026],
        allowedDegrees: ['B.Tech / B.E.', 'MCA'],
      },
      logoBg: logoBg || 'bg-[#14213D]',
      status,
      createdBy: req.user._id,
    });

    return sendSuccess(res, 201, 'Campus placement opportunity published successfully.', job);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing job listing
 * @route   PUT /api/v1/jobs/:id
 * @access  Private (Admin)
 */
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid job listing ID format.');
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return sendError(res, 404, 'Job listing not found.');
    }

    return sendSuccess(res, 200, 'Job listing updated successfully.', updatedJob);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job listing
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Admin)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid job listing ID format.');
    }

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return sendError(res, 404, 'Job listing not found.');
    }

    return sendSuccess(res, 200, 'Job opportunity removed successfully.');
  } catch (error) {
    next(error);
  }
};
