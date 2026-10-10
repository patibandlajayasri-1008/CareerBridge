import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

const PORT = env.PORT || 5000;

// Attempt database connection on server bootstrap
connectDB().catch((err) => {
  console.warn('MongoDB initial connection attempt deferred:', err.message);
});

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CareerBridge Backend REST API Operational`);
  console.log(`  Environment : ${env.NODE_ENV}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`=======================================================`);
});

// Graceful process termination handling
const handleGracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Gracefully closing CareerBridge HTTP server...`);
  server.close(async () => {
    try {
      await disconnectDB();
    } catch {
      // Ignore disconnect errors during teardown
    }
    console.log('HTTP server and database connections closed successfully.');
    process.exit(0);
  });
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception thrown:', err);
});

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
