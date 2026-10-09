import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Job from '../src/models/Job.js';
import Application from '../src/models/Application.js';

describe('Database Models & Schema Validation Tests', () => {
  describe('User Model', () => {
    it('fails validation when required fields (name, email, password) are missing', async () => {
      const user = new User({});
      let err;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    });

    it('rejects improperly formatted email addresses', async () => {
      const user = new User({
        name: 'Invalid Email User',
        email: 'invalid-email-format-without-at',
        password: 'validpassword123',
      });
      let err;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toContain('valid email address');
    });

    it('rejects passwords shorter than 8 characters', async () => {
      const user = new User({
        name: 'Short Password User',
        email: 'user@college.edu',
        password: '123',
      });
      let err;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toContain('at least 8 characters');
    });

    it('sets default role to student', () => {
      const user = new User({
        name: 'Default Role User',
        email: 'default@college.edu',
        password: 'validpassword123',
      });

      expect(user.role).toBe('student');
    });

    it('passes validation with complete valid student data', async () => {
      const user = new User({
        name: 'Priya Patel',
        email: 'priya@nitk.edu',
        password: 'securepassword123',
        college: 'NIT Karnataka',
        degree: 'B.Tech / B.E.',
        graduationYear: 2026,
        cgpa: 8.9,
        skills: ['React', 'Node.js', 'MongoDB'],
      });
      let err = null;
      try {
        await user.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeNull();
    });
  });

  describe('Job Model', () => {
    it('fails validation when mandatory job attributes are missing', async () => {
      const job = new Job({});
      let err;
      try {
        await job.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.company).toBeDefined();
      expect(err.errors.location).toBeDefined();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.deadline).toBeDefined();
      expect(err.errors.createdBy).toBeDefined();
    });

    it('sets default employment type to Full-Time and status to Published', () => {
      const dummyId = new mongoose.Types.ObjectId();
      const job = new Job({
        title: 'Cloud Engineer',
        company: 'Deloitte',
        location: 'Hyderabad',
        description: 'Cloud architecture design',
        deadline: new Date(),
        createdBy: dummyId,
      });

      expect(job.employmentType).toBe('Full-Time');
      expect(job.status).toBe('Published');
    });

    it('rejects unauthorized status values not in enum', async () => {
      const dummyId = new mongoose.Types.ObjectId();
      const job = new Job({
        title: 'QA Tester',
        company: 'Infosys',
        location: 'Bengaluru',
        description: 'Automated testing',
        deadline: new Date(),
        status: 'ArchivedBogusStatus',
        createdBy: dummyId,
      });
      let err;
      try {
        await job.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.status).toBeDefined();
    });
  });

  describe('Application Model & Duplicate Prevention Constraint', () => {
    it('requires student, job, and resumeSnapshot references', async () => {
      const app = new Application({});
      let err;
      try {
        await app.validate();
      } catch (e) {
        err = e;
      }

      expect(err).toBeDefined();
      expect(err.errors.student).toBeDefined();
      expect(err.errors.job).toBeDefined();
      expect(err.errors['resumeSnapshot.fileName']).toBeDefined();
    });

    it('defaults application status to Applied', () => {
      const studentId = new mongoose.Types.ObjectId();
      const jobId = new mongoose.Types.ObjectId();
      const app = new Application({
        student: studentId,
        job: jobId,
        resumeSnapshot: {
          fileName: 'resume.pdf',
          originalName: 'resume.pdf',
        },
      });

      expect(app.status).toBe('Applied');
    });

    it('declares compound unique index on { job: 1, student: 1 } preventing duplicate applications', () => {
      const indexes = Application.schema.indexes();
      const compoundUniqueIndex = indexes.find(
        ([fields, options]) =>
          fields.job === 1 && fields.student === 1 && options?.unique === true
      );

      expect(compoundUniqueIndex).toBeDefined();
      expect(compoundUniqueIndex[1].unique).toBe(true);
    });
  });
});
