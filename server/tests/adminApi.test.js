import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import Application from '../src/models/Application.js';
import { generateToken } from '../src/utils/token.js';

describe('Admin REST API & RBAC Security Tests', () => {
  const studentToken = generateToken({ id: '66f000000000000000000010', role: 'student' });
  const adminToken = generateToken({ id: '66f000000000000000000099', role: 'admin' });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated request to GET /api/v1/admin/stats with 401', async () => {
    const res = await request(app).get('/api/v1/admin/stats');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects unauthenticated request to POST /api/v1/jobs with 401', async () => {
    const res = await request(app).post('/api/v1/jobs').send({
      title: 'DevOps Engineer',
      company: 'Amazon Web Services',
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('blocks student token from accessing GET /api/v1/admin/stats with 403 Forbidden', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000010',
      role: 'student',
      name: 'Test Student',
    });

    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/access denied/i);
  });

  it('blocks student token from creating jobs at POST /api/v1/jobs with 403 Forbidden', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000010',
      role: 'student',
      name: 'Test Student',
    });

    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'Unauthorized Job',
        company: 'Fake Corp',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('blocks student token from accessing GET /api/v1/applications/admin with 403 Forbidden', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000010',
      role: 'student',
      name: 'Test Student',
    });

    const res = await request(app)
      .get('/api/v1/applications/admin')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('allows authorized admin token to fetch GET /api/v1/admin/stats successfully', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000099',
      role: 'admin',
      name: 'Placement Administrator',
    });

    vi.spyOn(Job, 'countDocuments').mockResolvedValue(12);
    vi.spyOn(User, 'countDocuments').mockResolvedValue(45);
    vi.spyOn(Application, 'countDocuments').mockResolvedValue(28);
    vi.spyOn(Application, 'find').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockReturnValue({
        populate: vi.fn().mockResolvedValue([]),
      }),
    });

    const res = await request(app)
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalJobs).toBe(12);
    expect(res.body.data.totalStudents).toBe(45);
  });
});
