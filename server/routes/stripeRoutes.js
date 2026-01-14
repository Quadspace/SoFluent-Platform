/**
 * Stripe Payment Routes
 * Handles Stripe payment intent creation
 */

import express from 'express';
import { createPaymentIntent } from '../controllers/stripeController.js';
import { rateLimiters } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * @swagger
 * /api/payments/stripe/create-intent:
 *   post:
 *     summary: Create Stripe payment intent
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
 *               - currency
 *               - courseId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in cents
 *               currency:
 *                 type: string
 *                 example: "brl"
 *               courseId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 clientSecret:
 *                   type: string
 *                 paymentIntentId:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Create payment intent (rate limited)
router.post('/create-intent', rateLimiters.payment, createPaymentIntent);

export default router;
