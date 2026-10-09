import { Router } from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Protect all admin routes with authentication and admin role enforcement
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/stats', getAdminStats);

export default router;
