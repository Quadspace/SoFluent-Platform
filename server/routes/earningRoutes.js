/**
 * Earning Routes
 * Learn-to-Earn Real Money System API endpoints
 */

import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import {
  recordEarning,
  getUserEarnings,
  getEarningStats,
  approveEarning,
  rejectEarning,
  getPendingEarnings
} from '../controllers/earningController.js';

const router = express.Router();

/**
 * @swagger
 * /api/earnings/record:
 *   post:
 *     summary: Record a new earning (internal use)
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - source
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in R$
 *               source:
 *                 type: string
 *                 enum: [referral, content_creation, mission, streak, achievement, daily_login, challenge]
 *               relatedId:
 *                 type: string
 *               relatedType:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Earning recorded
 */
router.post('/record', clerkMiddleware(), recordEarning);

/**
 * @swagger
 * /api/earnings:
 *   get:
 *     summary: Get user's earnings history
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, paid]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: monthlyPeriod
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Earnings list
 */
router.get('/', clerkMiddleware(), getUserEarnings);

/**
 * @swagger
 * /api/earnings/stats:
 *   get:
 *     summary: Get user's earning statistics
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earning statistics
 */
router.get('/stats', clerkMiddleware(), getEarningStats);

/**
 * @swagger
 * /api/earnings/{id}/approve:
 *   post:
 *     summary: Approve a pending earning (admin only)
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Earning approved
 */
router.post('/:id/approve', clerkMiddleware(), approveEarning);

/**
 * @swagger
 * /api/earnings/{id}/reject:
 *   post:
 *     summary: Reject a pending earning (admin only)
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Earning rejected
 */
router.post('/:id/reject', clerkMiddleware(), rejectEarning);

/**
 * @swagger
 * /api/earnings/pending:
 *   get:
 *     summary: Get all pending earnings (admin only)
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Pending earnings list
 */
router.get('/pending', clerkMiddleware(), getPendingEarnings);

export default router;
