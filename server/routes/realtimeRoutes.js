/**
 * Real-Time Routes
 * Top 1% Enhancement: Real-time activity feed
 */

import express from "express";
import { protect } from '@clerk/express';
import realtimeService from '../services/realtimeService.js';

const realtimeRouter = express.Router();

/**
 * @swagger
 * /api/realtime/feed:
 *   get:
 *     summary: Get real-time activity feed (SSE)
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     description: Server-Sent Events endpoint for real-time activity feed
 *     responses:
 *       200:
 *         description: SSE stream connection
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
/**
 * GET /api/realtime/feed
 * SSE endpoint for real-time activity feed
 * Uses protect() middleware which works with Clerk's authentication
 */
realtimeRouter.get('/feed', protect(), (req, res) => {
  const userId = req.auth.userId;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx

  // Add client to real-time service
  realtimeService.addClient(userId, res);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    try {
      res.write(': keep-alive\n\n');
    } catch (error) {
      clearInterval(keepAlive);
      realtimeService.removeClient(userId);
    }
  }, 30000); // Send keep-alive every 30 seconds

  // Clean up on close
  req.on('close', () => {
    clearInterval(keepAlive);
    realtimeService.removeClient(userId);
  });
});

/**
 * @swagger
 * /api/realtime/active-users:
 *   get:
 *     summary: Get active users count
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active users count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 */
/**
 * GET /api/realtime/active-users
 * Get current active users count
 */
realtimeRouter.get('/active-users', protect(), (req, res) => {
  const count = realtimeService.getActiveUsersCount();
  res.json({
    success: true,
    count
  });
});

export default realtimeRouter;
