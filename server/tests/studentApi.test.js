import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Job from '../src/models/Job.js';

describe('Student REST API & Route Guard Tests', () => {
  it('GET /api/v1/jobs returns public opportunities list without requiring auth', async () => {
    // Mock Job.find and countDocuments
    const mockJobs = [
      {
        _id: '66f000000000000000000001',
        title: 'Full Stack Engineer',
        company: 'Zoho Corporation',
        location: 'Chennai / Remote',
        employmentType: 'Full-time',
        salaryRange: '₹8.0 LPA - ₹12.0 LPA',
        status: 'published',
      },
    ];

    vi.spyOn(Job, 'find').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(mockJobs),
    });
    vi.spyOn(Job, 'countDocuments').mockResolvedValue(1);

    const res = await request(app).get('/api/v1/jobs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Full Stack Engineer');

    vi.restoreAllMocks();
  });

  it('GET /api/v1/users/profile rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/users/profile');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/authentication required/i);
  });

  it('GET /api/v1/applications/my rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/applications/my');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/authentication required/i);
  });

  it('POST /api/v1/applications rejects unauthenticated request with 401', async () => {
    const res = await request(app)
      .post('/api/v1/applications')
      .send({ jobId: '66f000000000000000000001' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/authentication required/i);
  });
});
