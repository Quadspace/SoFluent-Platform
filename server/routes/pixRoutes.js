/**
 * Pix Payment Routes
 * Brazilian instant payment integration routes
 */

import express from 'express';
import { createPixPayment, checkPixStatus, pixWebhook } from '../controllers/pixController.js';
import { rateLimiters } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * @swagger
 * /api/payments/pix/create:
 *   post:
 *     summary: Create Pix payment
 *     tags: [Payments]
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
 *               - courseId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in BRL
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pix payment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 qrCode:
 *                   type: string
 *                 paymentId:
 *                   type: string
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 */
// Create Pix payment (rate limited)
router.post('/create', rateLimiters.payment, createPixPayment);

/**
 * @swagger
 * /api/payments/pix/status/{paymentId}:
 *   get:
 *     summary: Check Pix payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, expired, failed]
 *                 payment:
 *                   type: object
 */
// Check payment status
router.get('/status/:paymentId', checkPixStatus);

/**
 * @swagger
 * /api/payments/pix/webhook:
 *   post:
 *     summary: Pix payment webhook
 *     tags: [Payments]
 *     description: Webhook endpoint for Pix payment notifications (signature verified)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
// Webhook (no rate limiting, but signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), pixWebhook);

export default router;
