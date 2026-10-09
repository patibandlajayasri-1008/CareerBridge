import { Router } from 'express';
import { sendSuccess } from '../utils/responseFormatter.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/health', (req, res) => {
  const healthData = {
    service: 'CareerBridge Placement REST API',
    status: 'operational',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
  };

  return sendSuccess(res, 200, 'CareerBridge API is healthy and operational', healthData);
});

export default router;
