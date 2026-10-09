import { sendError } from '../utils/responseFormatter.js';

/**
 * Role-Based Access Control (RBAC) Guard
 * Restricts access to specified roles (e.g. 'admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(
        res,
        401,
        'Authentication required prior to role authorization.'
      );
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Your current account role ('${req.user.role}') is not authorized to access this administrative endpoint.`
      );
    }

    next();
  };
};
