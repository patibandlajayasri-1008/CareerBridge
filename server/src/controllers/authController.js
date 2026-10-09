import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import { sendTokenResponse, clearTokenCookie } from '../utils/token.js';

/**
 * @desc    Register a new student account
 * @route   POST /api/v1/auth/register
 * @access  Public (Enforces role: 'student')
 */
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      college,
      degree,
      branch,
      graduationYear,
      cgpa,
      skills,
      preferredRoles,
      phone,
    } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password.');
    }

    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters long.');
    }

    // Check for duplicate account
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    // SECURITY ENFORCEMENT: Public signup is strictly locked to 'student' role.
    // Administrator accounts can never be created via public registration.
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
      college: college || '',
      degree: degree || 'B.Tech / B.E.',
      branch: branch || '',
      graduationYear: graduationYear || 2026,
      cgpa: cgpa || null,
      skills: Array.isArray(skills) ? skills : [],
      preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : [],
      phone: phone || '',
    });

    return sendTokenResponse(newUser, 201, res, 'Student account created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user (student or admin) and issue JWT session
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide both email and password.');
    }

    // Retrieve user and explicitly include password hash
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      // Intentionally generic response to prevent user enumeration attacks
      return sendError(res, 401, 'Invalid email address or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email address or password.');
    }

    return sendTokenResponse(user, 200, res, `Signed in successfully as ${user.role}`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out current user and clear session cookie
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  clearTokenCookie(res);
  return sendSuccess(res, 200, 'Logged out successfully');
};

/**
 * @desc    Get currently authenticated user session
 * @route   GET /api/v1/auth/me
 * @access  Private (Authenticated)
 */
export const getMe = (req, res) => {
  return sendSuccess(res, 200, 'Current session profile retrieved', req.user);
};
