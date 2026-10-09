import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Public job portal routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected Admin-only management endpoints
router.post('/', verifyToken, authorizeRoles('admin'), createJob);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateJob);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteJob);

export default router;
