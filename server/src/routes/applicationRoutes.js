import { Router } from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicationStats,
  getAllApplicationsAdmin,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// All application routes require authenticated user session
router.use(verifyToken);

// Student endpoints
router.post('/', authorizeRoles('student'), applyForJob);
router.get('/my', authorizeRoles('student'), getMyApplications);
router.get('/stats', authorizeRoles('student'), getApplicationStats);

// Admin-only application review endpoints
router.get('/admin', authorizeRoles('admin'), getAllApplicationsAdmin);
router.patch('/:id/status', authorizeRoles('admin'), updateApplicationStatus);

export default router;
