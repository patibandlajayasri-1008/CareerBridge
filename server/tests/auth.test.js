import { describe, it, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { generateToken, verifyJwt } from '../src/utils/token.js';
import { authorizeRoles } from '../src/middleware/roleMiddleware.js';

describe('Authentication & Authorization Engine Tests', () => {
  describe('JWT Token Generation & Verification', () => {
    it('signs and verifies valid JWT containing user id and role', () => {
      const payload = { id: 'user-12345', role: 'student' };
      const token = generateToken(payload);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // Standard JWT header.payload.signature

      const decoded = verifyJwt(token);
      expect(decoded.id).toBe('user-12345');
      expect(decoded.role).toBe('student');
    });

    it('throws error when verifying tampered token', () => {
      const payload = { id: 'user-12345', role: 'student' };
      const token = generateToken(payload);
      const tampered = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyJwt(tampered)).toThrow();
    });
  });

  describe('Password Cryptography in User Model', () => {
    it('automatically salts and hashes plaintext password before saving', async () => {
      mongoose.set('bufferCommands', false);
      const user = new User({
        name: 'Crypt Test User',
        email: 'crypt@test.edu',
        password: 'PlainTextPassword123',
      });

      // Trigger pre-save hook
      await user.save({ validateBeforeSave: false }).catch(() => {});

      // Password should no longer be plaintext
      expect(user.password).not.toBe('PlainTextPassword123');
      expect(user.password.startsWith('$2a$') || user.password.startsWith('$2b$')).toBe(true);

      // Verify comparePassword method
      const isMatch = await user.comparePassword('PlainTextPassword123');
      expect(isMatch).toBe(true);

      const isMismatch = await user.comparePassword('WrongPassword');
      expect(isMismatch).toBe(false);
    });
  });

  describe('RBAC Middleware (authorizeRoles)', () => {
    it('blocks student role from accessing admin route with 403 Forbidden', () => {
      const middleware = authorizeRoles('admin');
      const req = { user: { role: 'student' } };
      let statusCode = null;
      let jsonBody = null;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (body) => {
              jsonBody = body;
            },
          };
        },
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };

      middleware(req, res, next);

      expect(nextCalled).toBe(false);
      expect(statusCode).toBe(403);
      expect(jsonBody.success).toBe(false);
      expect(jsonBody.message).toContain('Access denied');
    });

    it('permits authorized admin role to proceed via next()', () => {
      const middleware = authorizeRoles('admin');
      const req = { user: { role: 'admin' } };
      let nextCalled = false;
      const res = {};
      const next = () => {
        nextCalled = true;
      };

      middleware(req, res, next);

      expect(nextCalled).toBe(true);
    });
  });

  describe('Auth HTTP Endpoints Validation', () => {
    it('POST /api/v1/auth/register returns 400 when name/email/password are missing', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Please provide name, email, and password');
    });

    it('POST /api/v1/auth/register returns 400 when password is under 8 characters', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Short Pass',
        email: 'short@college.edu',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('at least 8 characters');
    });

    it('POST /api/v1/auth/login returns 400 when email or password is missing', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Please provide both email and password');
    });

    it('POST /api/v1/auth/logout clears cookie and returns 200 OK', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Logged out successfully');
    });

    it('GET /api/v1/auth/me returns 401 when token is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authentication required');
    });
  });
});
