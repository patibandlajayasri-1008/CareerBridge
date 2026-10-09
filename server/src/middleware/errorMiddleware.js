import { env } from '../config/env.js';
import { sendError } from '../utils/responseFormatter.js';

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(
    res,
    404,
    `Route not found: [${req.method}] ${req.originalUrl}`
  );
};

/**
 * Global Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message = err.message || 'An unexpected internal server error occurred';

  const errors = err.errors || null;

  // Log error details safely on server (never expose secrets or personal tokens)
  if (env.NODE_ENV !== 'test') {
    console.error(`[ERROR] [${req.method}] ${req.originalUrl}:`, {
      message: err.message,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  const response = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;
  if (env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
