import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Application from '../src/models/Application.js';
import { generateToken } from '../src/utils/token.js';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../src/middleware/uploadMiddleware.js';

describe('Secure Resume Upload & Authorization Tests', () => {
  const studentAToken = generateToken({ id: '66f000000000000000000001', role: 'student' });
  const studentBToken = generateToken({ id: '66f000000000000000000002', role: 'student' });
  const adminToken = generateToken({ id: '66f000000000000000000099', role: 'admin' });

  const dummyPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects unauthenticated resume upload with 401', async () => {
    const res = await request(app)
      .post('/api/v1/users/resume')
      .attach('resume', dummyPdfBuffer, 'test_resume.pdf');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects non-PDF files with 400 Bad Request', async () => {
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000001',
      role: 'student',
      name: 'Student A',
    });

    const res = await request(app)
      .post('/api/v1/users/resume')
      .set('Authorization', `Bearer ${studentAToken}`)
      .attach('resume', Buffer.from('hello plain text'), 'malicious.txt');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/pdf/i);
  });

  it('accepts valid PDF resume and updates student profile', async () => {
    const mockStudent = {
      _id: '66f000000000000000000001',
      role: 'student',
      name: 'Student A',
      resume: null,
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(User, 'findById').mockResolvedValue(mockStudent);

    const res = await request(app)
      .post('/api/v1/users/resume')
      .set('Authorization', `Bearer ${studentAToken}`)
      .attach('resume', dummyPdfBuffer, 'alex_chen_resume.pdf');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.originalName).toBe('alex_chen_resume.pdf');
    expect(res.body.data.mimeType).toBe('application/pdf');
    expect(mockStudent.save).toHaveBeenCalled();
  });

  it('blocks Student B from downloading Student A private resume with 403 Forbidden', async () => {
    // Create a temporary file on disk to test access control
    const testFileName = `test-resume-studentA-${Date.now()}.pdf`;
    const testFilePath = path.join(UPLOAD_DIR, testFileName);
    fs.writeFileSync(testFilePath, dummyPdfBuffer);

    // Student B tries to access it
    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000002',
      role: 'student',
      name: 'Student B',
      resume: { fileName: 'student_b_resume.pdf' },
    });
    vi.spyOn(Application, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/v1/users/resume/${testFileName}`)
      .set('Authorization', `Bearer ${studentBToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/access denied/i);

    // Cleanup
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  });

  it('allows Admin to download student resume document successfully', async () => {
    const testFileName = `test-resume-admin-view-${Date.now()}.pdf`;
    const testFilePath = path.join(UPLOAD_DIR, testFileName);
    fs.writeFileSync(testFilePath, dummyPdfBuffer);

    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: '66f000000000000000000099',
      role: 'admin',
      name: 'Placement Admin',
    });

    const res = await request(app)
      .get(`/api/v1/users/resume/${testFileName}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');

    // Cleanup
    if (fs.existsSync(testFilePath)) fs.unlinkSync(testFilePath);
  });
});
