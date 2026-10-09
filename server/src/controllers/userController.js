import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { UPLOAD_DIR } from '../middleware/uploadMiddleware.js';

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/v1/users/profile
 * @access  Private (Student & Admin)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }
    return sendSuccess(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student profile details
 * @route   PUT /api/v1/users/profile
 * @access  Private (Student)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'name',
      'college',
      'degree',
      'branch',
      'graduationYear',
      'cgpa',
      'phone',
      'skills',
      'preferredRoles',
      'summary',
      'resume',
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, 'Student profile updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload verified PDF resume to student profile
 * @route   POST /api/v1/users/resume
 * @access  Private (Student)
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please select a valid PDF file to upload.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    // Clean up previous resume file from disk if present
    if (user.resume && user.resume.fileName) {
      const oldFilePath = path.join(UPLOAD_DIR, path.basename(user.resume.fileName));
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch {
          // Ignore cleanup errors
        }
      }
    }

    // Save resume document metadata
    user.resume = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await user.save();

    return sendSuccess(
      res,
      200,
      'Resume uploaded and attached to student profile successfully.',
      user.resume
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student profile resume document
 * @route   DELETE /api/v1/users/resume
 * @access  Private (Student)
 */
export const deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    if (user.resume && user.resume.fileName) {
      const filePath = path.join(UPLOAD_DIR, path.basename(user.resume.fileName));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // Ignore unlink errors
        }
      }
    }

    user.resume = {
      originalName: null,
      fileName: null,
      mimeType: null,
      size: null,
      uploadedAt: null,
    };

    await user.save();

    return sendSuccess(res, 200, 'Resume removed from student profile.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Protected stream/download of student resume PDF
 * @route   GET /api/v1/users/resume/:fileName
 * @access  Private (Student owner or Admin only)
 */
export const downloadResume = async (req, res, next) => {
  try {
    const { fileName } = req.params;

    // Prevent path traversal attack by stripping directory components
    const safeFileName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeFileName);

    // Verify file exists on disk
    if (!fs.existsSync(filePath)) {
      return sendError(res, 404, 'Requested resume file not found on server.');
    }

    // Access authorization check:
    // 1. Placement Admins can view any student resume.
    // 2. The student owner can view their own resume.
    // 3. Alternatively, check if the file belongs to an application of the user.
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.resume?.fileName === safeFileName;

    if (!isAdmin && !isOwner) {
      // Check if student applied with this snapshot
      const userApp = await Application.findOne({
        student: req.user._id,
        'resumeSnapshot.fileName': safeFileName,
      });

      if (!userApp) {
        return sendError(
          res,
          403,
          'Access denied. You are not authorized to view this candidate resume.'
        );
      }
    }

    // Set secure PDF headers and send file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(safeFileName)}"`
    );
    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
