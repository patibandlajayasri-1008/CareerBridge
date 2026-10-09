import { verifyJwt } from '../utils/token.js';
import { sendError } from '../utils/responseFormatter.js';
import User from '../models/User.js';

/**
 * Verify JWT Token Middleware
 * Extracts token from HttpOnly Cookie OR Authorization: Bearer Header
 */
export const verifyToken = async (req, res, next) => {
  let token = null;

  // 1. Check HttpOnly Cookie
  if (req.cookies && req.cookies.careerbridge_token) {
    token = req.cookies.careerbridge_token;
  }
  // 2. Fallback to Authorization: Bearer <token> header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(
      res,
      401,
      'Authentication required. Please sign in to access this resource.'
    );
  }

  try {
    const decoded = verifyJwt(token);

    // Verify user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return sendError(
        res,
        401,
        'The account belonging to this session token no longer exists.'
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Your session has expired. Please sign in again.');
    }
    return sendError(res, 401, 'Invalid authentication token. Authorization denied.');
  }
};
