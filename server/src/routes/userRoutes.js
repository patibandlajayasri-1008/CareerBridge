import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  deleteResume,
  downloadResume,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { handleResumeUpload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Protect all user routes with JWT session verification
router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Resume upload, deletion, and authorized download endpoints
router.post('/resume', handleResumeUpload, uploadResume);
router.delete('/resume', deleteResume);
router.get('/resume/:fileName', downloadResume);

export default router;
