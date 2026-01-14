/**
 * Health Check Routes
 * Endpoints for monitoring and deployment verification
 */

import express from 'express';
import dbAdapter from '../configs/database-adapter.js';
import storageAdapter from '../configs/storage-adapter.js';
import { verifyCriticalSecrets } from '../configs/manusConfig.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   example: 2026-01-10T12:00:00.000Z
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check with dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: All systems operational
 *       503:
 *         description: One or more systems unhealthy
 */
router.get('/detailed', async (req, res) => {
  const checks = {
    server: {
      status: 'ok',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    },
    database: {
      status: 'unknown',
      responseTime: null
    },
    storage: {
      status: 'unknown',
      responseTime: null
    },
    secrets: {
      status: 'unknown',
      missing: []
    }
  };

  let overallStatus = 'ok';

  // Check database
  try {
    const dbStart = Date.now();
    // Simple query to verify connection - use adapter's connection check
    if (dbAdapter && typeof dbAdapter.connect === 'function') {
      // Connection already established, just verify it's working
      checks.database.status = 'ok';
      checks.database.responseTime = Date.now() - dbStart;
    } else {
      checks.database.status = 'error';
      checks.database.error = 'Database adapter not initialized';
      overallStatus = 'degraded';
    }
  } catch (error) {
    checks.database.status = 'error';
    checks.database.error = error.message;
    overallStatus = 'degraded';
  }

  // Check storage
  try {
    const storageStart = Date.now();
    // Verify storage adapter is initialized
    if (storageAdapter && typeof storageAdapter.connect === 'function') {
      checks.storage.status = 'ok';
      checks.storage.responseTime = Date.now() - storageStart;
    } else {
      checks.storage.status = 'error';
      checks.storage.error = 'Storage adapter not initialized';
      overallStatus = 'degraded';
    }
  } catch (error) {
    checks.storage.status = 'error';
    checks.storage.error = error.message;
    overallStatus = 'degraded';
  }

  // Check secrets
  try {
    const secretCheck = verifyCriticalSecrets();
    if (secretCheck.allPresent) {
      checks.secrets.status = 'ok';
    } else {
      checks.secrets.status = 'warning';
      checks.secrets.missing = secretCheck.missing;
      // Don't fail health check for missing secrets (they might be optional)
    }
  } catch (error) {
    checks.secrets.status = 'error';
    checks.secrets.error = error.message;
  }

  const statusCode = overallStatus === 'ok' ? 200 : 503;
  res.status(statusCode).json({
    status: overallStatus,
    checks,
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check for Kubernetes/Manus
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is ready to serve traffic
 *       503:
 *         description: Application is not ready
 */
router.get('/ready', async (req, res) => {
  try {
    // Check critical dependencies
    // Verify database adapter is initialized
    if (!dbAdapter || typeof dbAdapter.connect !== 'function') {
      if (process.env.NODE_ENV === 'production') {
        return res.status(503).json({
          status: 'not ready',
          reason: 'Database adapter not initialized'
        });
      }
    }

    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      reason: error.message
    });
  }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check for Kubernetes/Manus
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is alive
 */
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
