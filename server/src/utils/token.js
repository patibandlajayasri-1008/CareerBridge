import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendSuccess } from './responseFormatter.js';

/**
 * Sign a JSON Web Token with user payload
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JSON Web Token
 */
export const verifyJwt = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Issue JWT token via HttpOnly Cookie and JSON response payload
 */
export const sendTokenResponse = (user, statusCode, res, message = 'Authenticated successfully') => {
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Crucial: Prevents client-side scripts from reading the token (XSS protection)
    secure: env.NODE_ENV === 'production', // Transmitted strictly over HTTPS in production
    sameSite: 'lax', // CSRF mitigation
  };

  res.cookie('careerbridge_token', token, cookieOptions);

  // Return sanitized user object (excluding password)
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  return sendSuccess(res, statusCode, message, {
    token, // Provided for Authorization: Bearer fallback headers
    user: userObj,
  });
};

/**
 * Clear the authentication cookie upon logout
 */
export const clearTokenCookie = (res) => {
  res.cookie('careerbridge_token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });
};
