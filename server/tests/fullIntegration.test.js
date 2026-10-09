import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import Application from '../src/models/Application.js';
import { generateToken } from '../src/utils/token.js';

describe('CareerBridge End-to-End Placement Lifecycle Test', () => {
  const studentId = '66f000000000000000000001';
  const adminId = '66f000000000000000000099';
  const jobId = '66f000000000000000000100';
  const applicationId = '66f000000000000000000200';

  const studentToken = generateToken({ id: studentId, role: 'student' });
  const adminToken = generateToken({ id: adminId, role: 'admin' });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Step 1: Public guest visits health check and API greeting', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('operational');
  });

  it('Step 2: Admin publishes a new campus recruitment drive', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: adminId,
      role: 'admin',
      name: 'Placement Officer',
    });

    const mockJob = {
      _id: jobId,
      title: 'Full Stack Cloud Engineer',
      company: 'Thoughtworks',
      location: 'Hyderabad / Hybrid',
      employmentType: 'Full-Time',
      salaryRange: '₹10.5 LPA - ₹14.0 LPA',
      deadline: new Date(Date.now() + 86400000 * 30),
      description: 'Engineering role for modern distributed systems.',
      status: 'Published',
      createdBy: adminId,
    };

    vi.spyOn(Job, 'create').mockResolvedValue(mockJob);

    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Full Stack Cloud Engineer',
        company: 'Thoughtworks',
        location: 'Hyderabad / Hybrid',
        employmentType: 'Full-Time',
        salaryRange: '₹10.5 LPA - ₹14.0 LPA',
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        description: 'Engineering role for modern distributed systems.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.company).toBe('Thoughtworks');
  });

  it('Step 3: Student explores available jobs with keyword filter', async () => {
    const mockJobsList = [
      {
        _id: jobId,
        title: 'Full Stack Cloud Engineer',
        company: 'Thoughtworks',
        location: 'Hyderabad / Hybrid',
        employmentType: 'Full-Time',
        salaryRange: '₹10.5 LPA - ₹14.0 LPA',
        status: 'Published',
      },
    ];

    vi.spyOn(Job, 'countDocuments').mockResolvedValue(1);
    vi.spyOn(Job, 'find').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(mockJobsList),
    });

    const res = await request(app).get('/api/v1/jobs?q=Cloud');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it('Step 4: Student applies for the drive and receives confirmation', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: studentId,
      role: 'student',
      name: 'Alex Chen',
      resume: { fileName: 'alex_chen_resume.pdf' },
    });

    vi.spyOn(Job, 'findById').mockResolvedValue({
      _id: jobId,
      title: 'Full Stack Cloud Engineer',
      status: 'Published',
      deadline: new Date(Date.now() + 86400000 * 10),
    });

    const mockApplication = {
      _id: applicationId,
      student: studentId,
      job: jobId,
      status: 'Applied',
      statusHistory: [{ status: 'Applied', date: new Date() }],
    };

    vi.spyOn(Application, 'create').mockResolvedValue(mockApplication);

    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Applied');
  });

  it('Step 5: Duplicate application attempt is rejected with 400', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: studentId,
      role: 'student',
      name: 'Alex Chen',
      resume: { fileName: 'alex_chen_resume.pdf' },
    });

    vi.spyOn(Job, 'findById').mockResolvedValue({
      _id: jobId,
      title: 'Full Stack Cloud Engineer',
      status: 'Published',
      deadline: new Date(Date.now() + 86400000 * 10),
    });

    // Simulate MongoDB duplicate key error (code 11000)
    const duplicateError = new Error('E11000 duplicate key error');
    duplicateError.code = 11000;
    vi.spyOn(Application, 'create').mockRejectedValue(duplicateError);

    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ jobId });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already submitted/i);
  });

  it('Step 6: Admin reviews application and promotes status to Shortlisted', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: adminId,
      role: 'admin',
      name: 'Placement Officer',
    });

    const mockAppDoc = {
      _id: applicationId,
      status: 'Applied',
      statusHistory: [{ status: 'Applied', date: new Date() }],
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Application, 'findById')
      .mockResolvedValueOnce(mockAppDoc)
      .mockReturnValueOnce({
        populate: vi.fn().mockReturnValue({
          populate: vi.fn().mockResolvedValue({
            _id: applicationId,
            status: 'Shortlisted',
            job: { title: 'Full Stack Cloud Engineer', company: 'Thoughtworks' },
            student: { name: 'Alex Chen', email: 'alex@university.edu' },
          }),
        }),
      });

    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'Shortlisted',
        note: 'Candidate cleared technical screening round 1.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Shortlisted');
  });

  it('Step 7: Student tracks application and observes updated status', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: studentId,
      role: 'student',
      name: 'Alex Chen',
    });

    const mockStudentApps = [
      {
        _id: applicationId,
        student: studentId,
        status: 'Shortlisted',
        job: {
          title: 'Full Stack Cloud Engineer',
          company: 'Thoughtworks',
          salaryRange: '₹10.5 LPA - ₹14.0 LPA',
        },
      },
    ];

    vi.spyOn(Application, 'find').mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      populate: vi.fn().mockResolvedValue(mockStudentApps),
    });

    const res = await request(app)
      .get('/api/v1/applications/my')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].status).toBe('Shortlisted');
  });
});
