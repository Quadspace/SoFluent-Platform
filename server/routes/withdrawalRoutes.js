/**
 * Withdrawal Routes
 * Learn-to-Earn Real Money System - Withdrawal API endpoints
 */

import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import {
  createWithdrawal,
  getUserWithdrawals,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  processWithdrawal
} from '../controllers/withdrawalController.js';

const router = express.Router();

/**
 * @swagger
 * /api/withdrawals:
 *   post:
 *     summary: Create a withdrawal request
 *     tags: [Withdrawals]
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
 *               - paymentMethod
 *               - paymentDetails
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in R$ (minimum R$20)
 *               paymentMethod:
 *                 type: string
 *                 enum: [pix, bank_transfer]
 *               paymentDetails:
 *                 type: object
 *                 properties:
 *                   pixKey:
 *                     type: string
 *                   bankCode:
 *                     type: string
 *                   agency:
 *                     type: string
 *                   account:
 *                     type: string
 *     responses:
 *       200:
 *         description: Withdrawal request created
 */
router.post('/', clerkMiddleware(), createWithdrawal);

/**
 * @swagger
 * /api/withdrawals:
 *   get:
 *     summary: Get user's withdrawal history
 *     tags: [Withdrawals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, processing, completed, rejected]
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [pix, bank_transfer]
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
 *         description: Withdrawals list
 */
router.get('/', clerkMiddleware(), getUserWithdrawals);

/**
 * @swagger
 * /api/withdrawals/pending:
 *   get:
 *     summary: Get all pending withdrawals (admin only)
 *     tags: [Withdrawals]
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
 *         description: Pending withdrawals list
 */
router.get('/pending', clerkMiddleware(), getPendingWithdrawals);

/**
 * @swagger
 * /api/withdrawals/{id}/approve:
 *   post:
 *     summary: Approve a withdrawal request (admin only)
 *     tags: [Withdrawals]
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
 *         description: Withdrawal approved
 */
router.post('/:id/approve', clerkMiddleware(), approveWithdrawal);

/**
 * @swagger
 * /api/withdrawals/{id}/reject:
 *   post:
 *     summary: Reject a withdrawal request (admin only)
 *     tags: [Withdrawals]
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
 *         description: Withdrawal rejected
 */
router.post('/:id/reject', clerkMiddleware(), rejectWithdrawal);

/**
 * @swagger
 * /api/withdrawals/{id}/process:
 *   post:
 *     summary: Process a withdrawal (admin only) - Actually send the payment
 *     tags: [Withdrawals]
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
 *         description: Withdrawal processing initiated
 */
router.post('/:id/process', clerkMiddleware(), processWithdrawal);

export default router;
